const processedString = require('./helpers/StringHelper').processedString;
const pool = require('./siteConfig').pool;
const generalChatId = require('./siteConfig').generalChatId;


module.exports = function(io) {
  const connections = [];
  io.on('connection', socket => {
    connections.push({
      socketId: socket.id,
      username: '',
      userId: null,
      channels: []
    });

    socket.on('enter_my_notification_channel', userId => {
      socket.join('notificationChannel'+userId)
    })

    socket.on('leave_my_notification_channel', userId => {
      socket.leave('notificationChannel'+userId)
    })

    socket.on('check_online_members', (channelId, callback) => {
      io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
        let membersOnline = clients.map(client => {
          for (let i = 0; i < connections.length; i++) {
            if (connections[i].socketId === client) {
              return {
                userId: connections[i].userId,
                username: connections[i].username
              };
            }
          }
        })
        membersOnline = membersOnline.reduce(
          (resultingArray, obj) => {
            if (resultingArray.length === 0 || resultingArray[resultingArray.length - 1].userId !== obj.userId) {
              return resultingArray.concat(obj)
            }
            else {
              return resultingArray;
            }
          }, []
        )
        let data = {channelId, membersOnline}
        callback(error, data);
      })
    })

    socket.on('join_chat_channel', (channelId, callback) => {
      socket.join('chatChannel' + channelId);
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          connections[i].channels.push(channelId);
          break;
        }
      }
      notifyChannelMembersChanged(channelId);
    })

    socket.on('leave_chat_channel', channelId => {
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

    socket.on('bind_uid_to_socket', (userId, username) => {
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
            connections[i].username = username;
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

    socket.on('new_chat_message', data => {
      const channelId = data.channelId;
      data.content = processedString(data.content);
      io.to('chatChannel' + channelId).emit('receive_message', data);
    })

    socket.on('send_bi_chat_invitation', (userId, data) => {
      io.to('notificationChannel'+userId).emit('chat_invitation', data);
    })

    socket.on('send_group_chat_invitation', (users, data) => {
      for (let i = 0; i < users.length; i++) {
        io.to('notificationChannel'+users[i]).emit('chat_invitation', data.message);
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
      let membersOnline = clients.map(client => {
        for (let i = 0; i < connections.length; i++) {
          if (connections[i].socketId === client) {
            return {
              userId: connections[i].userId,
              username: connections[i].username
            };
          }
        }
      })
      membersOnline = membersOnline.reduce(
        (resultingArray, obj) => {
          if (resultingArray.length === 0 || resultingArray[resultingArray.length - 1].userId !== obj.userId) {
            return resultingArray.concat(obj)
          }
          else {
            return resultingArray;
          }
        }, []
      )
      let data = {channelId, membersOnline}
      io.to('chatChannel' + channelId).emit('change_in_members_online', data);
    })
  }
}
