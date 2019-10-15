const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')
const queryString = require('query-string')

// setting SENDGRID_API_KEY_STATIC_CONTACT_VALIDATION
sgMail.setApiKey(process.env.SENDGRID_API_KEY_STATIC_CONTACT_VALIDATION)

// getting informaion when one send Email

router.get('/', (req, res, next) => {
  const userAgent = req.headers['user-agent']// requests user agent
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  // setting an empty object
  const query = {}
  // Getting ip
  query['ip'] = ip
  //saving all info in object
  for (key in req.query) {
    query[key] = req.query[key]
  }

  if (req.query === undefined || req.query === null || req.query === '') {
    res.json('Sorry you have not aceess to this')
    return next()
  }

  var token = jwt.sign({ data: query }, process.env.SECRET_STATIC_CONTACT_VALIDATION)
  var tokenEmail = jwt.sign({ data: token }, process.env.SECRET_STATIC_CONTACT_VALIDATION, {
    expiresIn: '1h'
  })

  // appending token in our object
  query['token'] = tokenEmail

  let queryies = queryString.stringify(query)

  var mailOptions = {
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

  sgMail.send(mailOptions, function (err) {
    if (err) return next(err)
    res.render('verify', { data: query })
  })
})

router.get('/emailVerify', (req, res, next) => {

  const arr = []
  const data = req.query
  const tokenEmail = data.token
  try {
    const decoded = jwt.verify(tokenEmail, process.env.SECRET_STATIC_CONTACT_VALIDATION)

    // deleting token from out object
    delete data.token

    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        var innerObj = {}
        innerObj[prop] = data[prop];
        arr.push(innerObj)
      }
    }

    if (decoded.data) {
      var mailOptions = {
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
        res.redirect(process.env.REDIRECT_URL_STATIC_CONTACT_VALIDATION)
      })
    } else {
      res.json('Wrong Token. Please check again.')
    }
  } catch (err) {
    res.json('Sorry not authorized for you.')
  }
})

module.exports = router
