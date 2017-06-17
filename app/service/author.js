"use strict";
const _ = require('lodash');
const moment = require('moment');

module.exports = app => {
  class author extends app.Service {
    /**
     * 批量添加用户
     * @param authorsDetailInfo
     */
    * authorInfoBatchSave( authorsDetailInfo ) {
      // console.log( 'authorsDetailInfo', JSON.stringify( authorsDetailInfo ) );
      this.poetsClient = app.mysql.get('poets');//这里一个类的共享变量，值得思考如何共享 TODO
      /*
      * 先插入作者表，得到id后再插入anecdote表
      * */
      for ( let authorInfo of authorsDetailInfo ) {
        let authorId,
            anecdotePromises = [];
        try {
          authorId = yield this.insertAuthor( authorInfo );
        } catch (e) {
          console.log( 'insertAuthor err', JSON.stringify(e) );
          return;
        }
        //有新增才会添加anecdote
        if ( authorId !== 0 ) {
          authorInfo.anecdote.forEach( (anecdote) => {
            anecdotePromises.push( this.insertAnecdote( authorId, anecdote ) );
          });
          try {
            yield anecdotePromises;
          } catch (e) {
            console.log( 'anecdotePromises err', JSON.stringify(e) );
            return;
          }
        }
      }
    }

    /**
     * 插入author表 需要添加校验是否和db数据重复逻辑
     * @param authorInfo
     * @returns {Number}
     */
    * insertAuthor( authorInfo ) {
      //同一来源的同一id即视为相同的author
      let checkParams = {
        source_id: authorInfo.sourceId,
        source: authorInfo.source
      };
      let authorRowData = yield this.getAuthor( checkParams );
      if ( _.isEmpty( authorRowData ) ) {
        //不为空，先获取period_id
        let birthYear = _.isNumber( authorInfo.birthYear ) ? authorInfo.birthYear : '不详',
            deathYear = _.isNumber( authorInfo.deathYear ) ? authorInfo.deathYear : '不详',
            periodId = 0;
        if ( _.isNumber( birthYear ) && _.isNumber( deathYear ) ) {
          let periods = yield this.service.period.authorPeriod( birthYear, deathYear );
          periods.length > 0 ? periodId = periods[0].id : '';
        }
        let result = yield this.poetsClient.insert('authors', {
          name: authorInfo.name,
          brief_introduction: authorInfo.briefIntroduction,
          author_img: authorInfo.authorImg,
          birth_year: birthYear,
          death_year: deathYear,
          life_time: authorInfo.lifeTime,
          period_id: periodId,
          author_stars: 5,
          source_id: authorInfo.sourceId,
          source: authorInfo.source,
          source_url: authorInfo.authorUrl,
          http_date: moment().format("YYYY-MM-DD")
        });
        return result.insertId;
      } else {
        return 0;
      }
    }
    //获取Author信息
    * getAuthor( params ) {
      let authorResult = yield this.poetsClient.get( 'authors', params ); //this.app.mysql.get('poets')换成这种应该也不会错
      return authorResult;
    }
    /**
     * 插入anecdote表
     * @param authorId
     * @param anecdote
     * @returns {Promise}
     */
    insertAnecdote( authorId, anecdote ) {
      return this.poetsClient.insert('anecdotes', {
        author_id: authorId,
        anecdote_title: anecdote.anecdoteTitle,
        anecdote_detail: anecdote.anecdoteDetail
      });
    }
  }
  return author;
};
