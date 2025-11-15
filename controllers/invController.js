const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try{        
      const classification_id = req.params.classification_id
      const data = await invModel.getInventoryByClassificationId(classification_id)

      //If not found data
      if (!data || data.length === 0) {
        const err = new Error("Not found vehicle to this classification.")
        err.status = 404
        return next(err)
      }

      const grid = await utilities.buildClassificationGrid(data)
      //console.log("GRID:", grid)
      let nav = await utilities.getNav()
      const className = data[0].classification_name


      //console.log("Rendering classification page for:", className)
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })

    } catch (error){
        next(error)
    }
    
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
      const invId = req.params.inv_id
      const vehicle = await invModel.getVehicleByInvId(invId)

      //If id is invalid or not found
      if (!vehicle) {
        const err = new Error("Not found vehicle.")
        err.status = 404
        return next(err)
      }

      const detail = await utilities.buildVehicleDetail(vehicle)
      let nav = await utilities.getNav()
      console.log("Detail HTML:", detail);
      res.render("inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        detail
      })
    } catch (error) {
      next(error)
    }
}

module.exports = invCont