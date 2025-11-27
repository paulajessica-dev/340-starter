const express = require("express")
const router = express.Router()

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Route to login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// GET → Show view Login Management
router.get(
  "/management",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);


// Route to register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Route to registration data
router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router
