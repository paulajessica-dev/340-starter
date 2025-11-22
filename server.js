/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorHandler = require("./middleware/errorHandler")
const session = require("express-session")
const messages = require("express-messages")
const pool = require('./database/')
const bodyParser = require("body-parser")



/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(express.static("public"))


// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)



/* ***********************
 * Test Error Route
 *************************/
app.get("/error", (req, res, next) => {
  const error = new Error("Something went wrong. We're working to fix it!")
  error.status = 500
  next(error)
})

/* ***********************
 * 404 - Not Found Handler
 *************************/
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page."
  })
})

/* ***********************
 * Global Error Handler (FINAL)
 *************************/
app.use(errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
