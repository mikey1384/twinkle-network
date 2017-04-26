module.exports = function(app, pool) {
  app.use('/chat', require('./controllers/chat'))
  app.use('/feed', require('./controllers/feed'))
  app.use('/playlist', require('./controllers/playlist'))
  app.use('/user', require('./controllers/user'))
  app.use('/video', require('./controllers/video'))
  app.use('/url', require('./controllers/link'))
  app.use('/notification', require('./controllers/notification'))
}
