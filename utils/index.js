const Op = require('sequelize').Op
const Booking = require('../models/Booking');

const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  while (startDate < endDate) {
    dates = [...dates, new Date(startDate)]
    startDate.setDate(startDate.getDate() + 1)
  }
  dates = [...dates, endDate]
  return dates
}

const canBookThoseDates = async (houseId, startDate, endDate) => {  
  const results = await Booking.findAll({
    where: {
      houseID: houseID,
      startDate: {
        [Op.lte]: new Date(endDate)
      },
      endDate: {
        [Op.gte]: new Date(startDate)
      }
    }
  })
  return !(results.length > 0)
}

module.exports = { getDatesBetweenDates, canBookThoseDates }