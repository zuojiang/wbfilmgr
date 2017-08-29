module.exports = {
  plugins: {
    'autoprefixer': {},
    'precss': {
      'nesting': false,
      'properties': {
        'preserve': 'computed',
      }
    },
    'postcss-calc': {},
    'postcss-utilities': {},
  }
}
