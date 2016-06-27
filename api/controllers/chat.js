"use strict"

const pool = require('../siteConfig').pool;
const requireAuth = require('../auth').requireAuth;

const fetchChat = require('../helpers/ChatHelper').fetchChat;
const fetchChannels = require('../helpers/ChatHelper').fetchChannels;

const processedString = require('../helpers/StringHelper').processedString;

const async = require('async');
const express = require('express');
const router = express.Router();
const defaultChatroomId = 2;

router.get('/', requireAuth, (req, res) => {
  const user = req.user;
  const lastChatRoomId = user.lastChatRoom || defaultChatroomId;
  fetchChat({user, channelId: lastChatRoomId}, (err, results) => {
    if (err) {
      console.error(err);
      if (err.status) return res.status(err.status).send({error: err})
      return res.status(500).send({error: err})
    }
    res.send({
      channels: results[0],
      messages: results[1],
      currentChannelId: results[2]
    })
  })
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user;
  const params = req.body.params;
  if (params.userid !== user.id) {
    return res.status(401).send("Unauthorized")
  }
  const timeposted = Math.floor(Date.now()/1000);
  const post = {
    roomid: params.channelId,
    userid: user.id,
    content: processedString(params.content),
    timeposted
  }
  async.waterfall([
    callback => {
      pool.query('INSERT INTO msg_chats SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (insertId, callback) => {
      fetchChannels(user, (err, channels) => {
        callback(err, {
          messageId: insertId,
          timeposted,
          channels
        })
      })
    }
  ], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err)
    }
    res.send(results)
  })
})

router.get('/more', requireAuth, (req, res) => {
  const user = req.user;
  if (Number(req.query.userId) !== user.id) {
    return res.status(401).send("Unauthorized")
  }
  const messageId = req.query.messageId;
  const roomId = req.query.roomId;
  const query = [
    'SELECT a.id, a.roomid, a.userid, a.content, a.timeposted, b.username FROM ',
    'msg_chats a JOIN users b ON a.userid = b.id ',
    'WHERE a.id < ? AND a.roomid = ? ORDER BY id DESC LIMIT 21'
  ].join('');
  pool.query(query, [messageId, roomId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send(rows)
  })
})

router.get('/channel', requireAuth, (req, res) => {
  const user = req.user;
  const channelId = req.query.channelId;
  async.waterfall([
    callback => {
      fetchChat({user, channelId}, (err, results) => {
        if (err) return callback(err);
        callback(err, results[1])
      })
    },
    (messages, callback) => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChatRoom: channelId}, user.id], (err) => {
        callback(err, messages)
      })
    }
  ], (err, messages) => {
    if (err) {
      console.error(err);
      if (err.status) return res.status(err.status).send({error: err})
      return res.status(500).send({error: err})
    }
    res.send({
      currentChannelId: channelId,
      messages
    })
  })
})

router.get('/channel/check', requireAuth, (req, res) => {
  let partnerId = req.query.partnerId;
  let myUserId = req.user.id;
  const query = [
    'SELECT * FROM msg_chatrooms WHERE ',
    '(memberOne = '+partnerId+' AND memberTwo = '+myUserId+') OR ',
    '(memberOne = '+myUserId+' AND memberTwo = '+partnerId+')'
  ].join('');
  pool.query(query, (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).send({error: err})
    }
    res.send({
      channelExists: rows.length > 0,
      channelId: rows.length > 0 ? rows[0].id : null
    })
  })
})

router.post('/channel', requireAuth, (req, res) => {
  const user = req.user;
  const params = req.body.params;
  const roomname = params.channelName;

  async.waterfall([
    callback => {
      pool.query('INSERT INTO msg_chatrooms SET ?', { roomname }, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (channelId, callback) => {
      const members = [user.id].concat(params.selectedUsers.map(user => {
        return user.userId
      }));
      let taskArray = [];
      for (let i = 0; i < members.length; i++) {
        let task = callback => {
          let post = {
            roomid: channelId,
            userid: members[i]
          }
          pool.query('INSERT INTO msg_chatroom_members SET ?', post, (err, result) => {
            callback(err, result)
          })
        }
        taskArray.push(task);
      }
      async.series(taskArray, (err, results) => {
        callback(err)
      })
    }
  ], err => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({success: true})
  })
})

router.post('/channel/bidirectional', requireAuth, (req, res) => {
  const user = req.user;
  const partnerId = req.body.chatPartnerId;
  const firstMessage = processedString(req.body.message);
  if (user.id !== req.body.userId) {
    return res.status(401).send({error: "Session mismatch"})
  }
  let post = {
    bidirectional: true,
    memberOne: user.id,
    memberTwo: partnerId
  }
  async.waterfall([
    callback => {
      pool.query('INSERT INTO msg_chatrooms SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (insertId, callback) => {
      const members = [user.id, partnerId];
      let taskArray = [];
      for (let i = 0; i < members.length; i++) {
        let task = callback => {
          let post = {
            roomid: insertId,
            userid: members[i]
          }
          pool.query('INSERT INTO msg_chatroom_members SET ?', post, (err, result) => {
            callback(err, result)
          })
        }
        taskArray.push(task);
      }
      post = {
        roomid: insertId,
        userid: user.id,
        content: firstMessage,
        timeposted: Math.floor(Date.now()/1000)
      }
      let finalTask = callback => pool.query('INSERT INTO msg_chats SET ?', post, (err, result) => {
        callback(err, result)
      })
      taskArray.push(finalTask);
      async.series(taskArray, (err, results) => {
        callback(err, insertId)
      })
    },
    (insertId, callback) => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChatRoom: insertId}, user.id], err => {
        callback(err, insertId)
      })
    }
  ], (err, insertId) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({
      roomid: String(insertId),
      userid: String(user.id),
      username: user.username,
      content: firstMessage,
      timeposted: Math.floor(Date.now()/1000)
    })
  })
})

router.get('/search', (req, res) => {
  const text = req.query.text;
  const query = 'SELECT * FROM users WHERE (username LIKE ?) OR (realname LIKE ?) LIMIT 5';
  pool.query(query, [text + '%', text + '%'], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err})
    }
    res.send(rows)
  })
})

module.exports = router;
