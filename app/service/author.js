"use strict";
const _ = require('lodash');
const moment = require('moment');

module.exports = app => {
  class author extends app.Service {
    /**
     * 批量添加用户
     * @param authorsDetailInfo
     */
    async authorInfoBatchSave( authorsDetailInfo ) {
      let authorIds = [];
      for ( let authorInfo of authorsDetailInfo ) {
        let authorId = await this.authorInfoSave( authorInfo );
        authorIds.push( authorId );
      }
      return authorIds;
    }

    /**
     * 单个作者信息的添加，先插入作者表，得到id后再插入anecdote表
     * @param authorInfo
     */
    async authorInfoSave( authorInfo ) {
      let authorId,
          affectedRows,
          anecdotePromises = [];
      try {
        let insertResult = await this.insertAuthor( authorInfo );
        authorId = insertResult.id;
        affectedRows = insertResult.affectedRows;
      } catch (e) {
        console.log( 'insertAuthor err', JSON.stringify(e) );
        return;
      }
      //有新增才会添加anecdote
      if ( affectedRows !== 0 ) {
        authorInfo.anecdote.forEach( (anecdote) => {
          anecdotePromises.push( this.insertAnecdote( authorId, anecdote ) );
        });
        try {
          await anecdotePromises;
        } catch (e) {
          console.log( 'anecdotePromises err', JSON.stringify(e) );
          return;
        }
      }
      return authorId;
    }

    /**
     * 插入author表 需要添加校验是否和db数据重复逻辑
     * @param authorInfo
     * @returns {Number}
     */
    async insertAuthor( authorInfo ) {
      //同一来源的同一id即视为相同的author
      let checkParams = {
        source_id: authorInfo.sourceId,
        source: authorInfo.source
      };
      let authorRowData = await this.getAuthor( checkParams );
      if ( _.isEmpty( authorRowData ) ) {
        //不为空，先获取period_id
        let birthYear = _.isNumber( authorInfo.birthYear ) ? authorInfo.birthYear : '不详',
            deathYear = _.isNumber( authorInfo.deathYear ) ? authorInfo.deathYear : '不详',
            periodId = 0;
        if ( _.isNumber( birthYear ) && _.isNumber( deathYear ) ) {
          let periods = await this.service.period.authorPeriod( birthYear, deathYear );
          periods.length > 0 ? periodId = periods[0].id : '';
        }
        let result = await app.mysql.get('poets').insert('authors', {
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
        return {
          id: result.insertId,
          affectedRows: result.affectedRows
        };
      } else {
        return {
          id: authorRowData.id,
          affectedRows: 0
        };
      }
    }
    //获取Author信息
    async getAuthor( params ) {
      let authorResult = await app.mysql.get('poets').get( 'authors', params ); //this.app.mysql.get('poets')换成这种应该也不会错
      return authorResult;
    }
    /**
     * 插入anecdote表
     * @param authorId
     * @param anecdote
     * @returns {Promise}
     */
    insertAnecdote( authorId, anecdote ) {
      return app.mysql.get('poets').insert('anecdotes', {
        author_id: authorId,
        anecdote_title: anecdote.anecdoteTitle,
        anecdote_detail: anecdote.anecdoteDetail
      });
    }
  }
  return author;
};
