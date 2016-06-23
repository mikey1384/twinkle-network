const processedString = require('./helpers/StringHelper').processedString;

module.exports = function (io) {
  const connections = [];
  io.on('connection', function (socket) {
    connections.push(socket);

    socket.on('join chat channel', function(channelId) {
      socket.join('chatChannel'+channelId)
    })

    socket.on('leave chat channel', function(channelId) {
      socket.leave('chatChannel'+channelId)
    })

    socket.on('new chat message', function(data) {
      const channelId = data.channelId;
      data.content = processedString(data.content);
      io.to('chatChannel'+channelId).emit('incoming message', data);
    })

    socket.on('disconnect', function(){
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });
  });
}
