const router = require("express").Router();
const { body } = require("express-validator");
const { convertController } = require("../controllers/_index");

// Validators 

const convertMarkdownValidator = [
    body("markdown").notEmpty()
];


// Routers

router.post("/", convertMarkdownValidator, convertController.convertMarkdownToHTML);


module.exports = router;