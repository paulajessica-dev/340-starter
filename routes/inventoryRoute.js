// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validateclassification = require("../utilities/classification-validation")
const validatevehicle = require("../utilities/vehicle-validation")

// Route to build inventory by classification view
router.get("/type/:classification_id", invController.buildByClassificationId)

// Route to build inventory by inventory view
router.get("/detail/:inv_id", invController.buildByInvId)

// Route to build inventory by management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory by update view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditVehicle))

// Route to update inventory by update view
router.post("/editvehicle",
  validatevehicle.vehicleRules(),
  validatevehicle.checkUpdateData,
  utilities.handleErrors(invController.updateVehicle)
)

// Route to build inventory by delete view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteVehicle))

// Route to delete inventory by update view
router.post("/deletevehicle",
  utilities.handleErrors(invController.deleteVehicle)
)


// Route to build a new inventory by management view
router.get("/", invController.buildManagement)

// Route to build a new inventory by addclassification view
router.get("/addclassification", utilities.handleErrors(invController.buildAddClassification))
// Route to add new classification
router.post(
  "/addclassification",
  validateclassification.classificationRules(),
  validateclassification.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build a new inventory by addvehicle view
router.get("/addvehicle", utilities.handleErrors(invController.buildAddVehicle))

// Route to add new vehicle
router.post(
  "/addvehicle",
  validatevehicle.vehicleRules(),
  validatevehicle.checkVehicleData,  
  utilities.handleErrors(invController.addVehicle)
)

// Route to favorite view
router.get(
  "/favorite",
  utilities.handleErrors(invController.buildFavorite)
)

// Route to add favorite view
router.post(
  "/favorite/addvehicle",
  utilities.handleErrors(invController.addFavorite)
)

// Route to delete favorite view
router.post(
  "/favorite/deletevehicle",
  utilities.handleErrors(invController.deleteFavorite)
)

module.exports = router;