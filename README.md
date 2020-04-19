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

> If you like this content, you can ping me or follow me on [Github](https://github.com/LuoWatson). :+1:

[![NPM stats](https://nodei.co/npm/zoomlens.svg?downloadRank=true&downloads=true)](https://www.npmjs.org/package/zoomlens) 

<p align="right">
	Language:  &nbsp;English | <a href="https://github.com/LuoWatson/zoomlens.js/blob/master/docs/README_CN.md">中文</a>
</p>

## Table of Contents

- [Introduction](#introduction)
	- [Blueprint](#blueprint)
- [Install](#install)
	- [Download](#download)
	- [CDN Link](#cdn-link)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Browser Support](#Browser-support)
- [Contributing](#contributing)
- [History](#history)
- [License](#license)

## Introduction
This is a small and powerful commodity map magnifying glass tool, it has no dependencies; There is no special requirement for image size, no need to manually write HTML tags or import additional Css styles. The picture loading is done asynchronously, so you don't have to worry about performance, and the only thing you have to do is make sure it's a picture.

### Blueprint
<p align="center">
  <a href="https://www.npmjs.com/package/zoomlens"><img src="https://unpkg.com/zoomlens@1.0.1/source/imgs/design_layout.png" alt="Logo"></a>
</p>

* [Official website](https://luowatson.github.io/zoomlens.js/)
* [Documentation](https://luowatson.github.io/zoomlens.js/)

## Install
### Download
Install via [npm](https://www.npmjs.com/), or [download as a zip](https://github.com/LuoWatson/zoomlens.js/archive/master.zip):

```
npm install zoomlens --save
```
### CDN Link
``` html
<script src="https://unpkg.com/zoomlens@1.0.1/dist/zoomlens-1.0.1.js"></script>
<!-- or -->
<script src="https://unpkg.com/zoomlens@1.0.1/dist/zoomlens-1.0.1.min.js"></script>
```
## Usage
Then import it into the file where you'll use it.
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
Zoomlens mode is "normal" by default, so you don't have to specify the "zoomType" type.
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "normal",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```
### inside
In "inside" mode, the large image is embedded in the "mmoc".
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "inside",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```

### drag
In "drag" mode, you need to drag the mouse to see the details of the picture.
```Js
var zoomlens = new ZoomLens({
  el: "#wrap",
  zoomType: "drag",
  paths: ["pic_1.jpg","pic_2.jpg",...]
})
```

## Examples
<p align="left">
 <img src="https://unpkg.com/zoomlens@1.0.1/source/imgs/demo.gif" alt="Demo">
</p>

## Options
The options enable the customization of the zoom. They are defined as an object with the following properties:

| Property       | Type                               | Default            | Example                                                             |
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


* `el:` The target element to be manipulated can be either a string or an HTML element object.
* `paths:` The image path to be manipulated can be an array or a Javscript object.
* `styles:` HTML element style sheet, which can only be a javascript object, see the action documentation for details.
* `zoomType:` Currently, there are only three types of presentation on the page: "noraml", "inside" and "drag".
* `correlate:` The associated state of "mask" and "zoom" is "true" by default, and the size of "zoom" refers to "mask".
* `zoomScale:` The zoom ratio of the large picture, referring to the size of "mask", is 0.38 by default and can only be set to "1" at most.
* `zoomResize:` If the size of "zoom" is adjustable, when the value is "true", the size of the "zoom" element will no longer refer to the "mask", but will use the value given by the user.
* `zoomSeat:` The "zoom" position, by default, will be to the right of the "mmoc", and if set to "false" it will refer to the nearest positioning element.
* `picsSeat:` The "pics" position, by default, will be to the bottom of the "mmoc", and if set to "false" it will refer to the nearest positioning element.
* `dotGap:` The spacing of the dots in the "mask" is "1px" by default, but this is not very accurate, and if you set a value that pushes the element out of the visible area,"dotGap" will compress as necessary.
* `dotSize:` The size of the dot in the "mask", what it needs is an array, and the values in the array are the ratio of the dot's length to its width.
* `dotColor:` The color of the dot in the "mask", the default color is "#36c", you can set it.
* `imgGap:` The spacing in pics, which defaults to "10px", cannot be greater than the width and height of the mmoc, which is allowed if you must.
* `imgBorder:` Pics picture border, when you move the mouse over the picture you will find that the selected picture will generate a border.
* `picsSpeed:` When the mouse is released after dragging the picture, the animation delay is 0.2 by default and can only be set to "1" at most.
* `adsorbSpeed:` When the mouse is released after dragging the picture, the animation that is executed when the element is out of the visual area, the animation delay is 0.2 by default, and can only be set to "1" at most.


## Browser Support

![IE](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/IE.png) | ![Edge](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Edge.png) | ![Chrome](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Chrome.png) | ![Firefox](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Firefox.png) | ![Opera](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Opera.png) | ![Safari](https://unpkg.com/zoomlens@1.0.1/source/imgs/icon/Safari.png)
--- | --- | --- | --- | --- | --- |
IE 7+ ✔ |  Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## Maintainers
[@LuoWatson](https://github.com/LuoWatson).

## Contributing
zoomlens.js is a free and open source library, and we appreciate any help you're willing to give - whether it's fixing bugs, improving documentation, or suggesting new features. Check out the contributing guide for more!

Thank you to all the people who already contributed to zoomlens.js!

## History

For detailed changelog, check [Releases](https://github.com/LuoWatson/zoomlens.js/releases).

## License

[MIT License](https://github.com/LuoWatson/zoomlens.js/blob/master/LICENSE) Copyright(c)2020-present, Luo Watson.
