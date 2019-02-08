const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send({ "FromAPI": res.data }).status(200);
});
module.exports = router;