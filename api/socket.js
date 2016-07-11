"use strict"

const processedString = require('./helpers/StringHelper').processedString;
const pool = require('./siteConfig').pool;

module.exports = function(io) {
  const connections = [];
  io.on('connection', socket => {
    connections.push({
      socketId: socket.id,
      userId: null
    });

    socket.on('join chat channel', channelId => {
      socket.join('chatChannel' + channelId)
      io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
        if (error) throw error;
        let members = clients.map(client => {
          for (let i = 0; i < connections.length; i++) {
            if (connections[i].socketId === client) {
              return connections[i].userId;
            }
          }
        })
        members = Array.from(new Set(members));
        let data = {channelId, members}
        io.to('chatChannel' + channelId).emit('change in channel members online', data);
      });
    })

    socket.on('leave chat channel', channelId => {
      socket.leave('chatChannel' + channelId)
    })

    socket.on('associate user id to socket id', userId => {
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          connections[i].userId = userId;
        }
      }
    })

    socket.on('new chat message', data => {
      const channelId = data.channelId;
      data.content = processedString(data.content);
      io.to('chatChannel' + channelId).emit('incoming message', data);
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

    socket.on('enter my notification channel', userId => {
      socket.join('notificationChannel'+userId)
    })

    socket.on('leave my notification channel', userId => {
      socket.leave('notificationChannel'+userId)
    })

    socket.on('invite user to bidirectional chat', (userId, data) => {
      io.to('notificationChannel'+userId).emit('incoming chat invitation', data);
      io.to('notificationChannel'+userId).emit('incoming notification', {type: 'message'})
    })

    socket.on('invite users to group channel', (users, data) => {
      for (let i = 0; i < users.length; i++) {
        io.to('notificationChannel'+users[i]).emit('incoming chat invitation', data);
        io.to('notificationChannel'+users[i]).emit('incoming notification', {type: 'message'})
      }
    })

    socket.on('disconnect', () => {
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          connections.splice(i, 1)
        }
      }
    });
  });
}
