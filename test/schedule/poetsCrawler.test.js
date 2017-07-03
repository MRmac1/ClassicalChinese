const mm = require('egg-mock');
const assert = require('assert');
it('test/schedule/poetsCrawler.test.js', function*() {
  const app = mm.app();
  yield app.ready();
  yield app.runSchedule('poetsCrawler', {timeout: 60 * 1000 * 60 * 24});
  assert( typeof app.cache === 'boolean' );
});