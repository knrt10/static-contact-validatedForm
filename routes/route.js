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

  const name = req.query.name
  const email = req.query.email
  const message = req.query.message

  var token = jwt.sign({data: (name + email)}, process.env.SECRET)
  var tokenEmail = jwt.sign({data: token.slice(17)}, process.env.SECRET, {
    expiresIn: '1h'
  })
  var decoded = jwt.verify(tokenEmail, process.env.SECRET)
  var data = decoded.data

  var mailOptions = {
    from: 'Verify@Email.com', // sender address
    to: email, // list of receivers
    subject: 'Verify Your Email', // Subject line
    html: `
          <div style="background-color:#2E4053;color:#F1948A;font-style:italic;width:800px;font-size:24px;padding:20px;">
          Hello <b style="color:#FAE5D3"> ` + name + `</b>
          <br/><br/>
          Your Email activation code is : <b style="color:#FAE5D3">` + data + `</b>
          <br/><br/>
          Enter this token to send email to Kautilya Tripathi.
          <br/><br/>
          Please verify in 1 hour before it expires.
          <br/><br/>
          Thank you for your patience
          </div>
          `
  }

  const respObject = {
    ipaddress: ip,
    software: userAgent,
    name: name,
    email: email,
    message: message,
    token: data
  }

  sgMail.send(mailOptions, function (err) {
    if (err) return next(err)
    res.render('verify', {data: respObject})
  })
})

router.post('/:ip/:software/:name/:email/:message/:token', (req,res,next)=>{
  const ip = req.params.ip
  const software = req.params.software
  const name = req.params.name
  const email = req.params.email
  const message = req.params.messgae
  const tokenParam = req.params.token
  const tokenEmail = req.body.token
})

module.exports = router
