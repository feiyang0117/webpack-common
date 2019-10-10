const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack4 已经废弃extract-text-webpack-plugin开始使用mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let ExtractPlugin = require('extract-text-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

var BULID_PATH = path.resolve(__dirname, 'dist/');
let targetDomain = 'http://test.hh.com';
module.exports = {
  devServer: {
    index: 'index.html',
    contentBase: BULID_PATH,
    compress: true,
    publicPath: '/',
    inline: false,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    watchContentBase: true,
    allowedHosts: ['dev.com'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    proxy: {
      '/gw/generic/': {
        ws: true,
        secure: false,
        debug: true,
        target: targetDomain,
        changeOrigin: true,
        logLevel: 'debug',
        onProxyReq: function(proxyReq, req) {
          // console.log('------------------------onProxyReq--------------------');
          Object.keys(req.headers).forEach(function(key) {
            proxyReq.setHeader(key, req.headers[key]);
          });
          proxyReq.setHeader('origin', targetDomain);
          proxyReq.setHeader('referer', targetDomain);
        },
        onProxyRes: function(proxyRes, req, res) {
          // console.log('---------------------onProxyRes-----------------------');
          Object.keys(proxyRes.headers).forEach(function(key) {
            res.append(key, proxyRes.headers[key]);
          });
        }
      }
    }
  },
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      inject: 'body',
      filename: 'index.html',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    })
    // new ExtractPlugin('【name】.css')
    // new ExtractPlugin('css/aa.css')
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,

        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    // filename: 'index.js',
    path: path.resolve(__dirname, './dist')
  },
  //  剔除所有重复模块
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
