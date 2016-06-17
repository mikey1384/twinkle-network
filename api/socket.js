module.exports = function (io) {
  const connections = [];
  io.on('connection', function (socket) {
    connections.push(socket);
    console.log("a user connected");

    socket.on('new message', function(data) {
      io.emit('incoming message', data);
    })

    socket.on('disconnect', function(){
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
      console.log('user disconnected');
    });

  });
}
