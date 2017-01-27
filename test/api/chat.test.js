import request from 'supertest';
import app from '../../api/app';
import {poolQuery} from '../../api/helpers';

const testUserId = 205;
let header = {authorization: null}

beforeAll((done) => {
  request(app).post('/user/login').send({
    username: 'charlie',
    password: 'password'
  }).then(
    result => {
      header.authorization = result.body.token;
      done();
    }
  )
})

describe('Chat GET', () => {
  it('inits chat', done => {
    request(app).get('/chat').set(header).then(
      result => {
        expect(result.status).toBe(200);
        done();
      }
    )
  })

  it('GETS channel', done => {
    request(app).get('/chat/channel').set(header).query('channelId=199').then(
      result => {
        expect(result.status).toBe(200);
        done();
      }
    )
  })

  it('GETS channels', done => {
    request(app).get('/chat/channels').set(header).then(
      result => {
        expect(result.status).toBe(200);
        done();
      }
    )
  })
})

describe('Chat POST', () => {
  beforeEach(done => {
    poolQuery('SELECT * FROM msg_channel_members WHERE userId = ?', testUserId).then(
      rows => {
        let channelIds = rows.map(row => row.channelId)
        return Promise.resolve(channelIds)
      }
    ).then(
      channelIds => {
        let task1 = channelIds.map(id => poolQuery('DELETE FROM msg_channels WHERE id = ?', id))
        let task2 = channelIds.map(id => poolQuery('DELETE FROM msg_channel_members WHERE channelId = ?', id))
        let task3 = channelIds.map(id => poolQuery('DELETE FROM msg_channel_info WHERE channelId = ?', id))
        let task4 = [poolQuery('DELETE FROM msg_chats WHERE userId = ?', testUserId)]
        let tasks = task1.concat(task2).concat(task3).concat(task4);
        return Promise.all(tasks)
      }
    ).then(
      () => done()
    )
  })

  it('POSTS new dm channel', done => {
    request(app).post('/chat/channel/twoPeople').set(header).send({userId: testUserId, partnerId: 208, timeStamp: Math.floor(Date.now()/1000), message: "testing"}).then(
      result => {
        expect(result.status).toBe(200);
        done()
      }
    )
  })

  it('POSTS new group channel', done => {
    request(app).post('/chat/channel').set(header).send({
      params: {
        channelName: 'new test channel',
        selectedUsers: [
          {userId: 226},
          {userId: 227},
          {userId: 228}
        ]
      }
    }).then(
      result => {
        expect(result.status).toBe(200);
        done();
      }
    )
  })

  it('POSTS messages', done => {
    request(app).post('/chat').set(header).send({
      message: {
        userId: testUserId,
        channelId: 2,
        content: 'Hello World'
      }
    }).then(
      result => {
        expect(result.status).toBe(200);
        done();
      }
    )
  })
})
