require('dotenv').config();
const http = require('http');
const cors = require('cors');
const debug = require('debug')(http);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const fs = require('fs');
const port = process.env.PORT||3000


var server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('index.html', 'utf-8', (err, html) => {
      res.StatusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    })
  }
})
const user = {};
const connection = [];

server.listen(port);
io.attach(server);
io.on('connection', (socket) => {
  connection.push(socket);
  console.log('connection')
  socket.on('user', (name) => {
    user[socket.id] = name;
    socket.broadcast.emit('new-user', name);

  })
  socket.on('send', (message) => {
    socket.broadcast.emit('recive', { message: message, name: user[socket.id] });
    console.log('message')
  });

})


