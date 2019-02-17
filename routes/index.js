const express = require("express");
const router = express.Router();
const httpClient = require('../http-client');
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
    console.log('resultado dos posts', result)
    res.json(result)
  })
  .catch(err =>{
    console.log('err', err)
    res.json({message: 'erro ao consultar os posts'}).status(500)
  })
})
module.exports = router;