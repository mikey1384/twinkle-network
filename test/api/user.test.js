import request from 'supertest';
import app from '../../api/app';

describe('Users', () => {
  it('logs in', done => {
    request(app).post('/user/login').send({
      username: 'charlie',
      password: 'password'
    }).then(
      result => {
        expect(result.status).toBe(200)
        done()
      }
    )
  })
})
