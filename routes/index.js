const express = require("express");
const router = express.Router();
const httpClient = require('../http-client');
const setHeaders = () => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

router.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send({ response: res.data }).status(200);
});


router.get(':id/posts', (req, res) =>{
  setHeaders()
  const id = req.param.id
  httpClient.getPost(id)
  .then(result =>{
    console.log('resultado dos posts', result)
    res.json(result)
  })
  .cath(err =>{
    console.log('err', err)
    res.json({message: 'erro ao consultar os posts'}).status(500)
  })
})
module.exports = router;