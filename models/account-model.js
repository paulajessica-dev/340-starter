const pool = require("../database/")

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'Client') 
      RETURNING *
    `
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
  } catch (error) {
    throw error  
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Update Register Account
 * ************************** */
async function updateRegister(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname, = $1, account_lastname = $2, account_email = $3, account_password = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
    return data.rows[0]
  } catch (error) {
    console.error("Update error: " + error)
  }
}


/* *****************************
* Return account data using account_id
* ***************************** */
async function getRegisterByAccountId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account password using account_id
* ***************************** */
async function updatePassword(account_id, newPassword) {
  return await pool.query(
    "UPDATE account SET account_password = $1 WHERE account_id = $2",
    [newPassword, account_id]
  )
}


module.exports = {checkExistingEmail, registerAccount, getAccountByEmail, updateRegister, getRegisterByAccountId, updatePassword}