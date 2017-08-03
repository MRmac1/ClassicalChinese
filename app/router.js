module.exports = app => {
  app.get('/', 'home.index');
  app.get('/homeData', 'home.data');
};