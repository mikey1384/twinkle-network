"use strict"

var pool = require('../siteConfig').pool;
var async = require('async');
const access = require('../auth/access');

const fetchChat = (params, callback) => {
  const user = params.user;
  const channelId = params.channelId;
  async.waterfall([
    callback => {
      if (channelId !== 1) {
        pool.query('SELECT * FROM msg_chatroom_members WHERE roomid = ?', channelId, (err, rows) => {
          if (!rows || rows.length === 0) {
            return callback("The channel does not exist");
          }
          if (rows[0].condition !== null) {
            callback(err)
          } else {
            pool.query('SELECT * FROM msg_chatroom_members WHERE roomid = ? AND userid = ?', [channelId, user.id], (err, rows) => {
              if (!rows || rows.length === 0) {
                return callback("The user is not a member of this channel");
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
        //create helpers for fetching channels
        callback => {
          fetchChannels(user, (err, results) => {
            callback(err, results)
          })
        },
        callback => {
          const query = [
            'SELECT a.id, a.roomid, a.userid, a.content, a.timeposted, b.username FROM ',
            'msg_chats a JOIN users b ON a.userid = b.id ',
            'WHERE roomid = ? ORDER BY id DESC LIMIT 21'
          ].join('');
          pool.query(query, channelId, (err, rows) => {
            callback(err, rows);
          })
        }
      ], (err, results) => {
        callback(err, results)
      })
    }], (err, results) => {
      callback(err, results)
    }
  )
}

const fetchChannels = (user, callback) => {
  async.waterfall([
    callback => {
      const query = [
        'SELECT a.id, a.roomname FROM msg_chatrooms a WHERE a.id IN ',
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
        taskArray.push(fetchLastMessage(rows[i].id))
      }
      async.parallel(taskArray, (err, res) => {
        let results = rows.map((row, index) => {
          return {
            id: row.id,
            roomname: row.roomname,
            lastMessage: res[index].content,
            lastUpdate: res[index].timeposted,
            lastMessageSender: {username: res[index].username, id: res[index].userid}
          }
        })
        results.sort(function(a, b) {return b.lastUpdate - a.lastUpdate})
        callback(err, results)
      })
    }
  ], (err, results) => {
    callback(err, results)
  })
}

const fetchLastMessage = channelId => callback => {
  const query = [
    'SELECT a.content, a.userid, a.timeposted, b.username ',
    'FROM msg_chats a JOIN users b ',
    'ON a.userid = b.id ',
    'WHERE roomid = ? ORDER BY a.timeposted DESC LIMIT 1'
  ].join('')
  pool.query(query, channelId, (err, rows) => {
    callback(err, rows[0])
  })
}

module.exports = {
  fetchChat,
  fetchChannels
}
