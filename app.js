const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const responseTime = require('response-time')
const redis = require('redis');

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);

//cache init
const client = redis.createClient()
client.on('error',(err)=>{
  console.log('error' , err)
})
app.use(responseTime());
app.get('/deputados', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  const depUrl = 'http://demo2585989.mockable.io/deputados';
  return client.get('comments', (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } else {
      return axios.get(depUrl)
        .then(response => {
          const responseJSON = response.data;
          client.setex('deputados', 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
          return res.status(200).json({ source: 'Deputados API', ...responseJSON, });
        })
        .catch(err => {
          return res.json(err);
        });
    }
  });
});
//cache end


// socket init
io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "http://demo2585989.mockable.io/deputados"
    );
    socket.emit("deputados", res.data)
    console.log('>>>>', res.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}; // socket end
server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;