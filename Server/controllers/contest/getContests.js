const contestModel = require("../../models/contestModel");

const getContests = async (req, res) => {
  var queryobj = { ...req.query };

  const exclude = ["page", "sort", "limit", "fields"];
  exclude.forEach((el) => delete queryobj[el]);
  query = contestModel.contestModel.find(queryobj);

  if (req.query.limit) {
    var limit = req.query.limit;
    query = query.limit(limit);
  }
  querry = query.sort("-createdAt");
  const data = await query;
  res.send(data);
};

module.exports = { getContests };
