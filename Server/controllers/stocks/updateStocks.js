const saveStockdata = require("../stocks/saveStockData");
const updateOrderCtrl = require("../orders/updateOrder");
const tickers = require("../../data/stockTickers");

const updateStocks = async()=>{
const tv = [];
for (let i = 0; i < 6; i++) {
  var tradingviewinstance = require("@mathieuc/tradingview");
  tv.push(tradingviewinstance);
}

var index = 0;

var chart = [];

for (let i = 0; i < Math.min(tv.length, tickers.length); i++, index++) {
  index %= tickers.length;
  var client = new tv[i].Client();
  var xyz = new client.Session.Chart();
  chart.push(xyz);

  chart[i].setMarket(tickers[index], {
    timeframe: "D",
  });

  chart[i].onError((...err) => {});

  chart[i].onSymbolLoaded(() => {});

  chart[i].onUpdate(() => {
    if (!chart[i].periods[0]) return;
    saveStockdata(chart[i].infos.name, chart[i].periods[0].close); // Saves stock Data in DB
    updateOrderCtrl.updateOrder(chart[i].infos.name, chart[i].periods[0].close); // Updates order Data in DB
  });
}

setInterval(() => {
  for (let i = 0; i < 6; i++) {
    index %= tickers.length; // Keeping index in bounds
    chart[i].setMarket(tickers[index], {
      // changes ticker
      timeframe: "D",
    });
    index++;
    index %= tickers.length;
  }
}, 1000);
}

module.exports = updateStocks;
