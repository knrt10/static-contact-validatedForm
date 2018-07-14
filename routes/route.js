const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')

// setting SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
  for(key in req.query) {
    query[key] = req.query[key]
  }

  if (req.query === undefined || req.query === null || req.query === '') {
    res.json('Sorry you have not aceess to this')
    return next()
  }

  var token = jwt.sign({data: query}, process.env.SECRET)
  var tokenEmail = jwt.sign({data: token.slice(17)}, process.env.SECRET, {
    expiresIn: '1h'
  })
  var decoded = jwt.verify(tokenEmail, process.env.SECRET)
  var data = decoded.data

  // appending token in our object
  query['token'] = data

  var mailOptions = {
      from: 'Verify@Email.com', // sender address
      to: query.email, // list of receivers
      subject: 'Verify Your Email', // Subject line
      html: `
            <div style="background-color:#2E4053;color:#F1948A;font-style:italic;width:800px;font-size:24px;padding:20px;">
            Your Email activation code is : <b style="color:#FAE5D3">` + data + `</b>
            <br/><br/>
            Enter this token to send email to ` + process.env.EMAIL_RECEIVER + `.
            <br/><br/>
            Please verify in 1 hour before it expires.
            <br/><br/>
            Thank you for your patience
            </div>
            `
    }

  sgMail.send(mailOptions, function (err) {
    if (err) return next(err)
  res.render('verify', {data: query})
  })
})

router.post('/', (req, res, next) => {

  const arr = []
  const tokenUser = req.body.token
  const data = JSON.parse(req.body.data)
  const tokenEmail = data.token

  // deleting token from out object
  delete data.token

  if (tokenUser === '' || tokenUser === null || tokenUser === undefined) {
    res.json('Please enter your token')
    return next()
  }

  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var innerObj = {}
      innerObj[prop] = data[prop];
      arr.push(innerObj)
    }
  }

  if (tokenEmail === tokenUser) {
    var mailOptions = {
      from: data.email, // sender address
      to: process.env.RECEIVER_EMAIL, // list of receivers
      subject: 'Contact Message from your site', // Subject line
      html: `
            <div style="background-color:#2E4053;color:#F1948A;font-style:italic;width:800px;font-size:24px;padding:20px;">
            ${arr.map((item) => `
            <h3>`+ Object.keys(item) + `: `+ Object.values(item) +`</h3>
          `.trim()).join('')}
            </div>`
    }

    sgMail.send(mailOptions, function (err) {
      if (err) return next(err)
      res.redirect(process.env.REDIRECT_URL)
    })
  } else {
    res.json('Wrong Token. Please check again.')
  }
})

module.exports = router
