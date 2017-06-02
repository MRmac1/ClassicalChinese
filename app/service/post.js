/*
 * service post
 *
 * fun 封装poet库里的操作
 * create_time 2017年05月22日13:36:30
 * update_time 2017年05月22日13:36:30
 * */

"use strict";

module.exports = app => {
  class post extends app.Service {
    * find(uid) {
      const user = yield this.ctx.db.query(`select * from posts where id = ${id}`);
      return user;
    }
    * insertPost() {
      //一个事务添加post相关信息
    }
  }
  return post;
};
