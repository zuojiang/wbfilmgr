const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  mode: 'production',
  entry: ['./src/client/index.es'],
  output: {
    path: path.resolve(__dirname, './out/server/public'),
    filename: `res/js/bundle.js`
  },
  devtool: 'none',
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
        use: [
          MiniCssExtractPlugin.loader,
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
      }, {
        test: /\.(jpg|png|gif|svg)$/i,
        use: 'url-loader',
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'res/css/bundle.css',
    }),
  ],
  resolve: {
    extensions: ['.es', '.js', '.json']
  },
}
