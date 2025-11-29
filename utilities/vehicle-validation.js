const { body, validationResult } = require("express-validator");
const utilities = require("./"); // seu index.js util
const invModel = require("../models/inventory-model");

const validate = {}

// ====== VALIDATION RULES ======
validate.vehicleRules = () => {
  return [
    body("classification_id")
    .isInt()
    .withMessage("Please choose a valid classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters.")
      .matches(/^\S+$/)
      .withMessage("Make cannot contain spaces."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters.")
      .matches(/^\S+$/)
      .withMessage("Make cannot contain spaces."),

    body("inv_description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be numeric."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be valid 4 digits."),

    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be numeric."),

    body("inv_color")
      .trim()
      .isAlpha()
      .withMessage("Color must contain letters only.")
  ];
};

// ====== CHECK VALIDATION RESULTS ======
validate.checkVehicleData = async (req, res, next) => {
  const errors = validationResult(req);
  const classifications = await invModel.getClassifications();

  if (!errors.isEmpty()) {
    return res.render("./inventory/addvehicle", {
      title: "Add New Vehicle",
      errors: errors.array(),
      classifications,
      locals: req.body
    });
  }
  next();
};

  // ====== CHECK VALIDATION RESULTS ======
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications()
    const classification_id = parseInt(req.body.classification_id)
    const classificationSelect =
    await utilities.buildClassificationSelected(classification_id, req.body.classification_name)

    return res.render("./inventory/editvehicle", {
      title: "Edit Vehicle",
      nav: await utilities.getNav(),
      errors: errors.array(),
      classificationSelect,
      ...req.body
    })
  }
  next()
}

module.exports = validate
