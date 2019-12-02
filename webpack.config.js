const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const WorkboxPlugin = require('workbox-webpack-plugin');
const Critters = require('critters-webpack-plugin');

module.exports = [{
  entry: ['./dev/sass/styles.scss', './dev/js/scripts.js'],
  output: {
    publicPath: './',
    path: path.resolve(__dirname, 'docs'),
    filename: 'js/scripts.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/styles.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
               plugins: () => [autoprefixer()]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./node_modules']
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              publicPath: '..'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './dev/index.html',
      inject: false
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './dev/src-sw.js',
      swDest: './sw.js'
    }),
    new CopyPlugin([
      { from: './dev/favicon', to: './' },
      { from: './dev/manifest.json', to: './' },
    ]),
    //new Critters(),
  ],
}];