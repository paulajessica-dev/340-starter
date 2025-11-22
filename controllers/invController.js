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

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Management",
    nav,
  })
}

/* ****************************************
*  Deliver Add Classification view (GET)
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/addclassification", {
    title: "Add New Classification",
    nav,
    errors: [],
    classification_name: ""
  })
}


/* ****************************************
*  Process Add Classification (POST)
* *************************************** */
invCont.addClassification = async function (req, res) {
  //console.log("BODY RECEBIDO:", req.body)

  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  if (regResult.rowCount > 0) {
    req.flash("notice", `Classification successfully added.`)
    return res.status(201).redirect("/inv")
  }

  req.flash("notice", "Failed to add classification.")
  res.status(500).render("inventory/addclassification", {
    title: "Add New Classification",
    nav,
    errors: [],
    classification_name
  })
}


/* ****************************************
*  Deliver Add Vehicle view (GET)
* *************************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getAllClassifications()
  res.render("inventory/addvehicle", {
    title: "Add New Vehicle",
    nav,    
    classifications,
  })
}

/* ****************************************
*  Process Add Vehicle (POST)
* *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const { 
    classification_name,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;

  try {
    
    const price = parseFloat(inv_price);
    const year = parseInt(inv_year);
    const miles = parseInt(inv_miles);
    const classification_id = parseInt(classification_name);

    const regResult = await invModel.addVehicle(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      price,
      year,
      miles,
      inv_color,
      classification_id
    );

    if (regResult.rowCount > 0) {
      req.flash("notice", `Vehicle successfully added.`);
      return res.status(201).redirect("/inv");
    }

    // Se falhou o insert
    req.flash("notice", "Failed to add vehicle.");
    res.status(500).render("inventory/addvehicle", {
      title: "Add New Vehicle",
      nav,
      classifications: await invModel.getAllClassifications(),
      locals: req.body,
      errors: []
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
}




module.exports = invCont