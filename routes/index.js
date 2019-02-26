const express = require("express");
const router = express.Router();
const httpClient = require('../http-client');
var jwt = require("jwt-simple");
var auth = require("../auth")();
var users = require("../user");
var cfg = require("../config/index");


const setHeaders = (res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

router.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send({ response: res.data }).status(200);
});

router.get("/posts/:id", auth.authenticate(), (req, res) =>{
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
router.get('/onload/deputados',auth.authenticate(), (req, res) =>{
  httpClient.getDeputados()
  .then(result =>{
    setHeaders(res)
    res.json(result)
  })
  .catch(err =>{
    console.log('err', err)
    res.json({error: err.message}.status(500))
  })
})
router.post('/auth', (req, res) =>{
  setHeaders(res)
  if(req.body.email && req.body.password){
    let email = req.body.email;
    let password = req.body.password;
    let user = users.find((u)=>{
      return u.email === email && user.password === password;
    });
    if(user){
      let payload = {id: user.id};
      let token = jwt.encode(payload, cfg.jwtSecret);
      res.json({token: token})
    }else {
      res.sendStatus(401)
    } 
  } else {
    res.sendStatus(401)
  }
})
module.exports = router;