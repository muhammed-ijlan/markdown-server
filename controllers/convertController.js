
const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { marked } = require("marked");



exports.convertMarkdownToHTML = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        const { markdown } = req.body;
        const html = marked(markdown);
        let response = new ResponseBody("Markdown successfully converted to HTML", false, { html });
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};
