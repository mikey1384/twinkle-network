const processedString = require('./helpers/stringHelpers').processedString;
const generalChatId = require('./siteConfig').generalChatId;
const pool = require('./pool');

module.exports = function(io) {
  let connections = [];
  io.on('connection', socket => {
    connections.push({
      socketId: socket.id,
      username: '',
      userId: null,
      channels: []
    });

    socket.on('enter_my_notification_channel', userId => {
      socket.join('notificationChannel' + userId)
    })

    socket.on('leave_my_notification_channel', userId => {
      socket.leave('notificationChannel' + userId);
    })

    socket.on('check_online_members', (channelId, callback) => {
      io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
        let membersOnline = clients.map(client => {
          let member = {};
          for (let i = 0; i < connections.length; i++) {
            if (connections[i].socketId === client) {
              member = {
                userId: connections[i].userId,
                username: connections[i].username
              }
            }
          }
          return member;
        })
        membersOnline = membersOnline.reduce(
          (resultingArray, member) => {
            if (resultingArray.length === 0) {
              return resultingArray.concat(member)
            }
            else if (resultingArray[Math.max(resultingArray.length - 1, 0)].userId !== member.userId) {
              return resultingArray.concat(member)
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
          if (connections[i].channels.indexOf(Number(channelId)) === -1) {
            connections[i].channels.push(Number(channelId));
          }
          break;
        }
      }
      notifyChannelMembersChanged(channelId);
    })

    socket.on('leave_chat_channel', ({channelId, userId, username}) => {
      socket.leave('chatChannel' + channelId);
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].socketId === socket.id) {
          let index = connections[i].channels.indexOf(channelId);
          connections[i].channels.splice(index, 1);
          break;
        }
      }
      notifyChannelMembersChanged(channelId, {userId, username});
    })

    socket.on('bind_uid_to_socket', (userId, username) => {
      const query = [
        'SELECT a.id AS channel FROM msg_chatrooms a WHERE a.id IN ',
        '(SELECT b.roomid FROM msg_chatroom_members b WHERE b.roomid = ? ',
        'OR b.userid = ?)'
      ].join('')
      pool.query(query, [generalChatId, userId], (err, rows) => {
        let channels = rows.map(row => Number(row.channel));
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

    socket.on('new_chat_message', (data) => {
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

  function notifyChannelMembersChanged(channelId, leftChannel) {
    io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
      if (error) return console.error(error);
      let membersOnline = clients.map(client => {
        let member = {};
        for (let i = 0; i < connections.length; i++) {
          if (connections[i].socketId === client) {
            member = {
              userId: connections[i].userId,
              username: connections[i].username
            }
          }
        }
        return member;
      })
      membersOnline = membersOnline.reduce(
        (resultingArray, member) => {
          if (resultingArray.length === 0) {
            return resultingArray.concat([member])
          }
          else if (resultingArray[Math.max(resultingArray.length - 1, 0)].userId !== member.userId) {
            return resultingArray.concat([member])
          }
          else {
            return resultingArray;
          }
        }, []
      )
      let data = {channelId, membersOnline, leftChannel}
      io.to('chatChannel' + channelId).emit('change_in_members_online', data);
    })
  }
}
