/*
 * file 封装一些常用方法
 *
 * create_time 2017年05月23日12:36:57
 * */
"use strict";
const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = {
  * dealAuthorsList ( authorUrl ) {
    const authorListResponse = yield this.ctx.curl( authorUrl, {
      dataType: 'text',
      timeout: 3000,
    } );
    let authorPageText = authorListResponse.data;
    let $ = cheerio.load( authorPageText ),
        onePageAuthors = [];
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
    yield completeAuthorInfo( onePageAuthors );

  },
  * dealPostsList ( postUrl ) {
    console.log( 'in dealPostsList ', postUrl );
  }
};

function* completeAuthorInfo( authorBaseInfo ) {
  console.log( JSON.stringify(authorBaseInfo) );
}