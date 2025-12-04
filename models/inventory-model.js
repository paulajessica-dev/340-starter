const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


async function getAllClassifications() {  
    try {
      const data = await pool.query(
      "SELECT classification_id, classification_name FROM classification ORDER BY classification_name"
    )
    return data.rows
    } catch (error) {
      console.error("getclassifications error " + error)
    } 
 
}




/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory data
 * ************************** */
async function getVehicles(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
}


/* ***************************
 *  Get all inventory items and details by inv_id
 * ************************** */
async function getVehicleByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getinventorybyId error " + error)
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = `
      INSERT INTO classification
        (classification_name) 
      VALUES 
        ($1) 
      RETURNING *
    `
    return await pool.query(sql, [
      classification_name
    ])
  } catch (error) {
    throw error   
  }
}


/* *****************************
*   Add new vehicle
* *************************** */
async function addVehicle(
  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
  inv_price, inv_year, inv_miles, inv_color, classification_id
) {
  try {
    const sql = `
      INSERT INTO inventory
        (inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
         inv_price, inv_year, inv_miles, inv_color, classification_id)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    ])
  } catch (error) {
    throw error  
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateVehicle(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,      
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("Update error: " + error)
  }
}



/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("Delete error: " + error)
  }
}



module.exports = {getClassifications, getAllClassifications, getInventoryByClassificationId,getVehicles,getVehicleByInvId, addClassification, addVehicle,updateVehicle, deleteVehicle}