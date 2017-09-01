module.exports = {
  httpPort: 3000,
  baseUrl: '',

  restUrl: '',
  sessionSecret: 'private key',
}

switch (process.env.NODE_ENV) {
  case 'development':
  case 'test':
  break
  default:
}
