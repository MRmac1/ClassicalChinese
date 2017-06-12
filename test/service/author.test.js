const assert = require('assert');
const mock = require('egg-mock');

describe('test/service/author.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });
  it('should save authorInfo in batch', function* () {
    const ctx = app.mockContext();
    const authorService = ctx.service.author;
    let authorsDetailInfo = [{
      authorImg: "http://img.gushiwen.org/authorImg/lishangyin.jpg",
      authorUrl: "http://so.gushiwen.org/author_204.aspx",
      name: "李商隐",
      briefIntroduction: "李商隐，字义山，号玉溪（谿）生、樊南生，唐代著名诗人，祖籍河内（今河南省焦作市）沁阳，出生于郑州荥阳。他擅长诗歌写作，骈文文学价值也很高，是晚唐最出色的诗人之一，和杜牧合称“小李杜”，与温庭筠合称为“温李”，因诗文与同时期的段成式、温庭筠风格相近，且三人都在家族里排行第十六，故并称为“三十六体”。其诗构思新奇，风格秾丽，尤其是一些爱情诗和无题诗写得缠绵悱恻，优美动人，广为传诵。但部分诗歌过于隐晦迷离，难于索解，至有“诗家总爱西昆好，独恨无人作郑笺”之说。因处于牛李党争的夹缝之中，一生很不得志。死后葬于家乡沁阳（今河南焦作市沁阳与博爱县交界之处）。作品收录为《李义山诗集》。",
      anecdote: [{"anecdoteTitle":"人品辩诬","anecdoteDetail":"http://so.gushiwen.org/ziliao_431.aspx"},{"anecdoteTitle":"生活","anecdoteDetail":"http://so.gushiwen.org/ziliao_429.aspx"},{"anecdoteTitle":"传闻轶事","anecdoteDetail":"http://so.gushiwen.org/ziliao_430.aspx"},{"anecdoteTitle":"诗文成就","anecdoteDetail":"http://so.gushiwen.org/ziliao_432.aspx"},{"anecdoteTitle":"生平","anecdoteDetail":"http://so.gushiwen.org/ziliao_428.aspx"},{"anecdoteTitle":"骈体文","anecdoteDetail":"http://so.gushiwen.org/ziliao_433.aspx"}]
    }];
    // let saveResult = yield authorService.authorInfoBatchSave( authorsDetailInfo );

  });
});

/*
{"authorImg":"http://img.gushiwen.org/authorImg/lishangyin.jpg","authorUrl":"http://so.gushiwen.org/autho
r_204.aspx","name":"李商隐","briefIntroduction":"李商隐，字义山，号玉溪（谿）生、樊南生，唐代著名诗人，祖籍河内（今河南省焦作市）沁阳，
出生于郑州荥阳。他擅长诗歌写作，骈文文学价值也很高，是晚唐最出色的诗人之一，和杜牧合称“小李杜”，与温庭筠合称为“温李”，因诗文与同时期
的段成式、温庭筠风格相近，且三人都在家族里排行第十六，故并称为“三十六体”。其诗构思新奇，风格秾丽，尤其是一些爱情诗和无题诗写得缠绵悱恻
，优美动人，广为传诵。但部分诗歌过于隐晦迷离，难于索解，至有“诗家总爱西昆好，独恨无人作郑笺”之说。因处于牛李党争的夹缝之中，一生很不得
志。死后葬于家乡沁阳（今河南焦作市沁阳与博爱县交界之处）。作品收录为《李义山诗集》。","anecdote":[{"anecdoteTitle":"人品辩诬","anecdoteU
rl":"http://so.gushiwen.org/ziliao_431.aspx"},{"anecdoteTitle":"生活","anecdoteDetail":"http://so.gushiwen.org/ziliao_429.aspx"},{"anecdote
Title":"传闻轶事","anecdoteDetail":"http://so.gushiwen.org/ziliao_430.aspx"},{"anecdoteTitle":"诗文成就","anecdoteDetail":"http://so.gushiwen.
org/ziliao_432.aspx"},{"anecdoteTitle":"生平","anecdoteDetail":"http://so.gushiwen.org/ziliao_428.aspx"},{"anecdoteTitle":"骈体文","anecdot
eUrl":"http://so.gushiwen.org/ziliao_433.aspx"}]}
 */
