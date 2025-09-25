import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import htmlDocx from "html-docx-js";
import hljs from "highlight.js";

const md_To_Docx = async (markdown) => {
  const md = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            // hljs.highlight(lang, str, true).value
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (__) {}
      }

      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });
  const htmlContent = md.render(markdown);
  //console.log("check htmlContent ", htmlContent);

  const styledHtmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            code {
              background-color: #eeeeee;
              color: #d6337c;
              border-radius: 5px;
              padding: 2px 4px;
              font-family: Consolas, "Courier New", monospace;
            }
            pre {
              background-color: #f5f5f5;
              border-radius: 3px;
              padding: 10px;
              font-family: Consolas, "Courier New", monospace;
              white-space: pre-wrap;
            }
            strong {
              font-weight: bold;
            }
            .hljs {
              display: block;
              overflow-x: auto;
              padding: 0.5em;
              background: #eeeeee;
            }
            .hljs-comment, .hljs-quote {
              color: #888888;
            }
            .hljs-keyword, .hljs-selector-tag, .hljs-subst {
              color: #145d87;
              font-weight: bold;
            }
            .hljs-literal, .hljs-number, .hljs-tag .hljs-attr {
              color: rgb(174, 129, 255);
            }
            .hljs-string, .hljs-doctag {
              color: #16771a;
            }
            .hljs-title, .hljs-section, .hljs-name {
              color: #a1891c;
              font-weight: bold;
            }
            .hljs-regexp, .hljs-bullet, .hljs-link {
              color: #009999;
            }
            .hljs-meta {
              color: #e90;
            }
            .hljs-attribute {
              color: #0000ff;
            }
            .hljs-emphasis {
              font-style: italic;
            }
            .hljs-strong {
              font-weight: bold;
            }
            .hljs-formula {
              background: #eeeeee;
            }
            .hljs-bullet {
              color: #d6337c;
            }
            .hljs-code {
              color: #145d87;
            }
          </style>
        </head>
        <body>
              <header>
              <h4>Conversation Messages </h4>
              <h6>
              ${new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Bangkok",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
              </h6>
              </header>
              ${htmlContent}
        </body>
      </html>
    `;
  const docxBuffer = htmlDocx.asBlob(styledHtmlContent);
  const buffer = Buffer.from(await docxBuffer.arrayBuffer());

  const fileName = `conversation-messages-${Date.now()}.docx`;
  //const filePath = path.join(__dirname, `../../public/downloads/${fileName}`);
  const filePath = "./src/public/downloads/" + fileName;

  fs.writeFileSync(filePath, buffer);
  return fileName;
};

export default md_To_Docx;