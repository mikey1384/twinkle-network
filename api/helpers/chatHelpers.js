const pool = require('../pool');
const async = require('async');
const access = require('../auth/access');
const generalChatId = require('../siteConfig').generalChatId;


const fetchChat = (params, callback) => {
  const user = params.user;
  let channelId = params.channelId ? Number(params.channelId) : generalChatId;
  let results = {
    channels: [],
    messages: [],
    currentChannel: {}
  };

  async.waterfall([
    checkIfLastChannelExists,
    checkIfUserIsAMember,
    fetchChannelsAndMessages,
    fetchCurrentChannel
  ], err => {
      updateLastRead({userId: user.id, channelId, time: Math.floor(Date.now()/1000)})
      callback(err, results);
    }
  )

  function checkIfLastChannelExists(callback) {
    if (channelId === generalChatId) return callback(null);
    let query = 'SELECT * FROM msg_chatrooms WHERE id = ?';
    pool.query(query, channelId, (err, rows) => {
      if (!rows || rows.length === 0) {
        return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChatRoom: generalChatId}, user.id], err => {
          channelId = generalChatId;
          callback(null);
        })
      }
      callback(err)
    })
  }

  function checkIfUserIsAMember(callback) {
    if (channelId === generalChatId) return callback(null);
    let query = 'SELECT * FROM msg_chatroom_members WHERE roomid = ? AND userid = ?';
    pool.query(query, [channelId, user.id], (err, rows) => {
      if (!rows || rows.length === 0) {
        return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChatRoom: generalChatId}, user.id], err => {
          channelId = generalChatId;
          callback(null);
        })
      }
      callback(err)
    })
  }

  function fetchChannelsAndMessages(callback) {
    async.parallel([
      callback => {
        fetchChannels(user, (err, channels) => {
          callback(err, channels)
        })
      },
      callback => {
        const query = [
          'SELECT a.id, a.roomid, a.userid, a.content, a.timeposted, a.isNotification, b.username FROM ',
          'msg_chats a LEFT JOIN users b ON a.userid = b.id ',
          'WHERE roomid = ? ORDER BY id DESC LIMIT 21'
        ].join('');
        pool.query(query, channelId, (err, messages) => {
          callback(err, messages);
        })
      }
    ], (err, channelsAndMessages) => {
      results.channels = channelsAndMessages[0];
      results.messages = channelsAndMessages[1];
      callback(err)
    })
  }

  function fetchCurrentChannel(callback) {
    async.parallel([
      callback => {
        pool.query('SELECT bidirectional, creator FROM msg_chatrooms WHERE id = ?', channelId, (err, rows) => {
          callback(err, rows[0])
        })
      },
      callback => {
        let query = [
          'SELECT a.userid, b.username FROM ',
          'msg_chatroom_members a JOIN users b ON ',
          'a.userid = b.id WHERE a.roomid = ?'
        ].join('')
        pool.query(query, channelId, (err, rows) => {
          callback(err, rows)
        })
      }
    ], (err, res) => {
      const channel = {
        id: channelId,
        bidirectional: Boolean(res[0].bidirectional),
        creatorId: res[0].creator,
        members: res[1]
      }
      results.currentChannel = channel;
      callback(err)
    })
  }
}

const fetchChannels = (user, callback) => {
  async.waterfall([
    fetchLastReads,
    fetchBasicChannelData,
    fetchChannelTitlesAndLastMessages
  ], (err, channels) => {
    callback(err, channels)
  })

  function fetchLastReads(callback) {
    pool.query('SELECT channel, lastRead FROM msg_channel_info WHERE userId = ?', user.id, (err, lastReads) => {
      callback(err, lastReads);
    })
  }

  function fetchBasicChannelData(lastReads, callback) {
    const query = [
      'SELECT a.id, a.bidirectional, a.roomname FROM msg_chatrooms a WHERE a.id IN ',
      '(SELECT b.roomid FROM msg_chatroom_members b WHERE b.roomid = ? ',
      'OR b.userid = ?)'
    ].join('')
    pool.query(query, [generalChatId, user.id], (err, channels) => {
      let taskArray = [];
      for (let i = 0; i < channels.length; i++) {
        taskArray.push(fetchNumberOfUnreadMessages(channels[i], lastReads))
      }
      async.parallel(taskArray, (err, unreads) => {
        let rows = channels.map((channel, index) => {
          return Object.assign(channel, unreads[index])
        })
        callback(err, rows)
      })
    })
  }

  function fetchChannelTitlesAndLastMessages(rows, callback) {
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
          lastMessageSender: {username: results[index][0].username, id: results[index][0].userid},
          numUnreads: row.numUnreads
        }
      })
      channels.sort(function(a, b) {return b.lastUpdate - a.lastUpdate})
      callback(err, channels)
    })
  }
}

const fetchNumberOfUnreadMessages = (channel, lastReads) => callback => {
  const channelId = channel.id;
  let lastReadTime = null;
  for (let i = 0; i < lastReads.length; i++) {
    if (Number(lastReads[i].channel) === Number(channelId)) {
      lastReadTime = Number(lastReads[i].lastRead);
    }
  }
  if (!lastReadTime) {
    let query = 'SELECT COUNT(*) AS numUnreads FROM msg_chats WHERE roomid = ?';
    return pool.query(query, channelId, (err, rows) => {
      callback(err, {numUnreads: rows[0].numUnreads});
    })
  }
  let query = 'SELECT COUNT(*) AS numUnreads FROM msg_chats WHERE roomid = ? AND timeposted > ?';
  pool.query(query, [channelId, lastReadTime], (err, rows) => {
    callback(err, {numUnreads: rows[0].numUnreads});
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
    let partnerName = '';
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userid !== String(userId)) {
        partnerName = rows[i].username;
      }
    }
    return partnerName;
  }
}

const handleCaseWhereBidirectionalChatAlreadyExists = (roomid, userid, content, callback) => {
  const timeposted = Math.floor(Date.now()/1000);
  const message = {roomid, userid, content, timeposted};

  async.parallel([
    callback => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChatRoom: roomid}, userid], (err) => {
        callback(err)
      })
    },
    callback => {
      pool.query('INSERT INTO msg_chats SET ?', message, (err, result) => {
        callback(err, {message, messageId: result.insertId});
      })
    }
  ], (err, results) => {
    callback(err, results[1])
  })
}

const updateLastRead = ({userId, channelId, time}) => {
  let query = 'SELECT COUNT(*) AS num FROM msg_channel_info WHERE userId = ? AND channel = ?';
  pool.query(query, [userId, channelId], (err, rows) => {
    if(Number(rows[0].num) > 0) {
      pool.query('UPDATE msg_channel_info SET ? WHERE userId = ? AND channel = ?', [{lastRead: time}, userId, channelId]);
    } else {
      pool.query('INSERT INTO msg_channel_info SET ?', {userId: userId, channel: channelId, lastRead: time});
    }
  })
}

module.exports = {
  fetchChat,
  fetchChannels,
  handleCaseWhereBidirectionalChatAlreadyExists,
  updateLastRead
}
