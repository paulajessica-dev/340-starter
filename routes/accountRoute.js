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

// GET → Show view Admin Login Management
router.get(
  "/managementadmin",
  accountController.authenticateToken,
  validate.checkAdmin,
  utilities.handleErrors(accountController.buildAdminManagement)
);

// GET → Show view Client Login Management
router.get(
  "/management",
  accountController.authenticateToken,
  utilities.handleErrors(accountController.buildManagement)
);

// Route to build account by editaccount view
router.get("/editregister/:account_id", utilities.handleErrors(accountController.buildEditRegister))

// Route to update account by editaccount view
router.post("/editregister", utilities.handleErrors(accountController.updateRegister)
)

// Route to update password by editaccount view
router.post("/updatepassword", utilities.handleErrors(accountController.updatePassword)
)

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
