const express = require("express");
const router = express.Router();
const app = require('../app');
router.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send({ response: res.data }).status(200);
});

router.get('/post', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send({'FromApi' : this.getApiAndEmit}).status(200);
})
module.exports = router;