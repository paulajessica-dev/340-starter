const express = require("express")
const router = express.Router()

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Route to registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router
