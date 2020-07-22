const path = require("path");

const fileName = "CDI_Prices.csv";
const filePath = path.join(__dirname, "data", fileName);
const port = 5000;

module.exports = { fileName, filePath, port };
