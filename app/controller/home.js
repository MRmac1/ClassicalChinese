module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      console.log( JSON.stringify(this) );
      yield this.ctx.render('home/index.ejs', {
        data: 'world',
      });
    }
  }
  return HomeController;
};