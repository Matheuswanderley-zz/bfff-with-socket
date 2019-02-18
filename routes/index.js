const express = require("express");
const router = express.Router();
const httpClient = require('../http-client');
const service = require('../service');
const setHeaders = (res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

router.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send({ response: res.data }).status(200);
});

router.get("/posts/:id", (req, res) =>{
  const id = req.params.id
  httpClient.getPosts(id)
  .then(result =>{
    setHeaders(res)
    res.json(result)
  })
  .catch(err =>{
    console.log('err', err)
    res.json({ error: err.message}).status(500)
  })
})
module.exports = router;