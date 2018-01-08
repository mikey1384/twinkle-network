module.exports = {
  mysqlHost: process.env.MYSQL_HOST || 'localhost',
  mysqlUser: process.env.MYSQL_USER || 'user',
  mysqlPassword: process.env.MYSQL_PASSWORD || 'password',
  mysqlDatabase: process.env.MYSQL_DB || 'twinkle_dev',
  jwtSecret: process.env.JWT_SECRET || 'jwtsecret',
  generalChatId: process.env.GENERAL_CHAT_ID || 2,
  embedKey: process.env.EMBED_KEY || 'embedKey',
  embedApiUrl: process.env.EMBED_API_URL || 'embedApiUrl',
  bucketName: process.env.AWS_BUCKET || 'bucketName',
  googleKey: process.env.GOOGLE_KEY || 'googleKey'
}
