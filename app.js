
const port = process.env.PORT || 4001;

const express = require("express");

const http = require("http");

const socketIo = require("socket.io");

const responseTime = require('response-time')

const routes = require("./routes/index");

const  bodyParser = require("body-parser");

const auth = require("./auth.js")();


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const service = require('./service')
 
app.use(routes);
app.use(responseTime());
app.use(bodyParser.json());
app.use(auth.initialize());


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