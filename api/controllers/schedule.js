const express = require('express')
const router = express.Router()
const {poolQuery, promiseSeries} = require('../helpers')

router.get('/', (req, res) => {
  return poolQuery('SELECT dateString FROM schedule').then(
    rows => res.send(rows.map(({dateString}) => dateString))
  ).catch(
    error => {
      console.error(error)
      res.status(500).send({error})
    }
  )
})

router.post('/', (req, res) => {
  const {dates} = req.body
  const resetQuery = 'DELETE FROM schedule WHERE userId = ?'
  const insertQuery = `INSERT INTO schedule SET ?`
  return poolQuery(resetQuery, 100).then(
    () => promiseSeries(dates.map(
      date => () => poolQuery(insertQuery, {
          userId: 100,
          mentorId: 5,
          dateString: date,
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
