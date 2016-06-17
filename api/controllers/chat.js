"use strict"

const pool = require('../siteConfig').pool;
const requireAuth = require('../auth').requireAuth;

const fetchChat = require('../helpers/ChatHelper').fetchChat;
const fetchChannels = require('../helpers/ChatHelper').fetchChannels;

const async = require('async');
const express = require('express');
const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const user = req.user;
  const lastChatRoomId = user.lastChatRoom || 1;
  fetchChat({user, channelId: lastChatRoomId}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({
      currentChannelId: lastChatRoomId,
      channels: results[0],
      messages: results[1]
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
    content: params.content,
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
  async.parallel([
    callback => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChatRoom: channelId}, user.id], (err) => {
        callback(err, null)
      })
    },
    callback => {
      fetchChat({user, channelId}, (err, results) => {
        callback(err, results[1])
      })
    }
  ], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({
      currentChannelId: channelId,
      messages: results[1]
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
