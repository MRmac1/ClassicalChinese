/*
 * file 封装一些常用方法
 *
 * create_time 2017年05月23日12:36:57
 * */
"use strict";
const cheerio = require('cheerio');
const _ = require('lodash');
const HOST = `http://so.gushiwen.org`;

module.exports = {
  * dealAuthorsList ( authorUrl ) {

    let currentPage = 1, authorCount = 0, ctx = this.ctx;//默认初始页
    let interceptAuthorInfo = function* ( $ ) {
      let onePageAuthors = [];
      $('.sonspic').each( ( i, element ) => {
        let contentSection = $(element).find('.cont'),
          authorImg = '',
          authorUrl = '',
          name,
          briefIntroduction;
        //取头像，不一定存在
        !_.isEmpty( contentSection.find('.divimg') ) ? authorImg = contentSection.find('.divimg img').attr('src') : '';
        name = contentSection.find('p:nth-of-type(1) a').text();
        authorUrl = contentSection.find('p:nth-of-type(1) a').attr('href');
        briefIntroduction = contentSection.find('p:nth-of-type(2)').text();
        let authorBaseInfo = {
          authorImg: authorImg,
          authorUrl: authorUrl,
          name: name,
          briefIntroduction: briefIntroduction
        };
        onePageAuthors.push( authorBaseInfo );
      });
      yield completeAuthorInfo( ctx, onePageAuthors );
    };

    do {
      let currentPageUrl = `${authorUrl}?p=${currentPage}&c=`;
      console.log( 'currentPageUrl', currentPageUrl );
      let authorListResponse = yield ctx.curl( currentPageUrl, {
        dataType: 'text',
        timeout: 5000
      } );
      let authorPageText = authorListResponse.data;
      let $ = cheerio.load( authorPageText );
      yield interceptAuthorInfo( $ );
      authorCount = parseInt( $('.pages').find('span:nth-last-of-type(1)').text().match(/\d+/g)[0] );
      console.log( 'authorCount', authorCount );
      currentPage ++;
    } while ( currentPage <= 1  );//currentPage <= Math.ceil( authorCount / 10 )
  },
  * dealPostsList ( postUrl ) {
    console.log( 'in dealPostsList ', postUrl );
  }
};

function* completeAuthorInfo( ctx, authorBaseInfo ) {
  let batchArr = [];
  //替换authorUrl，并组成promises数组
  authorBaseInfo.forEach( ( item ) => {
    item.authorUrl = HOST + item.authorUrl;
    batchArr.push( authorDealPageIntercept( ctx, item ))
  });
  try {
    let authorsDetailInfo = yield batchArr;
    console.log( 'authorsDetailInfo', JSON.stringify(authorsDetailInfo) );
    // yield ctx.service.author.authorInfoBatchSave( authorsDetailInfo );
  } catch (e) {
    console.log( 'batchArr error', e );
  }
}


function authorDealPageIntercept ( ctx, authorBase ) {
  return new Promise(function(resolve, reject) {
    authorBase.anecdote = [];
    //首先解析出作者的生卒年份
    ctx.curl( authorBase.authorUrl, {
      dataType: 'text',
      timeout: 5000
    } ).then( authorPageResponse => {
      let authorDetailPageText = authorPageResponse.data;
      let $ = cheerio.load( authorDetailPageText ),
          anecdoteGroup = $('.son5');
      anecdoteGroup.each( ( i, element ) => {
        let anecdoteTitle = $(element).find('p:nth-of-type(1) a').text();
        let anecdoteUrl = HOST + $(element).find('p:nth-of-type(1) a').attr('href');
        authorBase.anecdote.push({
          anecdoteTitle: anecdoteTitle,
          anecdoteUrl: anecdoteUrl
        });
      });
      resolve( authorBase );
    }).catch( err => {
      reject( new Error(`${JSON.stringify(err)}`) );
    } );
  });
}

/*
查询作者所在朝代
SELECT * from periods where (end_year BETWEEN 908 and 958) or (start_year BETWEEN 908 and 958) or ( start_year < 908 and end_year > 958 );

 （737～792）
 content.match(/（.+）/)
* [{"authorImg":"http://img.gushiwen.org/authorImg/nalanxingde.jpg","authorUrl":"/author_188.aspx","name":"纳兰性德","briefIntroduction":"纳兰性德（1655－1685），满洲人，字容若，号楞伽山人，清代最著名词人之一。其诗词“纳兰词”在清代以至整个中国词坛上都享有很高的声誉，在中国文学史上也占有光采夺目的一席。他生活于满汉融合时期，其贵族家庭兴衰具有关联于王朝国事的典型性。虽侍从帝王，却向往经历平淡。特殊的生活环境背景，
 加之个人的超逸才华，使其诗词创作呈现出独特的个性和鲜明的艺术风格。流传至今的《木兰花令·拟古决绝词》——“人生若只如初见，何事秋风悲画扇？等闲变却故人心，却道故人心易变。”富于意境，是其众多代表作之一。"},{"authorImg":"http://img.gushiwen.org/authorImg/luyou.jpg","authorUrl":"/author_272.aspx","name":"陆游","briefIntroduction":"陆游（1125—1210），字务观，号放翁。汉族，越州山阴（今浙江绍兴）人，南宋著名诗人。少
 时受家庭爱国思想熏陶，高宗时应礼部试，为秦桧所黜。孝宗时赐进士出身。中年入蜀，投身军旅生活，官至宝章阁待制。晚年退居家乡。创作诗歌今存九千多首，内容极为丰富。著有《剑南诗稿》、《渭南文集》、《南唐书》、《老学庵笔记》等。"},{"authorImg":"http://img.gushiwen.org/authorImg/taoyuanming.jpg","authorUrl":"/author_645.aspx","name":"陶渊明","briefIntroduction":"陶渊明（约365年—427年），字元亮，（又一说名潜，字渊明）号
 五柳先生，私谥“靖节”，东晋末期南朝宋初期诗人、文学家、辞赋家、散文家。汉族，东晋浔阳柴桑人（今江西九江）。曾做过几年小官，后辞官回家，从此隐居，田园生活是陶渊明诗的主要题材，相关作品有《饮酒》、《归园田居》、《桃花源记》、《五柳先生传》、《归去来兮辞》等。"},{"authorImg":"http://img.gushiwen.org/authorImg/menghaoran.jpg","authorUrl":"/author_757.aspx","name":"孟浩然","briefIntroduction":"孟浩然（689-740），男
 ，汉族，唐代诗人。本名不详（一说名浩），字浩然，襄州襄阳（今湖北襄阳）人，世称“孟襄阳”。浩然，少好节义，喜济人患难，工于诗。年四十游京师，唐玄宗诏咏其诗，至“不才明主弃”之语，玄宗谓：“卿自不求仕，朕未尝弃卿，奈何诬我？”因放还未仕，后隐居鹿门山，著诗二百余首。孟浩然与另一位山水田园诗人王维合称为“王孟”。"},{"authorImg":"http://img.gushiwen.org/authorImg/yuanzhen.jpg","authorUrl":"/author_18.aspx","name":"元
 稹","briefIntroduction":"元稹（779年－831年，或唐代宗大历十四年至文宗大和五年），字微之，别字威明，唐洛阳人（今河南洛阳）。父元宽，母郑氏。为北魏宗室鲜卑族拓跋部后裔，是什翼犍之十四世孙。早年和白居易共同提倡“新乐府”。世人常把他和白居易并称“元白”。"},{"authorImg":"http://img.gushiwen.org/authorImg/qiji.jpg","authorUrl":"/author_2.aspx","name":"齐己","briefIntroduction":"齐己（863年—937年）出家前俗名胡德生，
 晚年自号衡岳沙门，湖南长沙宁乡县祖塔乡人，唐朝晚期著名诗僧。"},{"authorImg":"http://img.gushiwen.org/authorImg/cencan.jpg","authorUrl":"/author_113.aspx","name":"岑参","briefIntroduction":"岑参（cén shēn）（约715年—770年），汉族，原籍南阳（今属河南新野），迁居江陵（今属湖北），是唐代著名的边塞诗人，去世之时56岁。其诗歌富有浪漫主义的特色，气势雄伟，想象丰富，色彩瑰丽，热情奔放，尤其擅长七言歌行。现存诗403首，七
 十多首边塞诗，另有《感旧赋》一篇，《招北客文》一篇，墓铭两篇。"},{"authorImg":"http://img.gushiwen.org/authorImg/liuzongyuan.jpg","authorUrl":"/author_646.aspx","name":"柳宗元","briefIntroduction":"柳宗元（773年－819年），字子厚，唐代河东（今山西运城）人，杰出诗人、哲学家、儒学家乃至成就卓著的政治家，唐宋八大家之一。著名作品有《永州八记》等六百多篇文章，经后人辑为三十卷，名为《柳河东集》。因为他是河东人，人称柳
 河东，又因终于柳州刺史任上，又称柳柳州。柳宗元与韩愈同为中唐古文运动的领导人物，并称“韩柳”。在中国文化史上，其诗、文成就均极为杰出，可谓一时难分轩轾。"},{"authorImg":"http://img.gushiwen.org/authorImg/hanyu.jpg","authorUrl":"/author_682.aspx","name":"韩愈","briefIntroduction":"韩愈（768～824）字退之，唐代文学家、哲学家、思想家，河阳（今河南省焦作孟州市）人，汉族。祖籍河北昌黎，世称韩昌黎。晚年任吏部侍郎，又称
 韩吏部。谥号“文”，又称韩文公。他与柳宗元同为唐代古文运动的倡导者，主张学习先秦两汉的散文语言，破骈为散，扩大文言文的表达功能。宋代苏轼称他“文起八代之衰”，明人推他为唐宋八大家之首，与柳宗元并称“韩柳”，有“文章巨公”和“百代文宗”之名，作品都收在《昌黎先生集》里。韩愈在思想上是中国“道统”观念的确立者，是尊儒反佛的里程碑式人物。"},{"authorImg":"http://img.gushiwen.org/authorImg/wanganshi.jpg","authorUrl":"/a
 uthor_405.aspx","name":"王安石","briefIntroduction":"王安石（1021年12月18日－1086年5月21日），字介甫，号半山，谥文，封荆国公。世人又称王荆公。汉族，北宋抚州临川人（今江西省抚州市临川区邓家巷人），中国北宋著名政治家、思想家、文学家、改革家，唐宋八大家之一。欧阳修称赞王安石：“翰林风月三千首，吏部文章二百年。老去自怜心尚在，后来谁与子争先。”传世文集有《王临川集》、《临川集拾遗》等。其诗文各体兼擅，词虽不多，但亦
 擅长，且有名作《桂枝香》等。而王荆公最得世人哄传之诗句莫过于《泊船瓜洲》中的“春风又绿江南岸，明月何时照我还。”"}]
 * */
