import MarkdownIt from "markdown-it";
const he = require("he");
import path from "path";
import fs from "fs";

const md_To_Txt = (markdown) => {
  // Chuyển đổi Markdown thành HTML
  const md = new MarkdownIt();
  const htmlContent = md.render(markdown);

  // Loại bỏ HTML tags và giải mã các ký tự HTML entities
  const plainText = he.decode(htmlContent.replace(/<[^>]*>/g, ""));

  const fileName = `conversation-messages-${Date.now()}.txt`;
  //const filePath = path.join(__dirname, `../../public/downloads/${fileName}`);
  const filePath = "./src/public/downloads/" + fileName;
  fs.writeFileSync(filePath, plainText);
  return fileName;
};

export default md_To_Txt;