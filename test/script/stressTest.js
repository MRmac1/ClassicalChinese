/*
 * file 压力测试脚本
 *
 * author darrenzhou
 * create_time 2017年7月2日20:24:52
 * update_time 2017年7月2日20:24:57
 * */

 /*

 file 探索1服务端压力测试

 author darrenzhou
 create_time 2017年07月03日14:33:29
 */
 "use strict"

 const MTT = require('../../servant/ExploreBaseServerProxy').MTT;
 const AI = require('../../servant/ExploreBaseServerProxy').AI;
 const Taf  = require("@tencent/taf-rpc").client;

 process.env.TAF_CONFIG = '/usr/local/app/taf/MTT.QBCommodityLibraryServer/bin/src/config/MTT.QBCommodityLibraryServer.config.conf';//这条才能正确爬取到

 //压测10分钟
 let startTime = new Date().getTime();
 // let endTime = startTime + 1000 * 60 * 10;
 let endTime = startTime + 1000 * 10;
 // let endTime = startTime + 10;

 let exploreBaseClient = Taf.stringToProxy( MTT.ExploreBaseServerProxy, 'MTT.ExploreBaseServer.ExploreBaseServerOBJ' );

 let successCount = 0,
     errorCount = 0;

 //调用taf
 let exploreBaseQuery = ( i ) => {
   let type = 'other';
   let imageRetrievalReq = buildQuery( type );

   return new Promise(function(resolve, reject) {
     let success = function ( result ) {
       console.log( `第${i + 1}次调用` );
       successCount ++;
       console.log( '成功次数 ', successCount );
       resolve()
     }
     let error = function ( result ) {
       console.log( `第${i + 1}次调用` );
       errorCount ++;
       console.log( '失败次数 ', errorCount );
       resolve()
     }
     exploreBaseClient.ExploreBaseServerImageRetrievalInfo( imageRetrievalReq )
                      .then( success, error )
                      .done();
   });
 }

 /*
 1毫秒发送一次请求，一秒钟就是1000次，就是看一秒钟内是否能处理完1000次的均匀请求，忽略do while的耗时
 */

 let i = 0;
 do {
   setTimeout( exploreBaseQuery.bind( null, i ), i * 5 + 30 );
   i ++;
 } while ( startTime + i < endTime );

 /*
 构造请求的结构体
 */
 function buildQuery( type ) {

 }
