function parseDate(date) {
  if (date.indexOf("/") === -1) return date;
  const [day, month, year] = date.split("/");
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const newDate = new Date();
  newDate.setTime(date.getTime() + days * 86400000);
  return newDate;
}

function getDiffDays(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function yearlyToDailyInterest(yearlyRate) {
  return Math.pow(1 + yearlyRate / 100, 1 / 252) - 1;
}

function getPrices(input, data) {
  const { investmentDate, currentDate, cdbRate } = input;

  // Get reference date to calculate index (like a hashtable)
  const refDate = data[0].dtDate;

  const startIndex = getDiffDays(refDate, investmentDate);
  const endIndex = getDiffDays(refDate, currentDate);
  const slicedData = data.slice(startIndex, endIndex);

  return slicedData.map((element, index, array) => {
    const prevCumRate = index === 0 ? 1000 : array[index - 1].unitPrice;
    return (array[index] = {
      date: element.dtDate,
      unitPrice: prevCumRate * (1 + element.dLastTradePrice * (cdbRate / 100)),
    });
  });
}

module.exports = {
  parseDate,
  addDays,
  getDiffDays,
  yearlyToDailyInterest,
  getPrices,
};
