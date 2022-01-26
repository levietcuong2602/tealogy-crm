const moment = require('moment');

const getDatesBetweenTwoDates = (
  startDate = new Date(0),
  endDate = new Date(),
) => {
  const dates = [];
  let currentDate = startDate;
  // eslint-disable-next-line func-names
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(moment(currentDate).format('DD-MM-YYYY'));
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

module.exports = { getDatesBetweenTwoDates };
