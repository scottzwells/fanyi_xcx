# 翻译小程序

<h1>1.成员列表：</h1>
<h3>组长：宋宇成</h3>
<h3>组员：周唯</h3>


<h1>2.目标：</h1>
<h3>①实现翻译功能</h3>
<p>调用百度翻译API，并以此给出自定义的调用API，实现更方便的翻译功能实现。</p>
<h3>②实现历史记录保存、图片翻译与语音翻译</h3>
<p>底部导航栏通向这三个页面。</p>

<h1>3.项目结构：</h1>
<p>该项目的主要结构与重要文件如下：</p>

```
·
├─code                            // 代码目录
│  ├─img                          // 小程序内部图像
│  ├─pages                        // 小程序的各个界面
│  │  ├─history                   // 历史界面
│  │  ├─index                     // 主界面
│  │  ├─picture                   // 图片翻译界面
│  │  └─voice                     // 语音翻译界面
│  ├─utils                        // 插件
│  │  ├─baidu-translate-api.js    // 百度翻译API
│  │  ├─md5.min.js                // 鉴权码
│  │  ├─util.js                   // 获取当前时间
│  ├─app.wxss                     // 定义全局样式(输入框等)
│
├─docs                            // 文档目录
│  ├─架构设计.md
│  ├─界面原型文档.md
│  ├─组件接口.md
│  ├─需求分析.md
│
└─images                          // 文档图片目录
```