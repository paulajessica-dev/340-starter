const favoriteModel = require("../models/favorite-model")
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


/* ***************************
 *  Build favorite view
 * ************************** */

async function buildFavorite(req, res, next) {
  try {
    const account_id = req.session.account_id;
    if (!account_id) {
      req.flash("notice", "You must be logged in to see your favorites.");
      return res.redirect("/account/login");
    }

    const favorites = await invModel.getFavoritesByAccountId(account_id);
    const nav = await utilities.getNav();

    res.render("favorite", {
      title: "My Favorites",
      nav,
      favorites
    });

  } catch (error) {
    next(error);
  }
}


/* ***************************
 *  Add Vehicle to Favorites
 * ************************** */

async function addFavorite(req, res) {
  try {
    
    const inv_id = req.body.inv_id || (req.body && req.body.inv_id);
    if (!inv_id) {
      return res.status(400).json({ success: false, message: "inv_id is required" });
    }

    
    const account_id = res.locals?.accountData?.account_id;
    if (!account_id) {
      return res.status(401).json({ success: false, message: "Unauthenticated user" });
    }

    // check the duplicates
    const exists = await favoriteModel.checkFavorite(account_id, inv_id);
    if (exists) {
      return res.status(409).json({ success: false, message: "Already is a favorite." });
    }

    
    await favoriteModel.addFavorite(account_id, inv_id);

    return res.status(200).json({ success: true, message: "Favorite added." });
  } catch (err) {
    
    console.error("addFavorite error:", err);
    
    return res.status(500).json({ success: false, message: "Internal error while adding to favorites." });
  }
}


module.exports = { buildFavorite, addFavorite }
