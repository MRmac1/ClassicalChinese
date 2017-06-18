/**
 * Created with webstorm
 * Author: Darrenzhou
 * CreateTime: 17:43
 * UpdateTime: 17:43
 */
"use strict";

module.exports = app => {
  app.beforeStart(function* () {
    // 应用会等待这个函数执行完成才启动
    console.log('before app')
  });
};