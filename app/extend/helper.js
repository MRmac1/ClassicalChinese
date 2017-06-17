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

    let currentPage = 1, authorCount = 0, ctx = this.ctx, app = this.app;//默认初始页
    let interceptAuthorInfo = function* ( $ ) {
      let onePageAuthors = [];
      $('.sonspic').each( ( i, element ) => {
        let contentSection = $(element).find('.cont'),
            authorImg = '',
            authorUrl = '',
            sourceId,
            source = app.config.consts.GUSHIWEN,
            name,
            birthYear,
            deathYear,
            lifeTime = 50,
            briefIntroduction;
        //取头像，不一定存在
        !_.isEmpty( contentSection.find('.divimg') ) ? authorImg = contentSection.find('.divimg img').attr('src') : '';
        name = contentSection.find('p:nth-of-type(1) a').text();
        authorUrl = contentSection.find('p:nth-of-type(1) a').attr('href');
        sourceId = authorUrl.match(/\d+/g)[0];
        briefIntroduction = contentSection.find('p:nth-of-type(2)').text();
        //在简介里截取出作者的出生年月，很有可能获取不到，需要手工校验，正则可以优化下 TODO
        let ageInfo = briefIntroduction.match(/（.+）/)[0].match(/\d+/g);
        if ( _.isArray( ageInfo ) ) {
          [ birthYear, deathYear ] = ageInfo.map( ( item ) => {
            return parseInt( item );
          });
        }
        _.isNumber( birthYear ) && _.isNumber( deathYear ) ?  lifeTime = deathYear - birthYear : '';
        let authorBaseInfo = {
          authorImg: authorImg,
          authorUrl: authorUrl,
          sourceId: sourceId,
          source: source,
          name: name,
          birthYear: birthYear,
          deathYear: deathYear,
          lifeTime: lifeTime,
          briefIntroduction: briefIntroduction
        };
        onePageAuthors.push( authorBaseInfo );
      });
      yield completeAuthorInfo( ctx, onePageAuthors );
    };

    do {
      let currentPageUrl = `${authorUrl}?p=${currentPage}&c=`;
      // console.log( 'currentPageUrl', currentPageUrl );
      let authorListResponse = yield ctx.curl( currentPageUrl, {
        dataType: 'text',
        timeout: 10000
      } );
      let authorPageText = authorListResponse.data;
      let $ = cheerio.load( authorPageText );
      yield interceptAuthorInfo( $ );
      authorCount = parseInt( $('.pages').find('span:nth-last-of-type(1)').text().match(/\d+/g)[0] );
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
    yield ctx.service.author.authorInfoBatchSave( authorsDetailInfo );
  } catch (e) {
    console.log( 'batchArr error' );
  }
}


function authorDealPageIntercept ( ctx, authorBase ) {
  return new Promise(function(resolve, reject) {
    authorBase.anecdote = [];
    //首先解析出作者的生卒年份
    ctx.curl( authorBase.authorUrl, {
      dataType: 'text',
      timeout: 10000
    } ).then( authorPageResponse => {
      let authorDetailPageText = authorPageResponse.data;
      let $ = cheerio.load( authorDetailPageText ),
          anecdoteGroup = $('.sons[style=\'display:none;\']');
      anecdoteGroup.each( ( i, element ) => {
        let anecdoteTitle = $(element).find('.contyishang p:nth-of-type(1)').text().trim();
        let anecdoteDetail = $($(element).find('.contyishang').contents().splice(4)).text().trim();
        authorBase.anecdote.push({
          anecdoteTitle: anecdoteTitle,
          anecdoteDetail: anecdoteDetail
        });
      });
      resolve( authorBase );
    }).catch( err => {
      console.log( 'authorDealPageIntercept err' );
      reject( new Error(`${JSON.stringify(err)}`) );
    } );
  });
}

/*
查询作者所在朝代
SELECT * from periods where (end_year BETWEEN 908 and 958) or (start_year BETWEEN 908 and 958) or ( start_year < 908 and end_year > 958 );
 * */
