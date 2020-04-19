<p align="center">
 <img src="https://unpkg.com/zoomlens@1.0.1/source/imgs/logo.png" alt="Logo"></a>
</p>
<p align="center">
  <a href="https://badge.fury.io/js/zoomlens"><img src="https://badgen.net/npm/v/zoomlens" alt="npm version" height="18"></a>
  <a href="https://badge.fury.io/js/zoomlens"><img src="https://badgen.net/github/release/luowatson/zoomlens.js" alt="github version" height="18"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/packagephobia/install/zoomlens" alt="Install size"></a>	   <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/packagephobia/publish/zoomlens" alt="Install size"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://img.shields.io/badge/gzip size: Css-none-critical" alt="Gzip size"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/github/tag/luowatson/zoomlens.js" alt="latest tag
latest tag"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/npm/dm/zoomlens" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/bundlephobia/min/zoomlens" alt="minified size"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://img.shields.io/badge/author-Luo Watson-yellowgreen" alt="Author"></a>
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://badgen.net/github/license/luowatson/zoomlens.js" alt="License"></a>
</p>

> 如果你喜欢这个内容，你可以联系我或者在[Github](https://github.com/LuoWatson)上关注我 :+1:

[![NPM stats](https://nodei.co/npm/zoomlens.svg?downloadRank=true&downloads=true)](https://www.npmjs.org/package/zoomlens) 

<p align="right">
	Language:  &nbsp;<a href="https://github.com/LuoWatson/zoomlens.js/blob/master/README.md">English | </a>中文
</p>

## 目录

- [简介](#简介)
	- [设计图](#设计图)
- [安装](#安装)
	- [下载](#下载)
	- [CDN 链接](#cdn-链接)
- [用法](#用法)
- [实例](#实例)
- [选项](#选项)
- [浏览器兼容](#浏览器兼容)
- [维护者](#维护者)
- [如何贡献](#如何贡献)
- [历史版本](#历史版本)
- [使用许可](#使用许可)

## 简介
这是一款小巧且功能强大的商品图放大镜工具，它没有任何依赖关系；对图片尺寸不做特别要求，也不用手动编写HTML标记或额外导入Css样式。在图片加载这方面用的是异步技术，所以在性能这块您不用担心，而您唯一要做的就是确定给它的是一张图片。


### 设计图
<p align="center">
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://unpkg.com/zoomlens@1.0.1/source/imgs/design_layout.png" alt="Logo"></a>
</p>

* [Official website](https://luowatson.github.io/zoomlens.js/)
* [Documentation](https://luowatson.github.io/zoomlens.js/)

## 安装
### 下载
通过[npm](https://www.npmjs.com/)安装，或下载为[zip](https://github.com/LuoWatson/zoomlens.js/archive/master.zip):

```
npm install zoomlens --save
```
### CDN 链接
``` html
<script src="https://unpkg.com/zoomlens@1.0.1/dist/zoomlens-1.0.1.js"></script>
<!-- or -->
<script src="https://unpkg.com/zoomlens@1.0.1/dist/zoomlens-1.0.1.min.js"></script>
```
## 用法
你需要将其导入到您将使用它的文件中。
```html
<script src="./zoomlens/dist/zoomlens-1.0.1.js"></script>
```

```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})

```

### normal
zoomlens模式默认为"ormal"，因此不必指定"zoomType"类型。
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "normal",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```
### inside
在"inside"模式下,大图会内嵌在"mmoc"中。
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "inside",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```

### drag
在"drag"模式下，你需要拖动鼠标来查看图片细节。
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "drag",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```

## 实例
<p align="left">
 <img src="https://unpkg.com/zoomlens@1.0.1/source/imgs/demo.gif" alt="Demo">
</p>

## 选项

| 属性       | 类型                               | 默认值            | 例子                                                             |
| -------------- | ---------------------------------- | ------------------ | ------------------------------------------------------------------- |
| `el`           | `String`  \| `HTMLTemplateElement` | `null`             | `"#wrap"` \| `element`                                              |
| `paths`        | `Object`  \| `Array`               | `null`             | `['xxx.jpg',...]` \| `{max: [],min: []}`                            |
| `styles`       | `Object`                           | `Object`           | `{mmoc:{},zoom:{},mask:{},pics:{}}`                                 |
| `zoomType`     | `String`                           | `"normal"`         | `"normal"` \| `"inside"` \| `"drag"`                                |
| `correlate`    | `Boolean`                          | `true`             | `true` \| `false`                                                   |
| `zoomScale`    | `number`                           | `0.38`             | `0 ~ 1`                                                             |
| `zoomResize`   | `Boolean`                          | `false`            | `true` \| `false`                                                   |
| `zoomSeat`     | `Boolean` \| `String`              | `"right"`          | `true` \| `false` \| `"left"` \| `"top"` \| `"bottom"`              |
| `picsSeat`     | `Boolean` \| `String`              | `"bottom"`         | `true` \| `false` \| `"left"` \| `"top"` \| `"right"`               |
| `dotGap`       | `number`                           | `1`                | `0 ~ `                                                              |
| `dotSize`      | `Array`                            | `[1,1]`            | `[~,~]`                                                             |
| `dotColor`     | `String`                           | `"#36c"`           | `"#36c"` \| `"blue"`                                                |
| `imgGap`       | `number`                           | `10`               | `0 ~`                                                               |
| `imgBorder`    | `String`                           | `"1px solid #666"` | `"1px solid #666"` \| `0`                                           |
| `picsSpeed`    | `number`                           | `0.2`              | `0 ~ 1`                                                             |
| `adsorbSpeed`  | `number`                           | `0.2`              | `0 ~ 1`                                                             |


* `el:` 将要操作的目标元素,你可以给一个字符串,也可以是一个HTML元素对象.
* `paths:` 将要操作的图片路径,可以是一个数组，也可以是一个Javscript对象.
* `styles:` HTML的元素样式表,它只能是一个javascript对象,有关详细请查看操作文档.
* `zoomType:` 在页面中的展现方式, 目前只有"noraml"、"inside"、"drag"这三种类型.
* `correlate:` "mask"与"zoom "的关联状态, 默认为"true", "zoom"的尺寸参照于"mask".
* `zoomScale:` 大图的缩放比例，参照于"mask"的尺寸, 默认值是 0.38, 最大只能设置为 "1".
* `zoomResize:` "zoom"的尺寸是否可调,当值为"true"时, "zoom"元素的尺寸不再参照于"mask",而使用用户给定的值.
* `zoomSeat:` "zoom" 的显示位置，默认情况下它会在"mmoc"的右边,如果设置为"false"它将会参照于最近的一个定位元素.
* `picsSeat:` "pics" 的显示位置，默认情况下它会在"mmoc"的底部,如果设置为"false"它将会参照于最近的一个定位元素.
* `dotGap:` "mask" 中绘制点的间距, 默认情况下为 "1px", 但这并不非常精准，如果你设置的值令元素超出可视区域,"dotGap"会进行必要的压缩.
* `dotSize:` "mask" 中绘制点的大小, 它需要的是一个数组,数组中的值分别是点的长宽比.
* `dotColor:` "mask" 中绘制点的颜色, 默认颜色为"#36c",你可以自行设置.
* `imgGap:` "pics" 中的图片间距, 默认值为"10px",它不能大于"mmoc"的宽高,如果你非要这么做其实也是被允许的.
* `imgBorder:` "pics" 中的图片边框, 当你把鼠标移动到图片上时你会发现被你选中的图片会产生一个边框.
* `picsSpeed:` 拖动"pics" 中的图片后松开鼠标时执行的动画时延, 默认值为0.2,最大只能设为"1".
* `adsorbSpeed:` 拖动"pics" 中的图片元素超出可视区域时执行吸附操作的动画时延,默认值为0.2,最大只能设为"1".


## 浏览器兼容

![IE](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/IE.png) | ![Edge](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Edge.png) | ![Chrome](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Chrome.png) | ![Firefox](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Firefox.png) | ![Opera](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Opera.png) | ![Safari](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Safari.png)
--- | --- | --- | --- | --- | --- |
IE 7+ ✔ |  Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## 维护者
[@LuoWatson](https://github.com/LuoWatson).

## 如何贡献
zoomlens.js 是一个免费的开源库，我们非常感谢你提供的任何帮助——无论是修复bug，改进文档，还是建议新特性。查看贡献指南以获得更多信息!

感谢所有已经为zoomlens.js 做出贡献的人!

## 历史版本

有关详细请查看[版本](https://github.com/LuoWatson/zoomlens.js/releases).

## 使用许可

[MIT License](https://github.com/LuoWatson/zoomlens.js/blob/master/LICENSE) Copyright(c)2020-present, Luo Watson.
