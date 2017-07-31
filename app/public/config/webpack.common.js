/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist文件夹

//打包路径
const output = path.join(__dirname, '../build');
const homeEntryFile = path.join(__dirname, '../src/home.js');
const listEntryFile = path.join(__dirname, '../src/list.js');

let options ={
  entry: {
    home: homeEntryFile,
    list: listEntryFile
  },
  output: {
    path: output,
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
    new webpack.optimize.CommonsChunkPlugin({
       name: 'common'
    }),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ]
};

module.exports = options;
