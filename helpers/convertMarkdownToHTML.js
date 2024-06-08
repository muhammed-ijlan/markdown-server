
function convertMarkdownToHTML(markdown) {

    const lines = markdown.split('\n');
    let html = '';
    let inCodeBlock = false;
    let inUnorderedList = false;
    let inOrderedList = false;

    const closeOpenTags = () => {
        if (inUnorderedList) {
            html += '</ul>\n';
            inUnorderedList = false;
        }
        if (inOrderedList) {
            html += '</ol>\n';
            inOrderedList = false;
        }
    };

    const processLine = (line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            html += '<br>\n';
            return;
        }

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                html += '</code></pre>\n';
                inCodeBlock = false;
            } else {
                closeOpenTags();
                html += '<pre><code>';
                inCodeBlock = true;
            }
            return;
        }

        if (inCodeBlock) {
            html += line + '\n';
            return;
        }

        if (trimmedLine.startsWith('#')) {
            closeOpenTags();
            const level = trimmedLine.split(' ')[0].length;
            const content = trimmedLine.slice(level).trim();
            html += `<h${level}>${content}</h${level}>\n`;
            return;
        }

        if (trimmedLine.match(/^[-*+]\s+/)) {
            if (!inUnorderedList) {
                closeOpenTags();
                html += '<ul>\n';
                inUnorderedList = true;
            }
            html += `<li>${trimmedLine.slice(2)}</li>\n`;
            return;
        } else if (inUnorderedList) {
            html += '</ul>\n';
            inUnorderedList = false;
        }

        if (trimmedLine.match(/^\d+\.\s+/)) {
            if (!inOrderedList) {
                closeOpenTags();
                html += '<ol>\n';
                inOrderedList = true;
            }
            html += `<li>${trimmedLine.replace(/^\d+\.\s+/, '')}</li>\n`;
            return;
        } else if (inOrderedList) {
            html += '</ol>\n';
            inOrderedList = false;
        }

        if (trimmedLine.startsWith('> ')) {
            closeOpenTags();
            html += `<blockquote>${trimmedLine.slice(2)}</blockquote>\n`;
            return;
        }

        if (trimmedLine.startsWith('![')) {
            const altTextStart = trimmedLine.indexOf('[') + 1;
            const altTextEnd = trimmedLine.indexOf(']');
            const altText = trimmedLine.slice(altTextStart, altTextEnd);
            const urlStart = trimmedLine.indexOf('(') + 1;
            const urlEnd = trimmedLine.indexOf(')');
            const url = trimmedLine.slice(urlStart, urlEnd);
            html += `<img width="200px" src="${url}" alt="${altText}" />\n`;
            return;
        }

        html += `<p>${trimmedLine}</p>\n`;
    };

    for (const line of lines) {
        processLine(line);
    }

    closeOpenTags();

    if (inCodeBlock) {
        html += '</code></pre>\n';
    }

    return html.trim();
}

module.exports = { convertMarkdownToHTML };
