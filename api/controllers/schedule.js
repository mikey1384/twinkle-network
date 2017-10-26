const express = require('express')
const router = express.Router()
const {poolQuery, promiseSeries} = require('../helpers')
const {requireAuth} = require('../auth')

router.get('/', (req, res) => {
  const scheduleQuery = `
    SELECT a.type, a.mentorId, a.dateStamp, b.username
    FROM schedule a JOIN users b ON a.mentorId = b.id
  `
  return poolQuery(scheduleQuery).then(
    rows => {
      res.send(rows)
    }
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/', requireAuth, (req, res) => {
  const {user, body: {dates}} = req
  const resetQuery = 'DELETE FROM schedule WHERE userId = ?'
  const insertQuery = `INSERT INTO schedule SET ?`
  return poolQuery(resetQuery, user.id).then(
    () => promiseSeries(dates.map(
      date => () => poolQuery(insertQuery, {
          userId: user.id,
          type: 'visit',
          mentorId: 5,
          dateStamp: Date.parse(date) / 1000,
          timeStamp: Math.floor(Date.now() / 1000)}
        )
      )
    )
  ).then(
    () => res.send({success: true})
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

module.exports = router
