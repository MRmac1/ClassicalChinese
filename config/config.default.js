const path = require('path');

module.exports = appInfo => {
  return {
    mysql: {
      clients: {
        poets: {
          database: 'poets',
        }
      },
      // 所有数据库配置的默认值
      default: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123123',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    keys: ":3Fq8Z4pGPmuP[%qh?C#]>pk@ysyq5",
    static: {
      dir: path.join( appInfo.baseDir, 'app/public')
    },
    view: {
      defaultViewEngine: 'ejs',
      mapping: {
        '.ejs': 'ejs',
        '.html': 'ejs',
      },
    },
    consts: {
      GUSHIWEN: 1,
      POET: 1
    }
  }
};
