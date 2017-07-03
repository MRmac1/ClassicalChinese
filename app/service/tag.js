/*
 * service period
 *
 * fun 封装period表里的操作
 * create_time 2017年6月17日10:09:35
 * update_time 2017年6月17日10:09:40
 * */

"use strict";

const _ = require('lodash');

module.exports = app => {
  class tag extends app.Service {
    /**
     * 插入文章表
     * @param tagInfo
     * @returns {*}
     */
    * insertTag( tagName ) {
      let params = {
        tag_name: tagName
      };
      let tagRowData = yield this.getTag( params );
      if ( _.isEmpty( tagRowData ) ) {
        let result = yield app.mysql.get('poets').insert('tags', {
          tag_name: tagName
        });
        return {
          id: result.insertId,
          affectedRows: result.affectedRows
        };
      } else {
        return {
          id: tagRowData.id,
          affectedRows: 0
        };
      }
    }

    /**
     * 查询tag
     * @param params
     * @returns {*}
     */
    * getTag( params ) {
      let postResult = yield app.mysql.get('poets').get( 'tags', params );
      return postResult;
    }
  }
  return tag;
};