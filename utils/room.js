
module.exports = {
  calculatePrice: (roomType, startTime, endTime) => {
    console.log("room type = ", roomType);
    roomTypePricePerHour = { ATYPE: 100, BTYPE: 80, CTYPE: 50 };
    let hours = (endTime - startTime) / (3600 * 1000);
    console.log("Hours = ", hours);
    let price =
      roomTypePricePerHour[roomType] * hours;
    return Math.ceil(price);
  },

  findRefund: (startTime, paidAmount) => {
    let hours = (startTime - new Date()) / (3600 * 1000);

      let refund = paidAmount;
      if (hours >= 24 && hours <= 48) {
        refund = paidAmount/2;
      } else if(hours <= 0 && hours < 24) {
        refund = 0;
      }

      return refund;
  },
};
