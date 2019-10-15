require('dotenv').config()
// Start === requiring express modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const port = process.env.PORT_STATIC_CONTACT_VALIDATION || 3000
// === END

// Setting views for Administration

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Start === requiring files
const route = require('./routes/route')
// === END

// Start === Setting modules to use
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// === END

// Start === Getting router and setting them
app.use('/verify', route)
// === END

// Start === setting PORT
app.listen(port, () => {
  console.log('Sever running on port ' + port)
})
// === END
