#### 思路

`前端负责生成模板文件到app/view目录下，服务器端吐出页面的时候带上随机token`

#### 文件夹目录规划

src中存放全部前端文件，由app.js导出bundle。

layout 文件夹存放页面级别的组件，也是与redux交互的地方。
container 文件夹存放大模块的组件
component 文件夹存放最小粒度的组件( 有没有可能只更改component文件夹中的内容即做到全平台兼容？ )

#### webpack 配置摘要

使用webpack的 动态引用(Dynamic Imports) 会导致 webpack.xx 的插件不能用，比如代码压缩的。
