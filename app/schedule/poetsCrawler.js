/*
* file 古诗文网站的爬取脚本
*
* logic
*
* 分为author爬取，post爬取
*
* create_time 2017年05月23日12:45:10
* update_time 2017年05月23日12:45:17
* */

const GUSHIWENSHOST = 'http://so.gushiwen.org';
const util = require('util');

/*
* task 分为作者抓取和文章详情抓取
*
* */

module.exports = {
  //每三个月一号运行一次
  schedule: {
    cron: '0 0 0 1 */3 *',
    type: 'worker',
    immediate: false,
    disable: true
  },

  * task(ctx) {
    // yield ctx.helper.dealAuthorsList( `${GUSHIWENSHOST}/authors/Default.aspx` );
    // yield ctx.helper.dealPostsList( `${GUSHIWENSHOST}/type.aspx` );
    ctx.app.cache = true;
  }
};



