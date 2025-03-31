const stateDataModel = require("../models/state");

exports.stateController = (req, res) => {
  stateName = req.body.stateName;
  stateName = stateName.replaceAll(" ", "").toLowerCase();
  stateDataModel
    .findOne({ name: stateName })
    .then((data) => {
      res.status(200).json({
        N: data.N,
        P: data.P,
        K: data.K,
        rainfall: data.rainfall,
        pH: data.pH,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: "Undefined Data" });
    });
};
