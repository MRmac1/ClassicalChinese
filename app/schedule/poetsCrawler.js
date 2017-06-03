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
  // 通过 schedule 属性来设置定时任务的执行间隔等配置     cron: '0 0 0 * * 7',//每个星期天运行一次
  schedule: {
    interval: '100m',
    type: 'worker', //随机一个work执行
    immediate: true,
    disabled: true
  },

  * task(ctx) {
    yield ctx.helper.dealAuthorsList( `${GUSHIWENSHOST}/authors/Default.aspx` );
    yield ctx.helper.dealPostsList( `${GUSHIWENSHOST}/type.aspx` );
    ctx.app.cache = true;
  }
};



