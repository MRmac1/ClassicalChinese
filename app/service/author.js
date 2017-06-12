"use strict";
const _ = require('lodash');

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
          console.log( 'insertAuthor err', JSON.stringify(e), authorInfo );
          return;
        }
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

    /**
     * 插入author表
     * @param authorInfo
     * @returns {Number}
     */
    * insertAuthor( authorInfo ) {
      //需要添加校验是否和db数据重复逻辑
      let result = yield this.poetsClient.insert('authors', {
        name: authorInfo.name,
        brief_introduction: authorInfo.briefIntroduction,
        author_img: authorInfo.authorImg,
        birth_year: _.isNumber( authorInfo.birthYear ) ? authorInfo.birthYear : '不详',
        death_year: _.isNumber( authorInfo.deathYear ) ? authorInfo.deathYear : '不详',
        life_time: authorInfo.lifeTime,
        author_stars: 5
      });
      return result.insertId;
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
