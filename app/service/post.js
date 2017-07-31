/*
 * service post
 *
 * fun 封装poet库里的操作
 * create_time 2017年05月22日13:36:30
 * update_time 2017年05月22日13:36:30
 * */

"use strict";
const _ = require('lodash');
const moment = require('moment');

module.exports = app => {
  class post extends app.Service {
    /**
     * 插入文章表
     * @param postInfo
     * @returns {*}
     */
    async insertPost( postInfo ) {
      //同一来源的同一id即视为相同的author
      let checkParams = {
        source_id: postInfo.sourceId,
        source: postInfo.source
      };
      let postRowData = await this.getPost( checkParams );
      if ( _.isEmpty( postRowData ) ) {
        let result = await app.mysql.get('poets').insert('posts', {
          author_id: postInfo.authorId,
          post_title: postInfo.title,
          post_text: postInfo.text,
          post_star: postInfo.star,
          type: postInfo.type,
          source: postInfo.source,
          source_id: postInfo.sourceId,
          source_url: postInfo.postUrl
        });
        return {
          id: result.insertId,
          affectedRows: result.affectedRows
        };
      } else {
        return {
          id: postRowData.id,
          affectedRows: 0
        };
      }
    }

    /**
     * 查询post
     * @param params
     * @returns {*}
     */
    async getPost( params ) {
      let postResult = await app.mysql.get('poets').get( 'posts', params ); //this.app.mysql.get('poets')换成这种应该也不会错
      return postResult;
    }

    /**
     * 批量存储post
     * @param postsInfoArr
     * @returns {Array}
     */
    async postInfoBatchSave( postsInfoArr ) {
      let postIds = [];
      for ( let postInfo of postsInfoArr ) {
        let postId = await this.postInfoSave( postInfo );
        postIds.push( postId );
      }
      return postIds;
    }

    /**
     * 添加文章，若是新增文章则添加文章释义
     * @param postInfo
     * @returns {*}
     */
    async postInfoSave( postInfo ) {
      let postId,
        affectedRows,
        promises = [];
      try {
        let insertResult = await this.insertPost( postInfo );
        postId = insertResult.id;
        affectedRows = insertResult.affectedRows;
      } catch (e) {
        console.log( 'insertPost err', JSON.stringify(e) );
        return;
      }
      //有新增才会添加anecdote
      if ( affectedRows !== 0 ) {
        postInfo.intercepts.forEach( (intercept) => {
          promises.push( this.insertIntercept( postId, intercept ) );
        });

        for ( let tag of postInfo.tags ) {
          let tagResult = await this.service.tag.insertTag( tag );
          promises.push( this.insertPostTag( postId, tagResult.id ) );
        }

        try {
          await promises;
        } catch (e) {
          console.log( 'promises err', JSON.stringify(e) );
          return;
        }
      }
      return postId;
    }

    /**
     * 添加文章释义
     * @param postId
     * @param intercept
     * @returns {*}
     */
    insertIntercept( postId, intercept ) {
      //type值未确定，TODO
      return app.mysql.get('poets').insert('postinterpretations', {
        post_id: postId,
        interpretation_name: intercept.interceptName,
        interpretation_text: intercept.interceptText
      });
    }

    /**
     *
     * @param postId
     * @param tagId
     * @returns {*}
     */
    insertPostTag( postId, tagId ) {
      return app.mysql.get('poets').insert('posttags', {
        post_id: postId,
        tag_id: tagId
      });
    }

  }
  return post;
};
