/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist文件夹

//打包路径
const output = path.join(__dirname, '../build');
const entryFile = path.join(__dirname, '../src/index.js');
// const printFile = path.join(__dirname, '../src/print.js');

let options ={
  entry: {
    app: entryFile
  },
  output: {
    path: output,
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
       test: /\.js?$/,
       exclude: /node_modules/,
       use: [
         {
           loader: 'babel-loader',
           options: {
             presets: ['react', 'es2015']
           }
         }
       ]
     }
    ]
  },
  plugins: [
    new CleanWebpackPlugin( path.join(__dirname, '../build'), {
      root: path.resolve( __dirname, '..' ),
    } ),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
  ]
};

module.exports = options;
