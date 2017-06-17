/*
 * service period
 *
 * fun 封装period表里的操作
 * create_time 2017年6月17日10:09:35
 * update_time 2017年6月17日10:09:40
 * */

"use strict";

module.exports = app => {
  class period extends app.Service {
    * authorPeriod( birthYear, deathYear ) {
      let periodsInfo = yield app.mysql.get('poets').query( `SELECT id from periods where (end_year BETWEEN ${birthYear} and ${deathYear}) or (start_year BETWEEN ${birthYear} and ${deathYear}) or ( start_year < ${birthYear} and end_year > ${deathYear} ) and type = 1`  );
      return periodsInfo;
    }
  }
  return period;
};