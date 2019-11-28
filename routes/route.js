const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')
const queryString = require('query-string')
const store = require('store')
const disposable = require('disposable-email');

// setting SENDGRID_API_KEY_STATIC_CONTACT_VALIDATION
sgMail.setApiKey(process.env.SENDGRID_API_KEY_STATIC_CONTACT_VALIDATION)

// getting informaion when one send Email

router.get('/', (req, res, next) => {

  const userAgent = req.headers['user-agent']// requests user agent
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  
  // check for userAgent that it is curl and avoid sending emailSent
  if (userAgent.includes("curl")) {
    return res.json("Cannot use curl request. This software is for web use only")
  }

  // setting an empty object
  const query = {}
  // Getting ip
  query['ip'] = ip

  if (req.query === undefined || req.query === null || req.query === '') {
    return res.json('Sorry you have not aceess to this')
  }

  // Checking req.query for name, email and message
  const { name, email, message} = req.query
  if (!name || !email || !message) {
    return res.json("Don't be smart and enter all fields " + ip);
  }

  //saving all info in object
  for (key in req.query) {
    query[key] = req.query[key]
  }

  // Validate email address
  emailValidated = disposable.validate(email)
  if (!emailValidated) {
    return res.json("Cannot use this email address, please go back and enter valid email address");
  }

  let token = jwt.sign({ data: query }, process.env.SECRET_STATIC_CONTACT_VALIDATION)
  let tokenEmail = jwt.sign({ data: token }, process.env.SECRET_STATIC_CONTACT_VALIDATION, {
    expiresIn: '1h'
  })

  // appending token in our object
  query['token'] = tokenEmail

  let queryies = queryString.stringify(query)

  let mailOptions = {
    from: 'Verify@Email.com', // sender address
    to: query.email, // list of receivers
    subject: 'Verify Your Email', // Subject line
    html: `
            <div style="background-color:#2E4053;color:#F1948A;font-style:italic;width:800px;font-size:24px;padding:20px;">
            Click to verify your email : <a href="${process.env.HOSTED_URL_STATIC_CONTACT_VALIDATION}/verify/emailVerify?${queryies}" style="color:#FAE5D3">Click to verify</a>
            <br/><br/>
            After clicking the link your message will be sent to ` + process.env.EMAIL_RECEIVER_STATIC_CONTACT_VALIDATION + `.
            <br/><br/>
            Please verify in 1 hour before it expires.
            <br/><br/>
            Thank you for your patience
            </div>
            `
  }

  const emailSent = store.get("emailSent")
  if (emailSent === undefined) {
    sgMail.send(mailOptions, function (err) {
      if (err) { 
        console.error(`${err.message} with code ${err.code}`)
        return res.json("Cannot send email to this address");
      }
      store.set("emailSent", { verified: "true" })
      store.set("userVerification", { verified: "false" })
      res.render('verify', { data: query })
    })
  } else {
    res.render('verify', { data: query })
  }
})

router.get('/emailVerify', (req, res, next) => {

  const arr = []
  const data = req.query
  const tokenEmail = data.token
  const verifiedData = store.get("userVerification")
  if (verifiedData && verifiedData.verified === "false") {
    try {
      const decoded = jwt.verify(tokenEmail, process.env.SECRET_STATIC_CONTACT_VALIDATION)

      // deleting token from out object
      delete data.token

      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          let innerObj = {}
          innerObj[prop] = data[prop];
          arr.push(innerObj)
        }
      }

      if (decoded.data) {
        let mailOptions = {
          from: data.email, // sender address
          to: process.env.RECEIVER_EMAIL_STATIC_CONTACT_VALIDATION, // list of receivers
          subject: 'Contact Message from your site', // Subject line
          html: `
                <div style="background-color:#2E4053;color:#F1948A;font-style:italic;width:800px;font-size:24px;padding:20px;">
                ${arr.map((item) => `
                <h3>`+ Object.keys(item) + `: ` + Object.values(item) + `</h3>
              `.trim()).join('')}
                </div>`
        }

        sgMail.send(mailOptions, function (err) {
          if (err) return next(err)
          store.clearAll()
          res.redirect(process.env.REDIRECT_URL_STATIC_CONTACT_VALIDATION)
        })
      } else {
        res.json('Wrong Token. Please check again.')
      }
    } catch (err) {
      res.json('Sorry not authorized for you.')
    }
  } else { 
    res.json('Email already verified')
  }
})

module.exports = router
