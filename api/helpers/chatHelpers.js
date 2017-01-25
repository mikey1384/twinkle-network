const pool = require('../pool');
const async = require('async');
const access = require('../auth/access');
const {generalChatId} = require('../siteConfig');
const {queryPromise} = require('../helpers');


const fetchChat = (params) => {
  const user = params.user;
  let channelId = params.channelId ? params.channelId : generalChatId;
  let results = {
    channels: [],
    messages: [],
    currentChannel: {}
  };

  return new Promise((resolve, reject) => {
    checkIfLastChannelExists().then(
      () => checkIfUserIsAMember()
    ).then(
      () => fetchChannelsAndMessages()
    ).then(
      () => fetchCurrentChannel()
    ).then(
      () => {
        updateLastRead({users: [{id: user.id}], channelId, timeStamp: Math.floor(Date.now()/1000)})
        return resolve(results);
      }
    ).catch(
      error => reject(error)
    )
  })

  function checkIfLastChannelExists() {
    return new Promise((resolve, reject) => {
      if (channelId === generalChatId) return resolve();
      let query = 'SELECT * FROM msg_channels WHERE id = ?';
      pool.query(query, channelId, (err, rows) => {
        if (!rows || rows.length === 0) {
          return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChannelId: generalChatId}, user.id], err => {
            channelId = generalChatId;
            resolve();
          })
        }
        if (err) return reject(err)
        resolve()
      })
    })
  }

  function checkIfUserIsAMember() {
    return new Promise((resolve, reject) => {
      if (channelId === generalChatId) return resolve();
      let query = 'SELECT * FROM msg_channel_members WHERE channelId = ? AND userId = ?';
      pool.query(query, [channelId, user.id], (err, rows) => {
        if (!rows || rows.length === 0) {
          return pool.query("UPDATE users SET ? WHERE id = ?", [{lastChannelId: generalChatId}, user.id], err => {
            channelId = generalChatId;
            return resolve();
          })
        }
        if (err) return reject(err)
        resolve()
      })
    })
  }

  function fetchChannelsAndMessages() {
    return new Promise((resolve, reject) => {
      async.parallel([
        callback => {
          fetchChannels(user).then(
            channels => callback(null, channels)
          ).catch(
            err => callback(err)
          )
        },
        callback => {
          fetchMessages(channelId).then(
            messages => callback(null, messages)
          ).catch(
            err => callback(err)
          )
        }
      ], (err, channelsAndMessages) => {
        results.channels = channelsAndMessages[0];
        results.messages = channelsAndMessages[1];
        if (err) return reject(err)
        resolve()
      })
    })
  }

  function fetchCurrentChannel() {
    return new Promise((resolve, reject) => {
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
      ], (err, res) => {
        const channel = {
          id: channelId,
          twoPeople: Boolean(res[0].twoPeople),
          creatorId: res[0].creator,
          members: res[1]
        }
        results.currentChannel = channel;
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

const fetchMessages = channelId => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.id, a.channelId, a.userId, a.content, a.timeStamp, a.isNotification, b.username, c.id AS profilePicId FROM msg_chats a LEFT JOIN users b ON a.userId = b.id LEFT JOIN users_photos c ON
      a.userId = c.userId AND c.isProfilePic = '1'
      WHERE channelId = ? ORDER BY id DESC LIMIT 21
    `;
    queryPromise(query, channelId).then(
      messages => resolve(messages)
    ).catch(
      err => reject(err)
    )
  })
}


const fetchChannels = (user) => {
  return new Promise((resolve, reject) => {
    fetchChannelInfos().then(
      channelInfos => fetchBasicChannelData(channelInfos)
    ).then(
      rows => fetchChannelTitlesAndLastMessages(rows)
    ).then(
      channels => resolve(channels)
    ).catch(
      err => reject(err)
    )
  })

  function fetchChannelInfos() {
    return queryPromise('SELECT channelId, lastRead, isHidden FROM msg_channel_info WHERE userId = ?', user.id)
  }

  function fetchBasicChannelData(channelInfos) {
    const query = [
      'SELECT a.id, a.twoPeople, a.channelName FROM msg_channels a WHERE a.id IN ',
      '(SELECT b.channelId FROM msg_channel_members b WHERE b.channelId = ? ',
      'OR b.userId = ?)'
    ].join('')
    return new Promise((resolve, reject) => {
      queryPromise(query, [generalChatId, user.id]).then(
        channels => {
          let taskArray = [];
          for (let i = 0; i < channels.length; i++) {
            taskArray.push(fetchUserSpecificChannelData(channels[i], channelInfos, user.id));
          }
          Promise.all(taskArray).then(
            unreads => resolve(channels.map((channel, index) => {
              return Object.assign(channel, unreads[index])
            }))
          ).catch(
            err => reject(err)
          )
        }
      )
    })
  }

  function fetchChannelTitlesAndLastMessages(rows) {
    let taskArray = [];
    for (let i = 0; i < rows.length; i++) {
      taskArray.push(fetchChannelTitleAndLastMessage(rows[i], user.id))
    }
    return new Promise((resolve, reject) => {
      Promise.all(taskArray).then(
        results => {
          let channels = rows.map((row, index) => {
            return {
              id: row.id,
              channelName: results[index][1] ? results[index][1] : row.channelName,
              lastMessage: results[index][0].content || '',
              lastUpdate: results[index][0].timeStamp || '',
              lastMessageSender: {username: results[index][0].username, id: results[index][0].userId},
              numUnreads: Number(row.numUnreads),
              isHidden: row.isHidden
            }
          })
          channels.sort(function(a, b) {return b.lastUpdate - a.lastUpdate})
          resolve(channels)
        }
      ).catch(
        err => reject(err)
      )
    })
  }
}

const fetchUserSpecificChannelData = (channel, channelInfos, userId) => {
  const channelId = channel.id;
  let lastReadTime = 0;
  let isHidden = false;
  for (let i = 0; i < channelInfos.length; i++) {
    if (channelInfos[i].channelId === channelId) {
      lastReadTime = channelInfos[i].lastRead;
      isHidden = Boolean(channelInfos[i].isHidden);
    }
  }
  let query = 'SELECT COUNT(*) AS numUnreads FROM msg_chats WHERE channelId = ? AND timeStamp > ? AND userId != ?';
  return new Promise((resolve, reject) => {
    queryPromise(query, [channelId, lastReadTime, userId]).then(
      rows => resolve({numUnreads: rows[0].numUnreads, isHidden})
    ).catch(
      err => reject(err)
    )
  })
}

const fetchChannelTitleAndLastMessage = (channel, userId) => {
  return new Promise((resolve, reject) => {
    Promise.all([fetchLastMessage(), fetchChannelTitle()]).then(
      results => resolve(results)
    ).catch(
      err => reject(err)
    )
  })

  function fetchLastMessage() {
    const query = [
      'SELECT a.content, a.userId, a.timeStamp, b.username ',
      'FROM msg_chats a JOIN users b ',
      'ON a.userId = b.id ',
      'WHERE channelId = ? ORDER BY a.timeStamp DESC LIMIT 1'
    ].join('')
    return new Promise((resolve, reject) => {
      queryPromise(query, channel.id).then(
        rows => resolve(rows[0] || {})
      ).catch(
        err => reject(err)
      )
    })
  }

  function fetchChannelTitle() {
    let generateTitle = channel.twoPeople ?
      generateTitleForBidirectionalChannel : generateTitleForGroupChannel;
    return new Promise((resolve, reject) => {
      generateTitle(channel.id, userId).then(
        title => resolve(title)
      ).catch(
        err => reject(err)
      )
    })
  }
}

const generateTitleForBidirectionalChannel = (channelId, userId) => {
  const query = [
    'SELECT b.userId, c.username ',
    'FROM msg_channels a ',
    'JOIN msg_channel_members b ON ',
    'a.id = b.channelId ',
    'JOIN users c ON ',
    'b.userId = c.id ',
    'WHERE a.id = ? AND a.twoPeople = 1'
  ].join('')
  return new Promise((resolve, reject) => {
    queryPromise(query, channelId).then(
      rows => {
        const title = rows.length > 0 ? generateTitle(rows) : null;
        resolve(title)
      }
    ).catch(
      err => reject(err)
    )
  })

  function generateTitle(rows) {
    let partnerName = '';
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].userId !== userId) {
        partnerName = rows[i].username;
      }
    }
    return partnerName;
  }
}

const generateTitleForGroupChannel = (channelId, userId, callback) => {
  const query = 'SELECT channelName FROM msg_channel_info WHERE userId = ? AND channelId = ?';
  return new Promise((resolve, reject) => {
    queryPromise(query, [userId, channelId]).then(
      rows => {
        if (!rows || rows.length === 0) return resolve(null)
        return resolve(rows[0].channelName)
      }
    ).catch(
      err => reject(err)
    )
  })
}

const handleCaseWhereBidirectionalChatAlreadyExists = (channelId, userId, content, callback) => {
  const timeStamp = Math.floor(Date.now()/1000);
  const message = {channelId, userId, content, timeStamp};

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

const updateLastRead = ({users, channelId, timeStamp}, callback) => {
  let taskArray = users.map(user => {
    let userId = user.id;
    let query = 'SELECT COUNT(*) AS num FROM msg_channel_info WHERE userId = ? AND channelId = ?';
    return function(callback) {
      async.waterfall([
        cb => {
          pool.query(query, [userId, channelId], (err, rows) => cb(err, rows))
        },
        (rows, cb) => {
          if(Number(rows[0].num) > 0) {
            let query = 'UPDATE msg_channel_info SET ? WHERE userId = ? AND channelId = ?';
            pool.query(query, [{lastRead: timeStamp}, userId, channelId], err => cb(err));
          } else {
            pool.query('INSERT INTO msg_channel_info SET ?', {userId, channelId, lastRead: timeStamp}, err => cb(err));
          }
        }
      ], err => callback(err))
    }
  });
  taskArray.push(
    function(callback) {
      pool.query('UPDATE msg_channel_info SET ? WHERE channelId = ?', [{isHidden: false}, channelId], err => callback(err))
    }
  )
  async.parallel(taskArray, err => {
    if (err) console.error(err)
    if (callback) callback(err)
    return;
  })
}

module.exports = {
  fetchChat,
  fetchMessages,
  fetchChannels,
  handleCaseWhereBidirectionalChatAlreadyExists,
  updateLastRead
}
