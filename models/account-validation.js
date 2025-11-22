const accountModel = require("../models/account-model")

// valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  })

  