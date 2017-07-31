/*
file webpack的开发配置

@author darrenzhou
@create_time 2017年07月15日14:13:21
*/
const Merge = require('webpack-merge');
const webpack = require('webpack');
const CommonConfig = require('./webpack.common.js');
const path = require('path');

module.exports = Merge(CommonConfig, {
  devtool: "cheap-eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 启用 HMR
  ]
});