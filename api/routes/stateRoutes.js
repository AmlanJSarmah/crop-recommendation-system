const express = require("express");
const stateController = require("../controllers/stateController");
const router = express.Router();

router.post("/state", stateController.stateController);

module.exports = router;
