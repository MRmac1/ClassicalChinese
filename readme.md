### ClassicalChinese 项目架构

---

#### server端

采用阿里开源的egg框架。

#### 域名配置，nginx安装

```
Docroot is: /usr/local/var/www

The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /usr/local/etc/nginx/servers/.

To have launchd start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  nginx
==> Summary
🍺  /usr/local/Cellar/nginx/1.12.0_1: 23 files, 1MB
```

egg 框架使用心得

`schedule`

1. timeout的设置
