/* global describe it expect */

import request from 'supertest'
import app from '../../api/app'

describe('Videos', () => {
  it('GETs from videos', done => {
    request(app).get('/video').then(
      result => {
        expect(result.status).toBe(200)
        done()
      }
    )
  })
})
