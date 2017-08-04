const processedString = require('./helpers/stringHelpers').processedString
const generalChatId = require('./siteConfig').generalChatId
const {poolQuery} = require('./helpers')

module.exports = function(io) {
  let connectedSocket = {}
  let connectedUser = {}
  io.on('connection', socket => {
    connectedSocket = Object.assign({}, connectedSocket, {
      [socket.id]: {
        username: '',
        userId: null,
        channels: []
      }
    })

    socket.on('enter_my_notification_channel', userId => {
      socket.join('notificationChannel' + userId)
    })

    socket.on('leave_my_notification_channel', userId => {
      socket.leave('notificationChannel' + userId)
    })

    socket.on('check_online_members', (channelId, callback) => {
      io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
        let data = {channelId, membersOnline: returnMembersOnline(clients)}
        callback(error, data)
      })
    })

    socket.on('join_chat_channel', (channelId, callback) => {
      socket.join('chatChannel' + channelId)
      connectedSocket[socket.id].channels.push(channelId)
      notifyChannelMembersChanged(channelId)
    })

    socket.on('leave_chat_channel', ({channelId, userId, username, profilePicId}) => {
      socket.leave('chatChannel' + channelId)
      let index = connectedSocket[socket.id].channels.indexOf(channelId)
      connectedSocket[socket.id].channels.splice(index, 1)
      notifyChannelMembersChanged(channelId, {userId, username, profilePicId})
    })

    socket.on('bind_uid_to_socket', (userId, username) => {
      const channelQuery = `
        SELECT a.id AS channelId FROM msg_channels a WHERE a.id IN
        (SELECT b.channelId FROM msg_channel_members b WHERE b.channelId = ?
        OR b.userId = ?)
      `
      poolQuery(`UPDATE users SET ? WHERE id = ?`, [{online: true}, userId])
      poolQuery(channelQuery, [generalChatId, userId]).then(
        channels => {
          connectedSocket[socket.id] = Object.assign({}, connectedSocket[socket.id], {
            userId,
            username,
            channels: channels.map(({channelId}) => channelId)
          })
          for (let i = 0; i < channels.length; i++) {
            const {channelId} = channels[i]
            socket.join('chatChannel' + channelId)
            notifyChannelMembersChanged(channelId)
          }
          if (!connectedUser[userId]) {
            connectedUser[userId] = [socket.id]
          } else if (connectedUser[userId].indexOf(socket.id) === -1) {
            connectedUser[userId].push(socket.id)
          }
        }
      ).catch(
        error => console.error(error)
      )
    })

    socket.on('new_subject', (params) => {
      io.to('chatChannel' + 2).emit('subject_change', params)
    })

    socket.on('new_chat_message', (message, channel) => {
      const channelId = message.channelId
      message.content = processedString(message.content)
      io.to('chatChannel' + channelId).emit('receive_message', message, channel)
    })

    socket.on('send_bi_chat_invitation', (userId, data) => {
      io.to('notificationChannel' + userId).emit('chat_invitation', data)
    })

    socket.on('send_group_chat_invitation', (users, data) => {
      for (let i = 0; i < users.length; i++) {
        io.to('notificationChannel' + users[i]).emit('chat_invitation', data.message)
      }
    })

    socket.on('disconnect', () => {
      let connection = connectedSocket[socket.id]
      for (let i = 0; i < connection.channels.length; i++) {
        let channelId = connection.channels[i]
        socket.leave('chatChannel' + channelId)
        notifyChannelMembersChanged(channelId)
      }
      if (connectedUser[connection.userId]) {
        connectedUser[connection.userId].splice(connectedUser[connection.userId].indexOf(socket.id), 1)
      }
      if (connectedUser[connection.userId] && connectedUser[connection.userId].length === 0) {
        return poolQuery(`UPDATE users SET ? WHERE id = ?`, [{online: false}, connection.userId]).then(
          () => poolQuery(`INSERT INTO users_actions SET ?`, {
            userId: connection.userId,
            action: 'leave',
            target: 'website',
            timeStamp: Math.floor(Date.now()/1000)
          })
        ).then(
          () => {
            delete connectedSocket[socket.id]
          }
        )
      }
    })
  })

  function notifyChannelMembersChanged(channelId, leftChannel) {
    io.of('/').in('chatChannel' + channelId).clients((error, clients) => {
      if (error) return console.error(error)
      const membersOnline = returnMembersOnline(clients)
      let data = {channelId, membersOnline, leftChannel}
      io.to('chatChannel' + channelId).emit('change_in_members_online', data)
    })
  }

  function returnMembersOnline(clients) {
    let membersOnline = []
    let isOnline = {}
    for (let i = 0; i < clients.length; i++) {
      let socketId = clients[i]
      if (connectedSocket[socketId] && !isOnline[connectedSocket[socketId].userId]) {
        membersOnline.push({
          userId: connectedSocket[socketId].userId,
          username: connectedSocket[socketId].username
        })
        isOnline[connectedSocket[socketId].userId] = true
      }
    }
    return membersOnline
  }
}
