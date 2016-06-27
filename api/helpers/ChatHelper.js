"use strict"

const pool = require('../siteConfig').pool;
const async = require('async');
const access = require('../auth/access');
const defaultChatroomId = 2;

const fetchChat = (params, callback) => {
  const user = params.user;
  let channelId = params.channelId;
  async.waterfall([
    callback => {
      if (channelId !== defaultChatroomId) {
        pool.query('SELECT * FROM msg_chatroom_members WHERE roomid = ?', channelId, (err, rows) => {
          if (!rows || rows.length === 0) {
            return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChatRoom: defaultChatroomId}, user.id], err => {
              channelId = defaultChatroomId;
              callback(null);
            })
          }
          if (rows[0].condition !== null) {
            if (access.level[user.usertype] < Number(rows[0].condition)) {
              return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChatRoom: defaultChatroomId}, user.id], err => {
                channelId = defaultChatroomId;
                callback(null);
              })
            }
            callback(err)
          } else {
            pool.query('SELECT * FROM msg_chatroom_members WHERE roomid = ? AND userid = ?', [channelId, user.id], (err, rows) => {
              if (!rows || rows.length === 0) {
                return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChatRoom: defaultChatroomId}, user.id], err => {
                  channelId = defaultChatroomId;
                  callback(null);
                })
              }
              callback(err)
            })
          }
        })
      } else {
        callback(null)
      }
    },
    callback => {
      async.parallel([
        callback => {
          fetchChannels(user, (err, channels) => {
            callback(err, channels)
          })
        },
        callback => {
          const query = [
            'SELECT a.id, a.roomid, a.userid, a.content, a.timeposted, b.username FROM ',
            'msg_chats a JOIN users b ON a.userid = b.id ',
            'WHERE roomid = ? ORDER BY id DESC LIMIT 21'
          ].join('');
          pool.query(query, channelId, (err, messages) => {
            callback(err, messages);
          })
        }
      ], (err, results) => {
        callback(err, results)
      })
    }], (err, results) => {
      if (results) results.push(channelId);
      callback(err, results)
    }
  )
}

const fetchChannels = (user, callback) => {
  async.waterfall([
    callback => {
      const query = [
        'SELECT a.id, a.bidirectional, a.roomname FROM msg_chatrooms a WHERE a.id IN ',
        '(SELECT b.roomid FROM msg_chatroom_members b WHERE (b.userid = 0 AND b.condition <= ?) ',
        'OR (b.userid = ?))'
      ].join('')
      pool.query(query, [access.level[user.usertype], user.id], (err, rows) => {
        callback(err, rows)
      })
    },
    (rows, callback) => {
      let taskArray = [];
      for (let i = 0; i < rows.length; i++) {
        taskArray.push(fetchChannelTitleAndLastMessage(rows[i].id, user.id))
      }
      async.parallel(taskArray, (err, results) => {
        let channels = rows.map((row, index) => {
          return {
            id: row.id,
            roomname: results[index][1] ? results[index][1] : row.roomname,
            lastMessage: results[index][0].content || '',
            lastUpdate: results[index][0].timeposted || '',
            lastMessageSender: {username: results[index][0].username, id: results[index][0].userid}
          }
        })
        channels.sort(function(a, b) {return b.lastUpdate - a.lastUpdate})
        callback(err, channels)
      })
    }
  ], (err, channels) => {
    callback(err, channels)
  })
}

const fetchChannelTitleAndLastMessage = (channelId, userId) => callback => {
  async.parallel([
    callback => fetchLastMessage(channelId, (err, lastMessage) => {
      callback(err, lastMessage)
    }),
    callback => generateTitleForBidirectionalChannel(channelId, userId, (err, title) => {
      callback(err, title)
    }),
  ], (err, results) => {
    callback(err, results)
  })
}

const fetchLastMessage = (channelId, callback) => {
  const query = [
    'SELECT a.content, a.userid, a.timeposted, b.username ',
    'FROM msg_chats a JOIN users b ',
    'ON a.userid = b.id ',
    'WHERE roomid = ? ORDER BY a.timeposted DESC LIMIT 1'
  ].join('')
  pool.query(query, channelId, (err, rows) => {
    callback(err, rows[0] || {})
  })
}

const generateTitleForBidirectionalChannel = (channelId, userId, callback) => {
  const query = [
    'SELECT b.userid, c.username ',
    'FROM msg_chatrooms a ',
    'JOIN msg_chatroom_members b ON ',
    'a.id = b.roomid ',
    'JOIN users c ON ',
    'b.userid = c.id ',
    'WHERE a.id = ? AND a.bidirectional = 1'
  ].join('')
  pool.query(query, channelId, (err, rows) => {
    const title = rows.length > 0 ? generateTitle(rows) : null;
    callback(err, title)
  })

  function generateTitle(rows) {
    let partnerName;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userid !== String(userId)) {
        partnerName = rows[i].username;
      }
    }
    return `${partnerName}`;
  }
}

module.exports = {
  fetchChat,
  fetchChannels
}
