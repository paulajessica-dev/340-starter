// Needed Resources 
const express = require("express")
const router = new express.Router() 
const favoriteController = require("../controllers/favoriteController")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")


// Route to favorite view
router.get(
  "/:account_id",
  
  accountController.authenticateToken,
  utilities.handleErrors(favoriteController.buildFavorite)
)

// Route to add favorite view
router.post(
  "/addvehicle",
  accountController.authenticateToken,
  utilities.
  handleErrors(favoriteController.addFavorite)
)

// Route to delete favorite view
router.post(
  "/deletevehicle",
  utilities.handleErrors(favoriteController.deleteFavorite)
)

module.exports = router;