module.exports = app => {
  class ListController extends app.Controller {
    * list() {
      this.ctx.body = 'Hello List';
    }
  }
  return ListController;
};