const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorite (account_id, inv_id)
    VALUES ($1, $2)
  `
  return await pool.query(sql, [account_id, inv_id])
}


async function checkFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT * FROM favorite
      WHERE account_id = $1 AND inv_id = $2
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows.length > 0
  } catch (error) {
    throw error
  }
}

async function getFavoritesByAccountId(account_id) {
  try {
  const sql = `
    SELECT 
        i.inv_id,
        i.inv_image,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price
      FROM favorite f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
  `;
  const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    throw error
  }
}

async function getFavoriteIdsByUser(account_id) {
  const result = await pool.query(
    "SELECT array_agg(inv_id) AS ids FROM favorites WHERE account_id = $1",
    [account_id]
  )

  return result.rows[0].ids || []
}

module.exports = { addFavorite, checkFavorite, getFavoritesByAccountId, getFavoriteIdsByUser}