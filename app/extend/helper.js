/*
 * file 封装一些常用方法
 *
 * create_time 2017年05月23日12:36:57
 * */
"use strict";
const cheerio = require('cheerio');
const _ = require('lodash');
const HOST = `http://so.gushiwen.org`;
const CURLOPTIONS = {
  dataType: 'text',
  timeout: 10000
};


module.exports = {
  /**
   * 抓取古诗文网站的所有作者
   * @param authorUrl
   */
  * dealAuthorsList ( authorUrl ) {
    let currentPage = 1, authorCount = 0;//默认初始页
    let interceptAuthorInfo = function* ( $ ) {
      let onePageAuthors = [];
      $('.sonspic').each( ( i, element ) => {
        let authorBaseInfo = this.getAuthorBaseInfo( $(element) );
        onePageAuthors.push( authorBaseInfo );
      });
      yield this.completeAuthorInfo( onePageAuthors );
    };
    do {
      let currentPageUrl = `${authorUrl}?p=${currentPage}&c=`;
      // console.log( 'currentPageUrl', currentPageUrl );
      let authorListResponse = yield this.ctx.curl( currentPageUrl, CURLOPTIONS );
      let authorPageText = authorListResponse.data;
      let $ = cheerio.load( authorPageText );
      yield interceptAuthorInfo.bind( this, $ );
      authorCount = parseInt( $('.pages').find('span:nth-last-of-type(1)').text().match(/\d+/g)[0] );
      currentPage ++;
      yield this.sleep(1);//循环直接间隔1s
    } while ( currentPage <= 1  );//currentPage <= Math.ceil( authorCount / 10 )
  },
  /**
   * 抓取古诗文网站的所有文章
   * @param postUrl
   */
  * dealPostsList ( postUrl ) {
    let currentPage = 1, postCount = 0;//默认初始页

    //解析文章单页，包含原文，interpretation(译注信息)，作者信息(有可能无)
    let interceptPost = function* ( postsUrl ) {
      let postsInfoArr = [];

      for ( let postUrl of postsUrl ) {
        let postPageResponse, postDetailPageText;
        try {
          postPageResponse = yield this.ctx.curl( postUrl, CURLOPTIONS );
        } catch (e) {
          // console.log( 'curl timeout', e, postUrl );
          continue;
        }
        postDetailPageText = postPageResponse.data;
        let $ = cheerio.load( postDetailPageText );
        //获取文章中不同的片段
        let postSection = $('.left > div:nth-child(2)'),
          interceptGroup = $('.sons[style=\'display:none;\']'),
          authorSection = $('.left > .sonspic'),
          tagSection = postSection.find('.tag a');
        let postInfo = { authorId: 0, intercepts: [] };//存放一篇文章的所有信息
        postInfo.title = postSection.find('.cont h1').text().trim();
        postInfo.text = postSection.find('.cont .contson').text().trim();
        postInfo.star = postSection.find('.tool .good').text().trim();
        postInfo.tags = [];
        postInfo.type = this.app.config.consts.POET;
        postInfo.source = this.app.config.consts.GUSHIWEN;
        postInfo.sourceId = postUrl.match(/\d+/g)[0];
        postInfo.postUrl = postUrl;
        if ( authorSection.length > 0 ) {
          let sourceId = authorSection.find('p:nth-of-type(1) a').attr('href').match(/\d+/g)[0];
          let checkParams = {
            source_id: sourceId,
            source: this.app.config.consts.GUSHIWEN
          };
          let authorRowData;
          try {
            authorRowData = yield this.ctx.service.author.getAuthor( checkParams );
          } catch (e) {
            console.log( 'authorRowData', e );
          }
          //如果authorRowData不存在，则需要添加到数据库
          if ( _.isEmpty( authorRowData ) ) {
            let authorBaseInfo = this.getAuthorBaseInfo( authorSection );
            try {
              let authorIds = yield this.completeAuthorInfo( [authorBaseInfo] );
              authorIds.length > 0 ? postInfo.authorId = authorIds[0] : '';
            } catch (e) {
              console.log( 'completeAuthorInfo err', e );
            }
          } else {
            postInfo.authorId = authorRowData.id;
          }
        }
        tagSection.each( ( index, tag ) => {
          postInfo.tags.push( $(tag).text() )
        });
        interceptGroup.each( ( i, element ) => {
          let interceptName = $(element).find('.contyishang p:nth-of-type(1)').text().trim();
          let interceptText = $($(element).find('.contyishang').contents().splice(4)).text().trim();
          postInfo.intercepts.push({
            interceptName: interceptName,
            interceptText: interceptText
          });
        });
        postsInfoArr.push( postInfo );
      }
      yield this.ctx.service.post.postInfoBatchSave( postsInfoArr );
    };
    do {
      let currentPageUrl = `${postUrl}?p=${currentPage}`;
      let postListResponse = yield this.ctx.curl( currentPageUrl, CURLOPTIONS );
      let postPageText = postListResponse.data;
      let $ = cheerio.load( postPageText );
      //解析出十个文章的url，并并发解析存db
      let postsUrl = [];
      $('.left .sons').each( ( i, element ) => {
        let postUrl = HOST + $(element).find('.cont p:nth-of-type(1) a').attr('href');
        postsUrl.push( postUrl );
      });
      yield interceptPost.bind( this, postsUrl );
      postCount = parseInt( $('.pages').find('span:nth-last-of-type(1)').text().match(/\d+/g)[0] );
      currentPage ++;
      yield this.sleep(1);//循环直接间隔1s
    } while ( currentPage <= 1  );//currentPage <= Math.ceil( postCount / 10 )
  },
  /**
   * 批量处理传染进来的authorBaseInfo数组，返回添加好的数组id
   * @param authorBaseInfo
   */
  * completeAuthorInfo( authorBaseInfo ) {
    let batchArr = [];
    //替换authorUrl，并组成promises数组
    authorBaseInfo.forEach( ( item ) => {
      item.authorUrl = HOST + item.authorUrl;
      batchArr.push( this.authorDealPageIntercept( item ))
    });
    try {
      let authorsDetailInfo = yield batchArr;
      try {
        let authorIds = yield this.ctx.service.author.authorInfoBatchSave( authorsDetailInfo );
        return authorIds;
      } catch (e) {
        console.log( 'completeAuthorInfo service error', JSON.stringify(e) );
      }
    } catch (e) {
      console.log( 'authorsDetailInfo batch error'  );
    }
    return [];
  },
  /**
   * 根据authorBaseInfo填充author的其他信息
   * @param authorBase
   * @returns {Promise}
   */
  authorDealPageIntercept( authorBase ) {
    let that = this;//TO FIX
    return new Promise(function(resolve, reject) {
      authorBase.anecdote = [];
      //首先解析出作者的生卒年份
      that.ctx.curl( authorBase.authorUrl, CURLOPTIONS )
        .then( authorPageResponse => {
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
        console.log( 'authorDealPageIntercept err', JSON.stringify(err) );
        reject( new Error(`${JSON.stringify(err)}`) );
      } );
    });
  },

  /**
   * 从sonspic块中截取authorBaseInfo并返回
   * @param $element
   * @returns {{authorImg: string, authorUrl: string, sourceId: *, source: number, name: (XMLList|*), birthYear: *, deathYear: *, lifeTime: number, briefIntroduction: (XMLList|*)}}
   */
  getAuthorBaseInfo ( $element ) {
    let contentSection = $element.find('.cont'),
      authorImg = '',
      authorUrl = '',
      sourceId,
      source = this.app.config.consts.GUSHIWEN,
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
    let ageInfo = [];//这个地方[0]会报错
    if ( !_.isEmpty( briefIntroduction.match(/（.+）/) )) {
      ageInfo = briefIntroduction.match(/（.+）/)[0].match(/\d+/g);
    }
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
    return authorBaseInfo;
  },
  /**
   * 暂停函数
   * @param second
   * @returns {Promise}
   */
  sleep( second ) {
    return new Promise( function(resolve, reject) {
      setTimeout( () => {
        resolve();
      }, second * 1000 );
    })
  }
};
