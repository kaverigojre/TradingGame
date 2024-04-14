const stockModel = require("../../models/stockModel");

const getStocks = async (req, res) => {
  try {
    let stocksData = await stockModel.stockModel.find({});
    res.status(200).send(stocksData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error ");
  }
};

module.exports = { getStocks };
