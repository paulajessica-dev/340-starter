const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")



const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  //console.log("buildByClassificationId called with", req.params.classification_id)  
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  console.log("GRID:", grid)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  console.log("Rendering classification page for:", className)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont