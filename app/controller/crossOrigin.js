"use strict";
/*
* html5的跨域测试
*
* create_time 2017年06月22日14:19:53
* update_time 2017年06月22日14:20:04
* */

module.exports = app => {
  class CrossController extends app.Controller {
    * index() {
      yield this.ctx.render('crossOrigin/index.ejs', {
        data: 'cross',
      });
    }
  }
  return CrossController;
};