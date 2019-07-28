# 美妆小铺古风版

-  从2018-10-08开始学习并尝试着写，到2018-11-06全部测试通过，正好30天。这个小程序实现了购物商城、智能推荐、物流定位、智慧客服、朋友圈、视频直播和弹幕网等功能，尤其在页面设计上下了大工夫，茉莉紫的主题颜色，我觉得颜值蛮高的，欢迎体验~~

  - 由于是个人小程序,发布为正式版要交钱,只能发布为体验版,以下是体验版的二维码,需要我手工认证才能进入小程序,想要体验的话请微信联系我gusuziyi
<img src="美妆小铺体验码.jpg" width="400" height="400" align=center />


## 所遇到的典型问题汇总

- 小程序使用的是wxss而非css，他引入了rpx来解决不同设备尺寸差异的问题，但同样具有css无法运算、嵌套和定义变量的问题，所以我使用了gulp+less对wxss进行构建，详见gulpfile.js

- 微信官方UI有两套：小程序默认内置的和weui，两套UI有大量的重复功能，而且偶尔还互相干扰，weui几乎没有文档，只能撸源码，开发体验极差，导致光写界面就用了18天，今后weui最好按需引入，同时想要使用淘宝iconfont，必须转成base64格式才可以，详见style文件夹

- 组件中的properties和data使用的方法一致，properties甚至可以直接赋值，赋空值也可以，this.setData居然可以自动刷新dom,必须好评

- 关于收藏夹的存储设计:初始化后调取手机存储收藏夹,然后更新到app.globalData.myFav中供不同页面加载,每次点击收藏时,更新页面中的myFav以刷新dom，更新app.globalData.myFav以同步各页面，更新Storage以长久保存

- 没找到类似webpack的resolve工具,所以写页面navigateTo和usingComponents时无比蛋疼,好在页面内navigate可以使用get方式传值,注意传复杂数组要JSON化

- 组件的ready事件无法读取到properties值,所以想要让组件自动刷新，只能在父组件中调用this.selectComponent(),但ready可以调用到methods和data，因此倒计时操作不需要借助父组件

- 数据库+js逻辑+智能机器人一共写了大约十天，主要得益于腾讯云极其通俗简洁的存储模式、微信开发工具对js极好的热刷新优化以及无需状态管理，云开发今后必定大有发展

- wxss居然不支持右键检查、各节点里面有一堆莫名其妙的#shadow-root、wxss热刷新巨慢，平均要等2-3秒、750rpx的宽度，即使计算好了有时也会出现左右压缩变形的问题，希望这些问题今后能得到优化

- 个人开发者无法在小程序中开通微信支付功能,常见的微信支付方式我已做整理 [微信支付接口对比](微信支付接口对比.xlsx)

- [文档结构图](文档结构.md)  

- [图片预览](https://gusuziyi.github.io/ancientBeauty/)
