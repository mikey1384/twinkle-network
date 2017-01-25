import request from 'supertest';
import app from '../../api/app';

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

describe('Chat', () => {
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
        expect(!!result.body.channel.creatorId).toBe(true);
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
