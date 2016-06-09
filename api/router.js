module.exports = function (app) {
  app.use('/user', require('./controllers/user'));
  app.use('/video', require('./controllers/video'));
  app.use('/playlist', require('./controllers/playlist'));
}
