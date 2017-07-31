module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      console.log('home index')
      yield this.ctx.render('home/index.ejs', {
        data: 'world',
      });
    }
  }
  return HomeController;
};