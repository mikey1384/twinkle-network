"use strict"

const processedString = require('./helpers/StringHelper').processedString;
const pool = require('./siteConfig').pool;

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
      pool.query('SELECT userid FROM msg_chatroom_members WHERE roomid = ?', channelId, (err, rows) => {
        const users = rows.map(row => {
          return row.userid
        })
        if (users.length > 1) {
          for (let i = 0; i < users.length; i++) {
            let userId = users[i];
            io.to('notificationChannel'+userId).emit('incoming notification', {type: 'message'})
          }
        }
      })
    })

    socket.on('enter my notification channel', function(userId) {
      socket.join('notificationChannel'+userId)
    })

    socket.on('leave my notification channel', function(userId) {
      socket.leave('notificationChannel'+userId)
    })

    socket.on('invite user to bidirectional chat', function(userId, data) {
      io.to('notificationChannel'+userId).emit('incoming chat invitation', data);
      io.to('notificationChannel'+userId).emit('incoming notification', {type: 'message'})
    })

    socket.on('invite users to group channel', function(users, data) {
      for (let i = 0; i < users.length; i++) {
        io.to('notificationChannel'+users[i]).emit('incoming chat invitation', data);
        io.to('notificationChannel'+users[i]).emit('incoming notification', {type: 'message'})
      }
    })

    socket.on('disconnect', function(){
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });
  });
}
