
const port = process.env.PORT || 4001;

const express = require("express");

const http = require("http");

const socketIo = require("socket.io");

const responseTime = require('response-time')

const routes = require("./routes/index");

const db = require('./db/index').db;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const service = require('./service')
 

const setHeaders = res => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
}


const httpGetDeputados = res => {
  setHeaders(res)
  console.log('[GET] /deputados')

  service.getDeputados()
    .then(result => {
      console.log('[GET] /deputados response 200')
      res
        .status(200)
        .json({
          source: 'Deputados API', 
          ...result, 
        })
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

app.use(routes);
app.use(responseTime());

app.get('/deputados', (_req, res) => httpGetDeputados(res));

// socket init
const wsGetDeputados = socket => {
  console.log('[WS] /deputados')

  service.getDeputados()
    .then(result => {
      console.log('result', result)
      
      socket.emit("deputados", JSON.stringify(result))
    })
    .catch(err => {
      console.log('[WS] /deputados error', err)
      socket.emit("deputados-error", JSON.stringify(err))
    })
}

io.on("connection", socket => {
  console.log("New client connected")
  setInterval(
    () => wsGetDeputados(socket),
    10000
  )

  socket.on("disconnect", () => console.log("Client disconnected"))
});

// socket end

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;