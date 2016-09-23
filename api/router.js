module.exports = function (app, pool) {
  app.use('/user', require('./controllers/user'));
  app.use('/video', require('./controllers/video'));
  app.use('/playlist', require('./controllers/playlist'));
  app.use('/chat', require('./controllers/chat'));
  app.use('/notification', require('./controllers/notification'));
  app.use('/feed', require('./controllers/feed'));
}
