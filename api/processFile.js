// Imports
const fs = require("fs");
const { filePath } = require("./constants.js");
const parse = require("csv-parse/lib/sync");
const {
  parseDate,
  addDays,
  getDiffDays,
  yearlyToDailyInterest,
} = require("./utils.js");

// Read csv
const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

// Parse into list of objects and reverse order
const yearlyCDI = parse(fileContent, {
  columns: true,
  name: "dtDate",
  skip_empty_lines: true,
  cast: true,
  cast_date: parseDate,
}).reverse();

// Calculate daily interest rate and drop "sSecurityName" column
const dailyCDI = yearlyCDI.map(row =>
  Object.assign(
    {},
    {
      dtDate: row.dtDate,
      dLastTradePrice: yearlyToDailyInterest(row.dLastTradePrice),
    },
  ),
);

// Add missing dates
const filledDailyCDI = [];
dailyCDI.forEach((element, index) => {
  if (index === 0) return filledDailyCDI.push(Object.assign({}, element));
  const prevElement = dailyCDI[index - 1];
  let diff = getDiffDays(prevElement.dtDate, element.dtDate);
  for (let i = 1; i < diff; i++) {
    filledDailyCDI.push({
      dtDate: addDays(prevElement.dtDate, i),
      dLastTradePrice: 0,
    });
  }
  filledDailyCDI.push(Object.assign({}, element));
});

module.exports = filledDailyCDI;
