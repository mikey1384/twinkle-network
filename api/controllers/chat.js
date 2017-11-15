const pool = require('../pool')
const async = require('async')
const express = require('express')
const router = express.Router()

const {requireAuth} = require('../auth')
const {processedString, processedTitleString, stringIsEmpty} = require('../helpers/stringHelpers')
const {poolQuery, promiseSeries} = require('../helpers/')
const {generalChatId} = require('../siteConfig')
const {
  fetchChat,
  fetchMessages,
  fetchSingleChannel,
  fetchChannels,
  saveChannelMembers,
  updateLastRead
} = require('../helpers/chatHelpers')

router.get('/', requireAuth, (req, res) => {
  const {user, user: {lastChannelId}, query: {channelId}} = req
  poolQuery('INSERT INTO users_actions SET ?', {
    userId: user.id,
    action: 'enter',
    target: 'chat',
    method: 'default',
    timeStamp: Math.floor(Date.now()/1000)
  })
  return fetchChat({user, channelId: Number(channelId) || lastChannelId || generalChatId}).then(
    results => res.send(results)
  ).catch(
    error => {
      console.error(error)
      if (error.status) {
        return res.status(error.status).send({error})
      }
      return res.status(500).send({error})
    }
  )
})

router.post('/', requireAuth, (req, res) => {
  const user = req.user
  const {message} = req.body
  const {channelId, content, subjectId} = message
  const timeStamp = Math.floor(Date.now() / 1000)
  if (message.userId !== user.id) {
    return res.status(401).send('Unauthorized')
  }

  return poolQuery('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, user.id]).then(
    () => {
      const query1 = `UPDATE msg_channel_info SET isHidden = '0' WHERE channelId = ?`
      const query2 = `
        INSERT INTO msg_chats SET channelId = ?, userId = ?, content = ?, timeStamp = ?, subjectId = ?
      `
      return promiseSeries([
        () => poolQuery(query1, channelId),
        () => poolQuery(query2, [channelId, user.id, content, timeStamp, subjectId])
      ])
    }
  ).then(
    results => {
      return promiseSeries([
        () => updateLastRead({users: [{id: user.id}], channelId, timeStamp: Math.floor(Date.now() / 1000)}),
        () => res.send({messageId: Number(results[1].insertId)})
      ])
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject', (req, res) => {
  const query = `
    SELECT a.id, a.userId, b.username, a.content,
    a.timeStamp, a.reloadedBy, c.username AS reloaderName, a.reloadTimeStamp
    FROM content_chat_subjects a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users c ON a.reloadedBy = c.id
    WHERE a.id = (SELECT currentSubjectId FROM msg_channels WHERE id = 2 LIMIT 1)
  `
  return poolQuery(query).then(
    ([result = {}]) => {
      res.send(Object.assign({}, result, {
        uploader: {
          name: result.username,
          id: result.userId
        },
        reloader: {
          name: result.reloaderName,
          id: result.reloadedBy
        }
      }))
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/chatSubject', requireAuth, (req, res) => {
  const {user, body: {content: rawContent}} = req
  const postSubjectQuery = `INSERT INTO content_chat_subjects SET ?`
  const postMessageQuery = `INSERT INTO msg_chats SET ?`
  const timeStamp = Math.floor(Date.now()/1000)
  const content = `${rawContent[0].toUpperCase()}${rawContent.slice(1)}`
  return poolQuery(postSubjectQuery, {
    channelId: 2,
    userId: user.id,
    content,
    timeStamp
  }).then(
    ({insertId: subjectId}) => poolQuery(postMessageQuery, {
      channelId: 2,
      userId: user.id,
      content,
      timeStamp,
      isSubject: true,
      subjectId
    }).then(
      ({insertId}) => Promise.resolve({subjectId, insertId})
    )
  ).then(
    ({subjectId, insertId}) => {
      return poolQuery(`UPDATE msg_channels SET currentSubjectId = ? WHERE id = 2`, subjectId).then(
        () => res.send({
          subjectId,
          subject: {
            id: insertId,
            content,
            timeStamp,
            username: user.username,
            userId: user.id,
            profilePicId: user.profilePicId,
            isSubject: true,
            uploader: {
              name: user.username,
              id: user.id,
              profilePicId: user.profilePicId
            }
          }
        })
      )
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject/messages', (req, res) => {
  const {subjectId} = req.query
  const query = `
    SELECT a.*, b.username, c.id AS profilePicId FROM msg_chats a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = 1
    WHERE a.subjectId = ?
      AND a.channelId = 2
      AND a.isSubject != 1
    ORDER BY id DESC LIMIT 11
  `
  return poolQuery(query, subjectId).then(
    messages => {
      let loadMoreButtonShown = false
      if (messages.length > 10) {
        messages.pop()
        loadMoreButtonShown = true
      }
      res.send({messages: messages.sort(function(a, b) { return a.id - b.id }), loadMoreButtonShown})
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject/messages/more', (req, res) => {
  const {subjectId, messageIds} = req.query
  const query = `
    SELECT a.*, b.username, c.id AS profilePicId FROM msg_chats a
    JOIN users b ON a.userId = b.id
    LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = 1
    WHERE a.subjectId = ? 
    AND a.isSubject != 1
    AND a.channelId = 2
    AND ${messageIds.map(id => `a.id != ${id}`).join(' AND ')}
    ORDER BY id DESC LIMIT 11
  `
  return poolQuery(query, subjectId).then(
    messages => {
      let loadMoreButtonShown = false
      if (messages.length > 10) {
        messages.pop()
        loadMoreButtonShown = true
      }
      res.send({messages: messages.sort(function(a, b) { return a.id - b.id }), loadMoreButtonShown})
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject/modal', (req, res) => {
  const {userId} = req.query
  const mySubjectsQuery = `
    SELECT a.id, a.channelId, a.userId, b.username, a.content, a.timeStamp,
    (
      SELECT COUNT(id) FROM msg_chats WHERE subjectId = a.id
      AND isSubject != 1 AND isReloadedSubject != 1
    ) AS numMsgs
    FROM content_chat_subjects a JOIN users b ON a.userId = b.id
    WHERE a.userId = ? ORDER BY id DESC LIMIT 6
  `
  const allSubjectsQuery = `
    SELECT a.id, a.channelId, a.userId, b.username, a.content, a.timeStamp,
    (
      SELECT COUNT(id) FROM msg_chats WHERE subjectId = a.id
      AND isSubject != 1 AND isReloadedSubject != 1
    ) AS numMsgs
    FROM content_chat_subjects a JOIN users b ON a.userId = b.id
    ORDER BY (
      IF(
        a.reloadTimeStamp IS NULL,
        a.timeStamp,
        a.reloadTimeStamp
      )
    ) DESC LIMIT 21
  `
  return promiseSeries([
    () => poolQuery(mySubjectsQuery, userId),
    () => poolQuery(allSubjectsQuery)
  ]).then(
    ([mySubjects, allSubjects]) => {
      let mySubjectsLoadMoreButton = false
      let allSubjectsLoadMoreButton = false

      if (mySubjects.length > 5) {
        mySubjects.pop()
        mySubjectsLoadMoreButton = true
      }

      if (allSubjects.length > 20) {
        allSubjects.pop()
        allSubjectsLoadMoreButton = true
      }

      res.send({
        mySubjects: {
          subjects: mySubjects,
          loadMoreButton: mySubjectsLoadMoreButton
        },
        allSubjects: {
          subjects: allSubjects,
          loadMoreButton: allSubjectsLoadMoreButton
        }
      })
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/chatSubject/modal/more', (req, res) => {
  const {query: {userId, mineOnly, subjectIds}} = req
  const query = `
    SELECT a.id, a.channelId, a.userId, b.username, a.content, a.timeStamp,
    (
      SELECT COUNT(id) FROM msg_chats WHERE subjectId = a.id
      AND isSubject != 1 AND isReloadedSubject != 1
    ) AS numMsgs
    FROM content_chat_subjects a JOIN users b ON a.userId = b.id
    WHERE ${subjectIds.map(id => `a.id != ${id}`).join(' AND ')}
    ${mineOnly ? `AND a.userId = ?` : ''}
    ORDER BY (
      IF(
        a.reloadTimeStamp IS NULL,
        a.timeStamp,
        a.reloadTimeStamp
      )
    ) DESC LIMIT ${mineOnly ? '11' : '21'}
  `
  let params = []
  if (mineOnly) params.push(userId)
  return poolQuery(query, params).then(
    subjects => {
      let loadMoreButton = false
      if (!!mineOnly && subjects.length > 10) {
        subjects.pop()
        loadMoreButton = true
      }

      if (!mineOnly && subjects.length > 20) {
        subjects.pop()
        loadMoreButton = true
      }

      res.send({
        subjects,
        loadMoreButton
      })
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.put('/chatSubject/reload', requireAuth, (req, res) => {
  const {user, body: {subjectId}} = req
  const subjectQuery = `
    SELECT a.*, b.username FROM content_chat_subjects a
    JOIN users b ON a.userId = b.id
    WHERE a.id = ?
  `
  const timeStamp = Math.floor(Date.now()/1000)
  const post = {reloadedBy: user.id, reloadTimeStamp: timeStamp}
  return poolQuery(subjectQuery, subjectId).then(
    ([subject]) => {
      const message = {
        channelId: 2,
        userId: user.id,
        content: subject.content,
        timeStamp,
        subjectId,
        isReloadedSubject: true
      }
      return promiseSeries([
        () => poolQuery(`UPDATE msg_channels SET ? WHERE id = 2`, {currentSubjectId: subjectId}),
        () => poolQuery(`UPDATE content_chat_subjects SET ? WHERE id = ?`, [post, subjectId]),
        () => poolQuery(`
          SELECT COUNT(id) AS numMsgs FROM msg_chats WHERE subjectId = ?
          AND isSubject != 1 AND isReloadedSubject != 1
        `, subjectId),
        () => poolQuery(`INSERT INTO msg_chats SET ?`, message)
      ]).then(
        ([, , [{numMsgs}], {insertId: messageId}]) => {
          return Promise.resolve({
            message: Object.assign({}, message, {
              id: messageId,
              username: user.username,
              profilePicId: user.profilePicId,
              numMsgs
            }),
            subject: Object.assign({}, subject, post)
          })
        }
      )
    }
  ).then(
    ({message, subject}) => {
      res.send({
        subjectId,
        message,
        subject: Object.assign({}, subject, {
          reloaderName: user.username,
          reloader: {
            id: user.id,
            name: user.username
          },
          uploader: {
            id: subject.userId,
            name: subject.username
          }
        })
      })
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.delete('/message', requireAuth, (req, res) => {
  const {user} = req
  const {messageId} = req.query
  return poolQuery('DELETE FROM msg_chats WHERE id = ? AND userId = ?', [messageId, user.id]).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.put('/message', requireAuth, async(req, res) => {
  const {user} = req
  const {editedMessage, messageId} = req.body
  const query = `
    UPDATE msg_chats SET ? WHERE id = ?${user.userType === 'creator' ? '' : ' AND userId = ?'}
  `
  const params = [{content: editedMessage}, messageId]
  if (user.userType !== 'creator') params.push(user.id)
  try {
    await poolQuery(query, params)
    res.send({success: true})
  } catch (error) {
    console.err(error)
    res.status(500).send({error})
  }
})

router.get('/more/channels', requireAuth, (req, res) => {
  const {currentChannelId, channelIds} = req.query
  const {user} = req
  return fetchChannels(user, currentChannelId, channelIds).then(
    channels => res.send(channels)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/more/messages', requireAuth, (req, res) => {
  const user = req.user
  if (Number(req.query.userId) !== user.id) {
    return res.status(401).send('Unauthorized')
  }
  const {messageId, channelId} = req.query
  const query = `
    SELECT id FROM msg_chats WHERE id < ? AND channelId = ? ORDER BY id DESC LIMIT 21
  `
  return poolQuery(query, [messageId, channelId]).then(
    messages => promiseSeries(
      messages.map(({id}) => {
        let query = `
          SELECT a.id, a.channelId, a.userId, a.content, a.timeStamp, a.isNotification,
          a.isSubject, a.subjectId, a.isReloadedSubject, b.username,
          IF(
            a.isReloadedSubject = 1,
            (SELECT COUNT(id) FROM msg_chats WHERE subjectId = a.subjectId
              AND isSubject != 1 AND isReloadedSubject != 1
            ),
            NULL
          ) AS numMsgs,
          c.id AS profilePicId FROM msg_chats a LEFT JOIN users b ON a.userId = b.id
          LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
          WHERE a.id = ?
        `
        return () => poolQuery(query, id).then(([message]) => Promise.resolve(message))
      })
    )
  ).then(
    messages => res.send(messages)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/channels', requireAuth, (req, res) => {
  const user = req.user
  const {currentChannelId} = req.query
  return fetchChannels(user, currentChannelId).then(
    channels => res.send(channels)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/channel', requireAuth, (req, res) => {
  const user = req.user
  const channelId = Number(req.query.channelId) || generalChatId

  return fetchMessages(channelId).then(
    messages => poolQuery('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, user.id]).then(
      () => Promise.resolve(messages)
    )
  ).then(
    messages => {
      return promiseSeries([
        () => updateLastRead({users: [{id: user.id}], channelId, timeStamp: Math.floor(Date.now() / 1000)}),
        () => fetchSingleChannel(channelId, user.id).then(channel => res.send({messages, channel}))
      ])
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/channel/check', requireAuth, (req, res) => {
  let partnerId = Number(req.query.partnerId)
  let myUserId = req.user.id
  const query = `
    SELECT * FROM

    (SELECT b.channelId AS id FROM users a JOIN msg_channel_members b ON a.id = b.userId
    JOIN msg_channels c ON b.channelId = c.id AND c.twoPeople = '1'
    WHERE a.id = '${myUserId}') A

    JOIN

    (SELECT b.channelId AS id FROM users a JOIN msg_channel_members b ON a.id = b.userId
    JOIN msg_channels c ON b.channelId = c.id AND c.twoPeople = '1'
    WHERE a.id = '${partnerId}') B

    ON

    A.id = B.id
  `
  return poolQuery(query).then(
    rows => {
      let query = `
        SELECT a.id, a.channelId, a.userId, a.content, a.timeStamp, b.username,
        c.id AS profilePicId FROM msg_chats a
        JOIN users b ON a.userId = b.id
        LEFT JOIN users_photos c ON a.userId = c.userId AND c.isProfilePic = '1'
        WHERE a.channelId = ? ORDER BY id DESC LIMIT 21
      `
      let channelId = rows.length > 0 ? rows[0].id : 0
      if (rows.length > 0) {
        return poolQuery(query, channelId).then(
          rows => Promise.resolve({
            channelId,
            lastMessage: rows[0].content,
            lastUpdate: rows[0].timeStamp,
            lastMessageSender: {
              id: rows[0].userId,
              username: rows[0].username
            },
            messages: rows
          })
        )
      }
      return Promise.resolve({channelId, messages: []})
    }
  ).then(
    result => res.send(result)
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.post('/lastRead', requireAuth, (req, res) => {
  const user = req.user
  const channelId = req.body.channelId
  return updateLastRead({users: [{id: user.id}], channelId, timeStamp: Math.floor(Date.now()/1000)}).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/channel', requireAuth, (req, res) => {
  const user = req.user
  const params = req.body.params
  const channelName = processedTitleString(params.channelName)
  const timeStamp = Math.floor(Date.now()/1000)

  return poolQuery('INSERT INTO msg_channels SET ?', {channelName, creator: user.id}).then(
    result => Promise.resolve(result.insertId)
  ).then(
    channelId => {
      const members = [user.id].concat(params.selectedUsers.map(user => {
        return user.userId
      }))
      const message = {
        channelId,
        userId: user.id,
        content: `Created channel "${channelName}"`,
        timeStamp,
        isNotification: true
      }
      updateLastRead({users: members.map(member => ({id: member})), channelId, timeStamp: timeStamp - 1})
      return promiseSeries([
        () => saveChannelMembers(channelId, members),
        () => poolQuery('INSERT INTO msg_chats SET ?', message)
      ]).then(
        ([, result]) => Promise.resolve(Object.assign({}, message, {
          username: user.username,
          profilePicId: user.profilePicId,
          messageId: result.insertId,
          channelName
        }))
      )
    }
  ).then(
    message => poolQuery('UPDATE users SET ? WHERE id = ?', [{lastChannelId: message.channelId}, user.id]).then(
      () => Promise.resolve(message)
    )
  ).then(
    message => {
      let query = `
        SELECT a.userId, b.username FROM
        msg_channel_members a LEFT JOIN users b ON
        a.userId = b.id WHERE a.channelId = ?
      `
      return poolQuery(query, message.channelId).then(
        members => Promise.resolve({members, message})
      )
    }
  ).then(
    ({members, message}) => {
      res.send({message, members})
    }
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.post('/channel/twoPeople', requireAuth, (req, res) => {
  const user = req.user
  const {partnerId, timeStamp} = req.body
  const content = processedString(req.body.message)
  if (user.id !== req.body.userId) {
    return res.status(401).send({error: 'Session mismatch'})
  }

  return poolQuery('INSERT INTO msg_channels SET ?', {twoPeople: true}).then(
    result => {
      updateLastRead({users: [{id: partnerId}, {id: user.id}], channelId: result.insertId, timeStamp: timeStamp - 1})
      return Promise.resolve(result.insertId)
    }
  ).then(
    channelId => promiseSeries([
      () => saveChannelMembers(channelId, [user.id, partnerId]),
      () => poolQuery('INSERT INTO msg_chats SET ?', {channelId, userId: user.id, content, timeStamp})
    ]).then(
      ([, result]) => Promise.resolve({channelId, messageId: result.insertId})
    )
  ).then(
    ({channelId, messageId}) => poolQuery('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, user.id]).then(
      () => Promise.resolve({channelId, messageId})
    )
  ).then(
    ({channelId, messageId}) => {
      let query = `
        SELECT a.userId, b.username FROM
        msg_channel_members a LEFT JOIN users b ON
        a.userId = b.id WHERE a.channelId = ?
      `
      return poolQuery(query, channelId).then(
        members => res.send({
          id: messageId,
          messageId,
          channelId,
          userId: user.id,
          username: user.username,
          profilePicId: user.profilePicId,
          members,
          content,
          timeStamp
        })
      )
    }
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    }
  )
})

router.delete('/channel', requireAuth, (req, res) => {
  const {user} = req
  const {channelId: channelIdString, timeStamp: timeStampString} = req.query
  const channelId = Number(channelIdString)
  const timeStamp = Number(timeStampString)

  async.parallel([postLeaveNotification, leaveChannel], (error, results) => {
    if (error) {
      console.error(error)
      return res.status(500).send({error})
    }
    res.send({success: true})
  })

  function postLeaveNotification(callback) {
    let post = {
      channelId,
      userId: user.id,
      content: 'Left the channel',
      timeStamp,
      isNotification: true,
      isSilent: true
    }
    let query = 'INSERT INTO msg_chats SET ?'
    pool.query(query, post, err => {
      callback(err)
    })
  }

  function leaveChannel(callback) {
    let query = 'DELETE FROM msg_channel_members WHERE channelId = ? AND userId = ?'
    pool.query(query, [channelId, user.id], err => {
      callback(err)
    })
  }
})

router.post('/hideChat', requireAuth, (req, res) => {
  const {user} = req
  const {channelId} = req.body

  const query = 'UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?'
  pool.query(query, [{isHidden: true}, user.id, channelId], (error) => {
    if (error) {
      console.error(error)
      return res.status(500).send({error})
    }
    res.send({success: true})
  })
})

router.post('/invite', requireAuth, (req, res) => {
  const {user} = req
  const {channelId, selectedUsers} = req.body
  const timeStamp = Math.floor(Date.now()/1000)
  async.waterfall([
    callback => {
      let query = [
        'SELECT a.channelName FROM msg_channels a WHERE a.id IN ',
        '(SELECT b.channelId FROM msg_channel_members b WHERE channelId = ? AND userId = ?)'
      ].join('')
      pool.query(query, [channelId, user.id], (err, rows) => {
        if (rows[0].length === 0) {
          return callback('not_a_member')
        }
        callback(err, rows[0].channelName)
      })
    },
    (channelName, callback) => {
      let query = 'INSERT INTO msg_channel_members SET ?'
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
          let usernames = selectedUsers.map(user => user.username)
          let lastUser = usernames[usernames.length - 1]
          usernames.pop()
          if (usernames.length === 1) {
            usernames = `${usernames[0]} and ${lastUser}`
          } else if (usernames.length > 1) {
            usernames = `${usernames.join(', ')} and ${lastUser}`
          } else {
            usernames = lastUser
          }

          let content = `Invited ${usernames} to the channel`
          let query = 'INSERT INTO msg_chats SET ?'
          let message = {isNotification: true, channelId, userId: user.id, content, timeStamp}
          pool.query(query, message, (err, res) => {
            let messageId = res.insertId
            message = Object.assign({}, message, {
              id: messageId,
              username: user.username,
              channelName,
              profilePicId: user.profilePicId
            })
            callback(err, message)
          })
        }
      )
      async.parallel(taskArray, (err, results) => {
        callback(err, results[results.length - 1])
      })
    }
  ], (error, message) => {
    if (error) {
      let status = (error === 'not_a_member') ? 401 : 500
      console.error(error)
      return res.status(status).send({error})
    }
    let allUsers = selectedUsers.concat([{userId: user.id}]).map(user => ({id: user.userId}))
    updateLastRead({users: allUsers, channelId, timeStamp: timeStamp - 1})
    res.send({message})
  })
})

router.get('/numUnreads', requireAuth, (req, res) => {
  const {user} = req
  const channelQuery = `SELECT channelId FROM msg_channel_members WHERE userId = ?`
  const lastReadsQuery = `
    SELECT a.channelId, a.lastRead FROM msg_channel_info a JOIN msg_channels b ON
    a.channelId = b.id AND a.lastRead < b.lastUpdated
    WHERE a.userId = ? AND a.channelId = ?
  `
  const numUnreadQuery = `SELECT COUNT(id) AS numUnreads FROM msg_chats WHERE isSilent = '0' AND channelId = ? AND timeStamp > ? AND userId != ?`

  return poolQuery(channelQuery, user.id).then(
    rows => {
      if (rows.length > 0) {
        return promiseSeries(
          rows.map(({channelId}) => () => poolQuery(lastReadsQuery, [user.id, channelId]))
        )
      } else {
        return Promise.reject('No Channels')
      }
    }
  ).then(
    rows => promiseSeries(
      rows.reduce((resultingArray, [row]) => {
        if (row) {
          return resultingArray.concat([() => poolQuery(numUnreadQuery, [row.channelId, row.lastRead, user.id])])
        }
        return resultingArray
      }, [])
    )
  ).then(
    results => {
      const totalNumUnreads = results.reduce((sum, [{numUnreads = 0}]) => (
        sum + Number(numUnreads)
      ), 0)
      res.send({numUnreads: totalNumUnreads})
    }
  ).catch(
    error => {
      if (error === 'No Channels') return res.send({numUnreads: 0})
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/search/chat', requireAuth, (req, res) => {
  const {user} = req
  const text = req.query.text
  let query = `
    SELECT
      members.channelId,
      COALESCE(info.channelName, channels.channelName, users.username) AS label,
      channels.twoPeople,
      users.id AS userId,
      users.realName AS subLabel
    FROM
      msg_channel_members members
    JOIN
      msg_channels channels
    ON
      members.channelId = channels.id
    JOIN
      msg_channel_info info
    ON
      channels.id = info.channelId
      AND
      info.userId = ${user.id}
    LEFT JOIN
      users users
    ON
      members.userId = users.id
    WHERE
      (
        (
          members.userId = ${user.id}
          AND
          channels.twoPeople = 0
        )
        AND
        (
          IFNULL(info.channelName, channels.channelName) LIKE ?
        )
      )
    OR
      (
        (members.userId != ${user.id} AND channels.twoPeople = 1)
        AND
        (users.username LIKE ? OR users.realName LIKE ?)
      )
    OR
      (
        (channels.id = 2) AND (channels.channelName LIKE ?)
      )
    LIMIT 10
  `
  return poolQuery(query, [`%${text}%`, `%${text}%`, `%${text}%`, `%${text}%`]).then(
    primaryRes => {
      let remainder = 10 - primaryRes.length
      let query = `
        SELECT id AS userId, username AS label, realName AS subLabel FROM users WHERE (username LIKE ?
        OR realName LIKE ?) AND id != ${user.id} LIMIT ${remainder}
      `
      if (remainder > 0) {
        return poolQuery(query, [`%${text}%`, `%${text}%`]).then(
          secondaryRes => Promise.resolve({primaryRes, secondaryRes})
        )
      }
      return Promise.resolve({primaryRes, secondaryRes: []})
    }
  ).then(
    ({primaryRes, secondaryRes}) => {
      let finalRes = primaryRes.map(
        res => Object.assign({}, res, {primary: true})
      ).concat(
        secondaryRes.filter(row => {
          let remains = true
          for (let i = 0; i < primaryRes.length; i++) {
            if (row.label === primaryRes[i].label) remains = false
          }
          return remains
        }).map(
          res => Object.assign({}, res, {primary: false})
        )
      )
      res.send(finalRes)
    }
  ).catch(
    error => {
      console.error(error)
      return res.status(500).send({error})
    })
})

router.get('/search/subject', (req, res) => {
  const {text} = req.query
  if (stringIsEmpty(text) || text.length < 2) return res.send([])
  const query = `
    SELECT a.id, a.channelId, a.userId, b.username, a.content, a.timeStamp,
    (
      SELECT COUNT(id) FROM msg_chats WHERE subjectId = a.id
      AND isSubject != 1 AND isReloadedSubject != 1
    ) AS numMsgs
    FROM content_chat_subjects a JOIN users b ON a.userId = b.id
    WHERE content LIKE ? LIMIT 10
  `
  return poolQuery(query, `%${text}%`).then(
    results => res.send(results)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.get('/search/users', (req, res) => {
  const text = req.query.text
  if (stringIsEmpty(text) || text.length < 2) return res.send([])
  const query = 'SELECT * FROM users WHERE (username LIKE ?) OR (realName LIKE ?) LIMIT 5'
  return poolQuery(query, [`%${text}%`, `%${text}%`]).then(
    results => res.send(results)
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/title', requireAuth, (req, res) => {
  const {user} = req
  const {title, channelId} = req.body
  const query = 'UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?'
  pool.query(query, [{channelName: title}, user.id, channelId], error => {
    if (error) {
      console.error(error)
      return res.status(500).send({error})
    }
    res.send({success: true})
  })
})

module.exports = router
