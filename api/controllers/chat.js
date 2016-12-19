const pool = require('../pool');
const async = require('async');
const express = require('express');
const router = express.Router();

const {requireAuth} = require('../auth');
const {processedString, processedTitleString, stringIsEmpty} = require('../helpers/stringHelpers');
const {generalChatId} = require('../siteConfig');
const {
  fetchChat,
  fetchChannels,
  handleCaseWhereBidirectionalChatAlreadyExists,
  updateLastRead
} = require('../helpers/chatHelpers');


router.get('/', requireAuth, (req, res) => {
  const user = req.user;
  const lastChannelId = user.lastChannelId || generalChatId;
  fetchChat({user, channelId: lastChannelId}, (err, results) => {
    if (err) {
      console.error(err);
      if (err.status) return res.status(err.status).send({error: err})
      return res.status(500).send({error: err})
    }
    res.send(results)
  })
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user;
  const message = req.body.message;
  const {channelId, content} = message;
  const timeStamp = Math.floor(Date.now()/1000);
  if (message.userId !== user.id) {
    return res.status(401).send("Unauthorized")
  }

  async.waterfall([
    markMyMessageAsRead,
    saveMessageToDatabase,
    fetchUpdatedChannels
  ], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err)
    }
    res.send(results)
  })

  function markMyMessageAsRead(callback) {
    updateLastRead({userId: user.id, channelId, timeStamp: timeStamp}, err => callback(err))
  }

  function saveMessageToDatabase(callback) {
    const post = {
      channelId,
      userId: user.id,
      content: processedString(content),
      timeStamp
    }
    pool.query('INSERT INTO msg_chats SET ?', post, (err, result) => callback(err, result.insertId))
  }

  function fetchUpdatedChannels(messageId, callback) {
    fetchChannels(user, (err, channels) => callback(err, {messageId, timeStamp, channels}))
  }
})

router.get('/more', requireAuth, (req, res) => {
  const user = req.user;
  if (Number(req.query.userId) !== user.id) {
    return res.status(401).send("Unauthorized")
  }
  const {messageId, channelId} = req.query;
  const query = `
    SELECT a.id, a.channelId, a.userId, a.content, a.timeStamp, a.isNotification, b.username, c.id AS profilePicId
    FROM msg_chats a LEFT JOIN users b ON a.userId = b.id LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1' WHERE a.id < ? AND a.channelId = ? ORDER BY id DESC LIMIT 21
  `;
  pool.query(query, [messageId, channelId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send(rows)
  })
})

router.get('/numUnreads', requireAuth, (req, res) => {
  const user = req.user;
  async.waterfall([
    callback => {
      let query = 'SELECT channelId, lastRead FROM msg_channel_info WHERE userId = ?';
      pool.query(query, user.id, (err, lastReads) => callback(err, lastReads))
    },
    (lastReads, callback) => {
      let query = [
        'SELECT channelId, timeStamp FROM msg_chats WHERE channelId IN ',
        '(SELECT channelId FROM msg_channel_members WHERE userId = ?) ',
        'AND channelId IN (SELECT id FROM msg_channels)'
      ].join('')
      pool.query(query, user.id, (err, messages) => {
        let counter = 0;
        for (let i = 0; i < lastReads.length; i++) {
          const {channelId} = lastReads[i];
          const timeStamp = Number(lastReads[i].lastRead);
          for (let j = 0; j < messages.length; j++) {
            if (messages[j].channelId === channelId && Number(messages[j].timeStamp) > timeStamp) {
              counter ++
            }
          }
        }
        let readChannels = lastReads.map(lastRead => {
          return lastRead.channelId;
        })
        let messagesInUnreadChannel = messages.filter(message => {
          return (readChannels.indexOf(message.channelId) === -1)
        })
        counter += messagesInUnreadChannel.length;
        callback(err, counter)
      })
    }
  ], (err, numUnreads) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({numUnreads})
  })
})

router.get('/channels', requireAuth, (req, res) => {
  const user = req.user;
  fetchChat({user}, (err, results) => {
    if (err) return res.status(500).send({error: err});
    res.send(results);
  })
})

router.get('/channel', requireAuth, (req, res) => {
  const user = req.user;
  const channelId = Number(req.query.channelId) || generalChatId;
  async.waterfall([
    callback => {
      fetchChat({user, channelId}, (err, results) => {
        if (err) return callback(err);
        callback(err, results.messages)
      })
    },
    (messages, callback) => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, user.id], (err) => {
        callback(err, messages)
      })
    }
  ], (err, messages) => {
    if (err) {
      console.error(err);
      if (err.status) return res.status(err.status).send({error: err})
      return res.status(500).send({error: err})
    }

    async.parallel([
      callback => {
        pool.query('SELECT twoPeople, creator FROM msg_channels WHERE id = ?', channelId, (err, rows) => {
          callback(err, rows[0])
        })
      },
      callback => {
        let query = [
          'SELECT a.userId, b.username FROM ',
          'msg_channel_members a JOIN users b ON ',
          'a.userId = b.id WHERE a.channelId = ?'
        ].join('')
        pool.query(query, channelId, (err, rows) => {
          callback(err, rows)
        })
      }
    ], (err, results) => {
      res.send({
        channel: {
          id: channelId,
          twoPeople: results[0] ? Boolean(results[0].twoPeople) : false,
          creatorId: results[0].creator,
          members: results[1]
        },
        messages
      })
    })
  })
})

router.get('/channel/check', requireAuth, (req, res) => {
  let partnerId = Number(req.query.partnerId);
  let myUserId = req.user.id;
  const query = [
    'SELECT * FROM msg_channels WHERE ',
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

router.post('/lastRead', requireAuth, (req, res) => {
  const user = req.user;
  const channelId = req.body.channelId;
  const timeStamp = req.body.timeStamp;
  updateLastRead({userId: user.id, channelId, timeStamp}, err => {
    if (err) return res.status(500).send({error: err})
    res.send({success: true})
  })
})

router.post('/channel', requireAuth, (req, res) => {
  const user = req.user;
  const params = req.body.params;
  const channelName = processedTitleString(params.channelName);
  const timeStamp = Math.floor(Date.now()/1000);

  async.waterfall([
    callback => {
      pool.query('INSERT INTO msg_channels SET ?', {channelName, creator: user.id}, (err, result) => {
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
            channelId,
            userId: members[i]
          }
          pool.query('INSERT INTO msg_channel_members SET ?', post, (err, result) => {
            callback(err, result)
          })
        }
        taskArray.push(task);
      }
      taskArray.push(
        callback => {
          let message = {
            channelId,
            userId: user.id,
            content: `Created channel "${channelName}"`,
            timeStamp: timeStamp,
            isNotification: true
          }
          pool.query('INSERT INTO msg_chats SET ?', message, (err, result) => {
            message = Object.assign({}, message, {
              username: user.username,
              profilePicId: user.profilePicId,
              messageId: result.insertId,
              channelName
            });
            callback(err, message)
          })
        }
      )
      async.parallel(taskArray, (err, results) => {
        callback(err, results[results.length - 1])
      })
      updateLastRead({userId: user.id, channelId, timeStamp})
    },
    (message, callback) => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChannelId: message.channelId}, user.id], err => {
        callback(err, message)
      })
    }
  ], (err, message) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    let query = [
      'SELECT a.userId, b.username FROM ',
      'msg_channel_members a LEFT JOIN users b ON ',
      'a.userId = b.id WHERE a.channelId = ?'
    ].join('')
    pool.query(query, message.channelId, (err, rows) => {
      res.send({message, members: rows})
    })
  })
})

router.post('/channel/twoPeople', requireAuth, (req, res) => {
  const user = req.user;
  const {partnerId, timeStamp} = req.body;
  const firstMessage = processedString(req.body.message);
  if (user.id !== req.body.userId) {
    return res.status(401).send({error: "Session mismatch"})
  }
  async.waterfall([
    callback => {
      let query = [
        'SELECT * FROM msg_channels WHERE ',
        '(memberOne = '+user.id+' AND memberTwo = '+partnerId+') OR ',
        '(memberOne = '+partnerId+' AND memberTwo = '+user.id+')'
      ].join('')
      pool.query(query, (err, rows) => {
        if (rows.length > 0) {
          let params = [rows[0].id, user.id, firstMessage];
          return handleCaseWhereBidirectionalChatAlreadyExists(...params, (err, result) => {
            if (err) res.status(500).send({error: err});
            res.send({alreadyExists: result});
          });
        }
        callback(null)
      })
    },
    callback => {
      let post = {
        twoPeople: true,
        memberOne: user.id,
        memberTwo: partnerId
      }
      pool.query('INSERT INTO msg_channels SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
    },
    (insertId, callback) => {
      const members = [user.id, partnerId];
      let taskArray = [];
      for (let i = 0; i < members.length; i++) {
        let task = callback => {
          let post = {
            channelId: insertId,
            userId: members[i]
          }
          pool.query('INSERT INTO msg_channel_members SET ?', post, (err, result) => {
            callback(err, result)
          })
        }
        taskArray.push(task);
      }
      let post = {
        channelId: insertId,
        userId: user.id,
        content: firstMessage,
        timeStamp,
      }
      let finalTask = callback => pool.query('INSERT INTO msg_chats SET ?', post, (err, result) => {
        callback(err, result.insertId)
      })
      taskArray.push(finalTask);
      async.series(taskArray, (err, results) => {
        callback(err, insertId, results[results.length-1])
      })
    },
    (channelId, messageId, callback) => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, user.id], err => {
        callback(err, channelId, messageId)
      })
    }
  ], (err, channelId, messageId) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    let query = [
      'SELECT a.userId, b.username FROM ',
      'msg_channel_members a LEFT JOIN users b ON ',
      'a.userId = b.id WHERE a.channelId = ?'
    ].join('')
    pool.query(query, channelId, (err, rows) => {
      res.send({
        messageId,
        channelId,
        userId: user.id,
        username: user.username,
        profilePicId: user.profilePicId,
        content: firstMessage,
        members: rows,
        timeStamp
      })
    })
  })
})

router.delete('/channel', requireAuth, (req, res) => {
  const {user} = req;
  const channelId = Number(req.query.channelId);
  const timeStamp = Number(req.query.timeStamp)

  async.parallel([postLeaveNotification, leaveChannel], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err})
    }
    res.send({success: true})
  })

  function postLeaveNotification(callback) {
    let post = {
      channelId,
      userId: user.id,
      content: 'Left the channel',
      timeStamp: timeStamp,
      isNotification: true
    }
    let query = 'INSERT INTO msg_chats SET ?';
    pool.query(query, post, err => {
      callback(err)
    })
  }

  function leaveChannel(callback) {
    let query = 'DELETE FROM msg_channel_members WHERE channelId = ? AND userId = ?';
    pool.query(query, [channelId, user.id], err => {
      callback(err)
    })
  }
})

router.post('/hideChat', requireAuth, (req, res) => {
  const {user} = req;
  const {channelId} = req.body;

  const query = 'UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?';
  pool.query(query, [{isHidden: true}, user.id, channelId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({error: err});
    }
    res.send({success: true})
  })
})

router.post('/invite', requireAuth, (req, res) => {
  const {user} = req;
  const {channelId, selectedUsers} = req.body;
  const timeStamp = Math.floor(Date.now()/1000);
  async.waterfall([
    callback => {
      let query = [
        'SELECT a.channelName FROM msg_channels a WHERE a.id IN ',
        '(SELECT b.channelId FROM msg_channel_members b WHERE channelId = ? AND userId = ?)'
      ].join('');
      pool.query(query, [channelId, user.id], (err, rows) => {
        if (rows[0].length === 0) {
          return callback('not_a_member')
        }
        callback(err, rows[0].channelName)
      })
    },
    (channelName, callback) => {
      let query = 'INSERT INTO msg_channel_members SET ?';
      let taskArray = selectedUsers.reduce(
        (taskArray, user) => {
          return taskArray.concat([
            callback => {
              pool.query(query, {channelId, userId: user.userId}, err => {
                callback(err)
              })
            }
          ])
        }, []
      )
      taskArray.push(
        callback => {
          let usernames = selectedUsers.map(user => user.username);
          let lastUser = usernames[usernames.length - 1];
          usernames.pop();
          if (usernames.length === 1) {
            usernames = `${usernames[0]} and ${lastUser}`;
          }
          else if (usernames.length > 1) {
            usernames = `${usernames.join(', ')} and ${lastUser}`
          }
          else {
            usernames = lastUser;
          }

          let content = `Invited ${usernames} to the channel`;
          let query = 'INSERT INTO msg_chats SET ?';
          let message = {isNotification: true, channelId, userId: user.id, content, timeStamp};
          pool.query(query, message, (err, res) => {
            let messageId = res.insertId;
            message = Object.assign({}, message, {id: messageId, username: user.username, channelName});
            callback(err, message);
          })
        }
      )
      async.parallel(taskArray, (err, results) => {
        callback(err, results[results.length - 1])
      })
    }
  ], (err, message) => {
    if (err) {
      let status = (err === 'not_a_member') ? 401 : 500;
      return res.status(status).send({error: err})
    }
    updateLastRead({userId: user.id, channelId, timeStamp})
    res.send({message})
  })
})

router.get('/search/chat', requireAuth, (req, res) => {
  const {user} = req;
  const text = req.query.text;
  async.waterfall([
    callback => {
      let query = [
        'SELECT a.channelId, COALESCE(c.channelName, b.channelName, d.username) AS label, ',
        'b.twoPeople, d.id AS userId, d.realName AS subLabel FROM ',
        'msg_channel_members a JOIN msg_channels b ',
        'ON a.channelId = b.id JOIN msg_channel_info c ',
        'ON b.id = c.channelId AND c.userId = ? LEFT JOIN users d ',
        'ON a.userId = d.id ',
        'WHERE ((a.userId = ? AND b.twoPeople = 0) ',
        'AND (IFNULL(c.channelName, b.channelName) LIKE ?)) OR ',
        '((a.userId != ? AND b.twoPeople = 1) AND (d.username LIKE ?)) OR ',
        '((b.id = 2) AND (b.channelName LIKE ?)) LIMIT 10'
      ].join('');
      pool.query(query, [user.id, user.id, '%' + text + '%', user.id, '%' + text + '%', '%' + text + '%'], (err, primaryRes) => {
        callback(err, primaryRes);
      })
    },
    (primaryRes, callback) => {
      const remainder = 10 - primaryRes.length;
      if (remainder > 0) {
        let query = [
          'SELECT a.username AS label, a.realName AS subLabel, a.id AS userId, b.id AS channelId FROM ',
          'users a LEFT JOIN msg_channels b ON ',
          '(a.id = b.memberOne AND b.memberTwo = ?) OR (a.id = b.memberTwo AND b.memberOne = ?) ',
          'WHERE ((a.username LIKE ?) OR (a.realName LIKE ?)) AND a.id != ? LIMIT ' + remainder
        ].join('');
        pool.query(query, [user.id, user.id, '%' + text + '%', '%' + text + '%', user.id], (err, rows) => {
          if (err) {
            console.error(err)
          }
          let secondaryRes = rows.filter(row => {
            let allowed = true;
            for (let i = 0; i < primaryRes.length; i++) {
              if (row.label === primaryRes[i].label) {
                allowed = false;
                break;
              }
            }
            return allowed;
          })

          let finalRes = primaryRes.map(res => Object.assign({}, res, {primary: true})).concat(
            secondaryRes.map(res => Object.assign({}, res, {primary: false}))
          )
          callback(err, finalRes);
        })
      }
      else {
        let finalRes = primaryRes.map(res => Object.assign({}, res, {primary: true}))
        callback(null, finalRes)
      }
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err})
    }
    res.send(result)
  })
})

router.get('/search/users', (req, res) => {
  const text = req.query.text;
  if (stringIsEmpty(text) || text.length < 2) return res.send([]);
  const query = 'SELECT * FROM users WHERE (username LIKE ?) OR (realName LIKE ?) LIMIT 5';
  pool.query(query, ['%' + text + '%', '%' + text + '%'], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err})
    }
    res.send(rows)
  })
})

router.post('/title', requireAuth, (req, res) => {
  const {user} = req;
  const {title, channelId} = req.body;
  const query = 'UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?';
  pool.query(query, [{channelName: title}, user.id, channelId], err => {
    if (err) return res.status(500).send({error: err})
    res.send({success: true})
  })
})

module.exports = router;
