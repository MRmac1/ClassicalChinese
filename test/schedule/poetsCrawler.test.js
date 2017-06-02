const mm = require('egg-mock');
const assert = require('assert');
it('test/schedule/poetsCrawler.test.js', function*() {
  const app = mm.app();
  yield app.ready();
  yield app.runSchedule('poetsCrawler');
  assert(app.cache);
});