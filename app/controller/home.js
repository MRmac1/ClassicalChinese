module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      yield this.ctx.render('home/index.ejs', {
        data: 'world',
      });
    }
  }
  return HomeController;
};