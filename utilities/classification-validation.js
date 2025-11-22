const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const validate = {}

/* ****************************************
 * Classification name rules
 **************************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
  ]
}

/* ****************************************
 * Check validation results
 **************************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    
    return res.status(400).render("inventory/addclassification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }

  next()
}

module.exports = validate
