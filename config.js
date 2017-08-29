module.exports = {
  httpPort: 3000,
  baseUrl: '',
  sessionSecret: 'private key',
}

switch (process.env.NODE_ENV) {
  case 'development':
  case 'test':
  break
  default:
}
