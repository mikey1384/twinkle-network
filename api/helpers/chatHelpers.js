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
    let query = 'SELECT * FROM msg_channels WHERE id = ?';
    pool.query(query, channelId, (err, rows) => {
      if (!rows || rows.length === 0) {
        return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChannelId: generalChatId}, user.id], err => {
          channelId = generalChatId;
          callback(null);
        })
      }
      callback(err)
    })
  }

  function checkIfUserIsAMember(callback) {
    if (channelId === generalChatId) return callback(null);
    let query = 'SELECT * FROM msg_channel_members WHERE channelId = ? AND userId = ?';
    pool.query(query, [channelId, user.id], (err, rows) => {
      if (!rows || rows.length === 0) {
        return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChannelId: generalChatId}, user.id], err => {
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
          'SELECT a.id, a.channelId, a.userId, a.content, a.timeposted, a.isNotification, b.username FROM ',
          'msg_chats a LEFT JOIN users b ON a.userId = b.id ',
          'WHERE channelId = ? ORDER BY id DESC LIMIT 21'
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
        pool.query('SELECT bidirectional, creator FROM msg_channels WHERE id = ?', channelId, (err, rows) => {
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
    fetchChannelInfos,
    fetchBasicChannelData,
    fetchChannelTitlesAndLastMessages
  ], (err, channels) => {
    callback(err, channels)
  })

  function fetchChannelInfos(callback) {
    let query = 'SELECT channelId, lastRead, isHidden FROM msg_channel_info WHERE userId = ?';
    pool.query(query, user.id, (err, channelInfos) => {
      callback(err, channelInfos);
    })
  }

  function fetchBasicChannelData(channelInfos, callback) {
    const query = [
      'SELECT a.id, a.bidirectional, a.channelName FROM msg_channels a WHERE a.id IN ',
      '(SELECT b.channelId FROM msg_channel_members b WHERE b.channelId = ? ',
      'OR b.userId = ?)'
    ].join('')
    pool.query(query, [generalChatId, user.id], (err, channels) => {
      let taskArray = [];
      for (let i = 0; i < channels.length; i++) {
        taskArray.push(fetchUserSpecificChannelData(channels[i], channelInfos));
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
      taskArray.push(fetchChannelTitleAndLastMessage(rows[i], user.id))
    }
    async.parallel(taskArray, (err, results) => {
      let channels = rows.map((row, index) => {
        return {
          id: row.id,
          channelName: results[index][1] ? results[index][1] : row.channelName,
          lastMessage: results[index][0].content || '',
          lastUpdate: results[index][0].timeposted || '',
          lastMessageSender: {username: results[index][0].username, id: results[index][0].userId},
          numUnreads: row.numUnreads,
          isHidden: row.isHidden
        }
      })
      channels.sort(function(a, b) {return b.lastUpdate - a.lastUpdate})
      callback(err, channels)
    })
  }
}

const fetchUserSpecificChannelData = (channel, channelInfos) => callback => {
  const channelId = channel.id;
  let lastReadTime = null;
  let isHidden = false;
  for (let i = 0; i < channelInfos.length; i++) {
    if (Number(channelInfos[i].channelId) === Number(channelId)) {
      lastReadTime = Number(channelInfos[i].lastRead);
      isHidden = Boolean(channelInfos[i].isHidden);
    }
  }
  if (!lastReadTime) {
    let query = 'SELECT COUNT(*) AS numUnreads FROM msg_chats WHERE channelId = ?';
    return pool.query(query, channelId, (err, rows) => {
      callback(err, {numUnreads: rows[0].numUnreads});
    })
  }
  let query = 'SELECT COUNT(*) AS numUnreads FROM msg_chats WHERE channelId = ? AND timeposted > ?';
  pool.query(query, [channelId, lastReadTime], (err, rows) => {
    callback(err, {numUnreads: rows[0].numUnreads, isHidden});
  })
}

const fetchChannelTitleAndLastMessage = (channel, userId) => callback => {
  async.parallel([
    fetchLastMessage,
    fetchChannelTitle,
  ], (err, results) => {
    callback(err, results)
  })

  function fetchLastMessage(callback) {
    const query = [
      'SELECT a.content, a.userId, a.timeposted, b.username ',
      'FROM msg_chats a JOIN users b ',
      'ON a.userId = b.id ',
      'WHERE channelId = ? ORDER BY a.timeposted DESC LIMIT 1'
    ].join('')
    pool.query(query, channel.id, (err, rows) => {
      callback(err, rows[0] || {})
    })
  }

  function fetchChannelTitle(callback) {
    let generateTitle = channel.bidirectional ?
      generateTitleForBidirectionalChannel : generateTitleForGroupChannel;
    return generateTitle(channel.id, userId, (err, title) => {
      callback(err, title)
    })
  }
}

const generateTitleForBidirectionalChannel = (channelId, userId, callback) => {
  const query = [
    'SELECT b.userId, c.username ',
    'FROM msg_channels a ',
    'JOIN msg_channel_members b ON ',
    'a.id = b.channelId ',
    'JOIN users c ON ',
    'b.userId = c.id ',
    'WHERE a.id = ? AND a.bidirectional = 1'
  ].join('')
  pool.query(query, channelId, (err, rows) => {
    const title = rows.length > 0 ? generateTitle(rows) : null;
    callback(err, title)
  })

  function generateTitle(rows) {
    let partnerName = '';
    for (let i = 0; i < rows.length; i++) {
      if (Number(rows[i].userId) !== Number(userId)) {
        partnerName = rows[i].username;
      }
    }
    return partnerName;
  }
}

const generateTitleForGroupChannel = (channelId, userId, callback) => {
  const query = 'SELECT channelName FROM msg_channel_info WHERE userId = ? AND channelId = ?';
  pool.query(query, [userId, channelId], (err, rows) => {
    if (!rows || rows.length === 0) return callback(err, null);
    return callback(err, rows[0].channelName);
  })
}

const handleCaseWhereBidirectionalChatAlreadyExists = (channelId, userId, content, callback) => {
  const timeposted = Math.floor(Date.now()/1000);
  const message = {channelId, userId, content, timeposted};

  async.parallel([
    callback => {
      pool.query('UPDATE users SET ? WHERE id = ?', [{lastChannelId: channelId}, userId], (err) => {
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

const updateLastRead = ({userId, channelId, time}, callback) => {
  let query = 'SELECT COUNT(*) AS num FROM msg_channel_info WHERE userId = ? AND channelId = ?';
  pool.query(query, [userId, channelId], (err, rows) => {
    if(Number(rows[0].num) > 0) {
      pool.query('UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?', [{lastRead: time}, userId, channelId]);
    } else {
      pool.query('INSERT INTO msg_channel_info SET ?', {userId, channelId, lastRead: time});
    }
    if (callback) callback(err);
  })
  pool.query('UPDATE msg_channel_info SET ? WHERE channelId = ?', [{isHidden: false}, channelId]);
}

module.exports = {
  fetchChat,
  fetchChannels,
  handleCaseWhereBidirectionalChatAlreadyExists,
  updateLastRead
}
