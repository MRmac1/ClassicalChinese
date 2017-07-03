module.exports = app => {
  app.get('/', 'home.index');
  // app.get('/list', 'list.list');
  app.get('/cross', 'crossOrigin.index')
};