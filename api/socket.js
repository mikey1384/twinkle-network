const processedString = require('./helpers/StringHelper').processedString;
const pool = require('./siteConfig').pool;
const generalChatId = require('./siteConfig').generalChatId;


module.exports = function(io) {
  const connections = [];
  io.on('connection', socket => {
    connections.push({
      socketId: socket.id,
      userId: null,
      channels: []
    });

    socket.on('ENTER_MY_NOTIFICATION_CHANNEL', userId => {
      socket.join('notificationChannel'+userId)
    })

    socket.on('LEAVE_MY_NOTIFICATION_CHANNEL', userId => {
      socket.leave('notificationChannel'+userId)
    })

    socket.on('CHECK_ONLINE_MEMBERS', (channelId, callback) => {
      io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
        let members = clients.map(client => {
          for (let i = 0; i < connections.length; i++) {
            if (connections[i].socketId === client) {
              return connections[i].userId;
            }
          }
        })
        members = Array.from(new Set(members))
        let data = {channelId, members}
        callback(error, data);
      })
    })

    socket.on('JOIN_CHAT_CHANNEL', (channelId, callback) => {
      socket.join('chatChannel' + channelId);
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          connections[i].channels.push(channelId);
          break;
        }
      }
      notifyChannelMembersChanged(channelId);
    })

    socket.on('LEAVE_CHAT_CHANNEL', channelId => {
      socket.leave('chatChannel' + channelId);
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          let index = connections[i].channels.indexOf(channelId);
          connections[i].channels.splice(index, 1);
          break;
        }
      }
      notifyChannelMembersChanged(channelId);
    })

    socket.on('BIND_UID_TO_SOCKET', userId => {
      const query = [
        'SELECT a.id AS channel FROM msg_chatrooms a WHERE a.id IN ',
        '(SELECT b.roomid FROM msg_chatroom_members b WHERE b.roomid = ? ',
        'OR b.userid = ?)'
      ].join('')
      pool.query(query, [generalChatId, userId], (err, rows) => {
        let channels = rows.map(row => row.channel);
        for (let i = 0; i < connections.length; i++) {
          if (connections[i].socketId === socket.id) {
            connections[i].userId = userId;
            connections[i].channels = channels;
            break;
          }
        }
        for (let i = 0; i < channels.length; i++) {
          let channelId = channels[i];
          socket.join('chatChannel' + channelId);
          notifyChannelMembersChanged(channelId);
        }
      })
    })

    socket.on('NEW_CHAT_MESSAGE', data => {
      const channelId = data.channelId;
      data.content = processedString(data.content);
      io.to('chatChannel' + channelId).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('SEND_BI_CHAT_INVITATION', (userId, data) => {
      io.to('notificationChannel'+userId).emit('CHAT_INVITATION', data);
    })

    socket.on('SEND_GROUP_CHAT_INVITATION', (users, data) => {
      for (let i = 0; i < users.length; i++) {
        io.to('notificationChannel'+users[i]).emit('CHAT_INVITATION', data.message);
      }
    })

    socket.on('disconnect', () => {
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          let connection = connections[i];
          for (let i = 0; i < connection.channels.length; i++) {
            let channelId = connection.channels[i];
            socket.leave('chatChannel' + channelId);
            notifyChannelMembersChanged(channelId);
          }
          connections.splice(i, 1)
          break;
        }
      }
    })
  })

  function notifyChannelMembersChanged(channelId) {
    io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
      if (error) throw error;
      let members = clients.map(client => {
        for (let i = 0; i < connections.length; i++) {
          if (connections[i].socketId === client) {
            return connections[i].userId;
          }
        }
      })
      members = Array.from(new Set(members))
      let data = {channelId, members}
      io.to('chatChannel' + channelId).emit('CHANGE_IN_MEMBERS_ONLINE', data);
    })
  }
}
