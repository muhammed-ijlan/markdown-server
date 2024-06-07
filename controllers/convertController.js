const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");

function convertMarkdownToHTML(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let currentListType = null;

    for (const line of lines) {
        if (!line.trim()) {
            html += '<br>\n';
            continue;
        }

        if (line.startsWith('```')) {
            html += line.replace('```', '<pre><code>') + '\n';
            continue;
        }

        if (line.startsWith('#')) {
            const level = line.indexOf(' ');
            html += `<h${level}>${line.slice(level + 1)}</h${level}>\n`;
            continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
            if (currentListType !== 'ul') {
                html += currentListType ? `</${currentListType}>\n` : '';
                html += '<ul>\n';
                currentListType = 'ul';
            }
            html += `<li>${line.slice(2)}</li>\n`;
            continue;
        }

        if (/^\d+\.\s/.test(line)) {
            if (currentListType !== 'ol') {
                html += currentListType ? `</${currentListType}>\n` : '';
                html += '<ol>\n';
                currentListType = 'ol';
            }
            html += `<li>${line.replace(/^\d+\.\s/, '')}</li>\n`;
            continue;
        }

        if (line.startsWith('> ')) {
            html += `<blockquote>${line.slice(2)}</blockquote>\n`;
            continue;
        }

    }

    if (currentListType) html += `</${currentListType}>\n`;

    if (html.includes('<pre><code>')) html += '</code></pre>\n';

    return html.trim();
}

exports.convertMarkdownToHTML = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        const { markdown } = req.body;
        const html = convertMarkdownToHTML(markdown);
        let response = new ResponseBody("Markdown successfully converted to HTML", false, { html });
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};
