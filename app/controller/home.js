/**
 * 来路项目的首页，展示推荐的文章和作者
 *
 * logic
 *
 * 时间轴下分别展示推荐的文章和作者作为切换
 *
 * @param app
 * @returns {HomeController}
 */


module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      yield this.ctx.render('home/index.ejs', {
        data: 'world',
      });
    }
    * data() {
      let data = require('../model/mockHomeData');
      this.ctx.body = data;
      this.ctx.status = 200;
    }
  }
  return HomeController;
};