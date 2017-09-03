const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  filename: 'res/css/bundle.css',
  ignoreOrder: true,
  allChunks: true,
})

module.exports = {
  entry: ['babel-polyfill', './src/client/index.es'],
  output: {
    path: path.resolve(__dirname, './out/server/public'),
    filename: `res/js/bundle.js`
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.es$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['es2015', 'react', 'stage-0'],
            plugins: [
              ['transform-runtime', {
                polyfill: false,
              }],
              'transform-decorators-legacy',
              ['babel-plugin-root-import', {
                'rootPathSuffix': 'src'
              }]
            ]
          }
        }
      }, {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                url: false,
                camelCase: true,
                localIdentName: '[folder]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader',
          ]
        })
      }, {
        test: /\.(jpg|png|gif|svg)$/i,
        use: 'url-loader',
      }
    ]
  },
  plugins: [
    extractCSS,
  ],
  resolve: {
    extensions: ['.es', '.js', '.json']
  },
  devServer: {
    port: 3200,
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
  },
}
