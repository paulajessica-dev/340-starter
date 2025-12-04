const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Build Management View
 * *************************************** */
async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash(),
    customHeader: true,
    account_id: accountData.account_id
  })
}

/* ****************************************
 *  Build Admin Management View
 * *************************************** */
async function buildAdminManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/managementadmin", {
    title: "Account Management",
    nav,
    messages: req.flash(),
    customHeader: true,
    account_id: accountData.account_id
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

        const payload = {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email,
          account_type: accountData.account_type
        }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h"})
      const cookieOptions = {  httpOnly: true,   maxAge: 3600 * 1000}

      if(process.env.NODE_ENV !== 'production') {
        cookieOptions.secure = false;
      }
      res.cookie("jwt", accessToken, cookieOptions)

      if (payload.account_type.toLowerCase() === "admin") {
        return res.redirect("/account/managementadmin")
      }
      return res.redirect("/account/management")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* *******************************
 *  Process to take decode jwt
 *********************************/
async function authenticateToken(req, res, next) {
  console.log("authenticateToken: req.cookies =", req.cookies)
  const token = req.cookies && req.cookies.jwt
  if (!token) {
    console.log("authenticateToken: no token found")
    req.flash("notice", "You must log in first.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("authenticateToken: decoded =", decoded)
    req.account = decoded
    res.locals.accountData = decoded
    next()
  } catch (err) {
    console.log("authenticateToken: verify error =", err.message)
    req.flash("notice", "Session expired. Please log in again.")
    return res.redirect("/account/login")
  }
}


/* ***************************
 *  Build edit register view
 * ************************** */
async function buildEditRegister(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()

  const itemData = await accountModel.getRegisterByAccountId(account_id)
  
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`
  res.render("./account/editregister", {
    title: "Edit " + itemName,    
    nav,
    errors: [],
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
    account_password: itemData.account_password,
    account_type: itemData.account_type
  })
}



/* ***************************
 *  Update Register Data
 * ************************** */
async function updateRegister(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_email
  } = req.body
  const updateResult = await accountModel.updateRegister(
    account_id,
    account_firstname,
    account_email
  )
  
  if (updateResult) {
    const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/account/managementadmin")
  } else {    
    const itemData = await accountModel.getRegisterByAccountId(account_id)  
        
    const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/editregister", {
    title: "Edit " + itemName,
    nav,    
    errors: [],
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname
    })
  }
  
}

/* ***************************
 *  Update Password Data
 * ************************** */

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  await accountModel.updatePassword(account_id, hashedPassword)

  req.flash("notice", "Password updated successfully.")
  res.redirect(`/account/managementadmin`)
}



module.exports = { buildLogin, buildRegister, registerAccount, buildManagement, buildAdminManagement, accountLogin, authenticateToken, buildEditRegister, updateRegister, updatePassword}
