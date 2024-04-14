const stockModelCtrl = require("../../models/stockModel");

const saveStockdata = async (ticker, price) => {
  stockModelCtrl.stockModel
    .find({ ticker: ticker })
    .then((stock) => {
     if (stock.length == 0) {      
      var newstock = stockModelCtrl.stockModel({"ticker":ticker,"name":ticker,"curprice":price});
      newstock.save((err, data) => {
       if (err) console.log(err);
     });
     }
     else{
      stock[0].curprice = price;
      var newstock = stockModelCtrl.stockModel(stock[0]);
      newstock.save((err, data) => {
        if (err) console.log(err);
      });
     }
    })
    .catch((err) => console.log(err));
};
module.exports = saveStockdata;