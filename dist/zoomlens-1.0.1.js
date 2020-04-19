/**
 * zoomlens.js v1.0.1
 * Licensed MIT for open source use.
 * Copyright(c)2020-present, Luo Watson.
 * Github: https://github.com/LuoWatson/zoomlens.js, Email: <LuoWatson@yeah.net>
 */
!(function(global,factory){'use strict';

	/***********************************/
	/**
	 *
	 *	暴露出工具给外界使用
	 */

	 typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	 typeof define  === 'function' && define.amd ? define(factory) :
	 (global = global || self,global.ZoomLens = factory());


})(this,function(){ 'use strict';

	var

	// 版本号
	VERSION = 'v1.0.1',

	// 元素类名
	BOXCLASSNAME = 'zoom-lens',

	// 子集工具
	MZMCLASSNAME = {mmoc:Mmoc, zoom:Zoom, mask:Mask, pics:Pics},

	// 通用样式
	STYLETEXTELS = {top:0,left:0,margin:0,border:0,padding:0,position:'absolute'},

	/************************************/
	/**
	 *
	 * 默认配置项
	 */

	CONFIGURATION = {
		// 默认配置
		config: {

			/**
			 * html 目标节点
			 */
			el             : null,

			/**
			 * 存放图片路径
			 */ 
			paths          : null,

			/**
			 *
			 * 存放'mask' 与 'zoom' 的关联状态
			 * 若一方的尺寸发生改变，另一方也将受其影响
			 */
			correlate      : true,

			/**
			 *
			 * 'zoom' 的缩放比例 -> 参照于 'mask'
			 */
			zoomScale      : .38,

			/**
			 *
			 * 'zoom' 是否允许调整大小
			 */ 
			zoomResize     : false,

			/**
			 *
			 * 存放'zoom' 的排版位置
			 */ 
			zoomSeat       : 'right',

			/**
			 *
			 * 存放'pics' 的排版位置
			 */ 
			picsSeat       : 'bottom',

			/**
			 *
			 * 存放'mask' 绘制点间距
			 */
			dotGap         : 1,

			/**
			 *
			 * 存放'mask' 绘制点大小
			 */
			dotSize        : [1,1],

			/**
			 *
			 * 存放'mask' 绘制点颜色
			 */
			dotColor	   : '#36c',

			/**
			 *
			 * 存放图片的间隔大小
			 */ 
			imgGap         : 10,

			/**
			 *
			 * 存放'pics' 下ul元素的缓延时值
			 */
			picsSpeed      : .2,

			/**
			 *
			 *	存放'pics' 下ul元素超边界后执行的吸附动画时长
			 */ 
			adsorbSpeed    : .2,

			/**
			 *
			 * 存放'pics' 下的被选中图片的边框值
			 */
			imgBorder	   : '1px solid #666',

			/**
			 *
			 * 模式： normal / inside / drag
			 */
			zoomType	   : 'normal'
		},

		// 默认样式
		styles: {
			mmoc: {
				width: 300,
				height: 200,
				border: '1px solid #222'
			},
			zoom: {
				width:  0,
				height: 0
			},
			mask: {
				width: 80,
				height: 80
			},
			pics: {
				width:  0,
				height: 0
			}
		}
	}


	/***********************************/
	/**
	 * 子工具：
	 * 
	 * 预览-Mmoc
	 * 缩览-Zoom
	 * 蒙版-Mask
	 * 图集-Pics
	 */

	function Mmoc(){}
	function Zoom(){}
	function Mask(){}
	function Pics(){}

	/**
	 *
	 * 主工具
	 */ 

	var ZoomLens = function(ops){

		// 若缺少关键属性'el' or 'paths', 则程序终止执行
		if( !(ops && 'el' in ops && 'paths' in ops)){
			throw new Error('Missing the necessary parameters "el" or "paths".');
		}


		return new ZoomLens.Fn.Init(ops);
	}

	ZoomLens.Fn = ZoomLens.prototype;

	ZoomLens.Fn.version = VERSION;

	ZoomLens.Fn.extend  = function(o){

		for(var k in o) this[k] = o[k];
	}

	// 相当于Es6 下的Object.create
	ZoomLens.Fn.sProto = function(){
		function F(){};F.prototype = ZoomLens.Fn;
		return new F;
	}

	function forEach(data,callback,thisArg){
		var dataType = Object.prototype.toString.call(data);

		if('[object Object]' == dataType){
			for(var key in data){
				callback.call(thisArg,data[key],key);
			}
		}

		if('[object Array]' == dataType){
			for(var idx=0;idx<data.length;idx++){
				callback.call(thisArg,data[idx],idx);
			}
		}
	}

	forEach(MZMCLASSNAME,function(Func,name){
		Func.Fn = Func.prototype = ZoomLens.Fn.sProto();

		Func.Fn.extend = function(o){
			for(var key in o){
				this[key] = o[key];
			}
		}

		Func.Fn.constructor = Func;

		// 存储元素类名
		Func.Fn.name = name;
	})

	/***********************************************************/
	/**
	 * ??
	 *
	 */ 
	function clone(obj){
		var key,temp = {}

		for(key in obj){
			temp[key] = obj[key];
		}

		return temp;
	}

	function suspend(fn,sec){
		var fn = fn, sec = sec || 1;
		(function(fn,sec){ setTimeout(fn,sec) })(fn,sec);
	}

	function waitFor(fn,sec){
		var fn = fn, sec = sec || 1;

		(function(fn,sec){

			var sign,timer = setInterval(function(){

				if( fn(timer) ) sign = true,clearInterval(timer);

			},sec)

			// 超时三十秒关闭定时器
			suspend(function(){
				if(!sign){
					console.warn(timer,':: run suspend!')
					clearInterval(timer)
				}
			},30000)

		})(fn,sec);
	}

	function addEvent(target,type,fn){
		// 高版本浏览器
		if(!!target.addEventListener){
			target.addEventListener(type,fn);
		}

		// 兼容IE浏览器
		else if(!!target.attachEvent){
			target.attachEvent('on'+type,fn);
		}
	}

	function removeEvent(target,type,fn){
		// 高版本浏览器
		if(!!target.addEventListener){
			target.removeEventListener(type,fn);
		}

		// 兼容IE浏览器
		else if(!!target.attachEvent){
			target.detachEvent('on'+type,fn);
		}
	}

	function getElement(target){
		if(/^\[object HTML.+Element\]$/.test(Object.prototype.toString.call(target))){ return target }

		if(target.charAt(0) == '#'){
			return document.getElementById(target.slice(1));
		}
	}

	function getZoomScale(value){
		// 检查用户给定的值是否符合要求
		return value > 1 ? 1 : value < 0 ? 0 : value;
	}

	function getPicsSpeed(value){
		// 检查用户给定的值是否符合要求
		return value > 1 ? 1 : value < 0 ? 0 : value;
	}

	function getAdsorbSpeed(value){
		// 检查用户给定的值是否符合要求
		return value > 1 ? 1 : value < 0 ? 0 : value;
	}

	function getCursorPos(){
		/**
		 * 
		 * 获取当前鼠标在页面中的坐标值
		 */ 

		if(!!event.pageX){

			return {

				// 支持event.page
				pageX: event.pageX,
				pageY: event.pageY
			}
		}

		return {

			// 不支持event.page
			pageX: event.clientX +
			document.body.scrollLeft +
			document.documentElement.scrollLeft,

			pageY: event.clientY +
			document.body.scrollTop +
			document.documentElement.scrollTop
		}
	}

	function setCursorStyle(elemStyle,type){

		if(elemStyle.cursor != type) elemStyle.cursor = type;
	}

	function bindDragEvent(target,downFunc,moveFunc,removeFunc){
		/**
		 *
		 * 给指定元素绑定鼠标拖动事件
		 */

		var pack = {};	// 存放临时数据

		function move(){

			// 鼠标被移动
			moveFunc(pack);
		}

		function remove(){

			// 鼠标被抬起
			removeFunc(pack);

			// 移除鼠标移动事件
			// 移除鼠标抬起事件
			removeEvent(document,'mousemove',move);
			removeEvent(document,'mouseup',remove);
		}

		function mousedown(){

			// 鼠标被按下
			downFunc(pack);

			// 绑定鼠标移动事件
			// 绑定鼠标抬起事件
			addEvent(document,'mousemove',move);
			addEvent(document,'mouseup',remove);
		}

		addEvent(target,'mousedown',mousedown)
	}

	function removeSelected(){
		/**
		 *
		 * 取消页面中当前所有被选中的元素
		 */ 
		try{

			// 兼容IE 浏览器
			!!document.selection && document.selection.empty();

			// 兼容高版本浏览器
			!!window.getSelection && window.getSelection().removeAllRanges();
		}catch(e){}
	}

	function showOrHideElem(elemStyle,type){
		/**
		 *
		 * 切换元素的显示状态
		 */ 

		type = !type ? 'none' : 'block';
		if(elemStyle.display != type){ elemStyle.display = type};
	}

	function setBgTransparency(elemStyle,scale){
		/**
		 *
		 * 为指定元素设置透明背景
		 */

		elemStyle.filter = 'alpha(opacity='+scale*100+')' // 兼容IE浏览器
		elemStyle.opacity = scale;
	}

	function nodeFormat(tagName,props,children){

		return { tagName:tagName,props:props,children:children }
	}

	/***********************************************************/
	/**
	 *  功能集合
	 *
	 */ 

	ZoomLens.Fn.extend({
		toCss: function(obj){
			/**
			 *
			 * 该方法将对象转换成浏览器可识别的Css 样式字符串
			 */ 
			var tempStr = '',

			// 需要添加'px'后缀的元素
			regExps = /^top$|^left$|^width$|^height$|^padding$|^margin$/;


			forEach(obj,function(value,key){

				if(regExps.test(key)){
					value = value.toString();

					// 符合规则为其添加'px' 后缀
					value = value[value.length-1] != '%' ? value+'px' : value;
				}

				// 将键值对拼接成新的字符串
				tempStr += key+':'+value+';'
			})

			return tempStr;
		},

		finder: function(target){
			if(!!this.name){ return this.great.subsets[target];
			}else{ return this.subsets[target] }
		},

		setSize: function(width,height){

			this.getSize(function(width,height,element){
				element.style.width = width;
				element.style.height = height;
			})
		},
		setAttrs: function(elem,data){
			forEach(data,function(value,key){
				switch(key){

					// 设置类名
					case 'cls':
					elem.className = value; break;

					// 设置样式
					case 'style':
					elem.style.cssText = this.toCss(value); break;

					// 设置其它属性
					default: elem.setAttribute(key,value);
				}
			},this)
		},
		saveNode: function(node){
			this.great.element.children.push(node);
			this.element = node;
		},

		setImgSize: function(idx){
			this.getImgSize(idx,function(width,height,element){
				element.style.width  = width;
				element.style.height = height;
			})
		},
		setImgSeat: function(idx){
			this.getImgSeat(idx,function(offsetX,offsetY,element){
				element.style.top  = offsetY;
				element.style.left = offsetX;
			})
		},
		setLocation: function(){
			// 获取其在页面上的偏移位
			this.getLocation(function(offsetX,offsetY,element){
				element.style.top = offsetY;
				element.style.left = offsetX;
			})
		},

		updateElems: function(node,boxs){
			/**
			 *
			 * 该方法用来创建HTML元素，
			 * 将虚拟DOM中的节点生成为浏览器可识别的HTML元素
			 */ 

			node = node || this.element;
			var elem = document.createElement(node.tagName);


			// 设置元素属性
			this.setAttrs(elem,node.props);

			// 如果包含子节点
			if('children' in node){

				/**
				 * 循环遍历子节点; 执行递归操作，创建新的元素
				 */
				forEach(node.children,function(children){
					this.updateElems(children,elem)
				},this)
			}

			// 将创建好的HTML元素添加到上级节点中
			if(!!boxs) boxs.appendChild(elem);

			node.tag = elem; // 将已创建好的HTML元素存储到虚拟DOM中
		},



		getImgPaths: function(){
			var paths = this.datum.paths;
			switch(this.name){
				case 'mmoc':
				case 'pics': return 'min' in paths ? paths.min : paths;
				case 'zoom': return 'max' in paths ? paths.max : paths;
			}
		},
		getLocation: function(callback){

			var data = this.calcLocation(),

			// 将得到的偏移数存放于节点中
			elementNode = this.element.data = {};
			elementNode.offsetX = data.offsetX;
			elementNode.offsetY = data.offsetY;

			callback(data.offsetX,data.offsetY,this)
		},
		getCurrImgNode: function(){
			var imgIndex = this.finder('pics').element.data.imgChecked || 0;

			// 得到'mmoc' or 'zoom' 下当前显示的图片
			return this.finder(this.name).element.children[imgIndex];
		},

		calcLocation: function(){
			var 
			tmW = 0,
			tmH = 0,

			key = this.name+'Seat',
			seat = this.datum[key],

			offsetY = this.style.top,
			offsetX = this.style.left,

			mmocData = this.finder('mmoc').getData();

			if(!!seat){

				switch(seat){
					case 'top': tmH = -this.style.height,offsetY = -offsetY; break;
					case 'left': tmW = -this.style.width,offsetX = -offsetX; break;
					case 'right': tmW = mmocData.maxWidth; break;
					case 'bottom': tmH = mmocData.maxHeight; break;
				}

				offsetX = offsetX + mmocData.offsetX + tmW;
				offsetY = offsetY + mmocData.offsetY + tmH;
			}

			return {
				offsetX : offsetX,
				offsetY : offsetY
			}
		},

		upStyles: function(name,data){
			/**
			 *
			 * 更新子类工具中的样式值
			 */

			forEach(data,function(value,key){
				this.finder(name).style[key] = value;
			},this)
		},
		upSetting: function(data){
			/**
			 *
			 * 更新实例中的配置值
			 */

			forEach(data,function(value,key){
				this.setting[key] = value;
			},this)
		},
		upConfIntoSetting: function(){
			/**
			 *
			 * 将系统中的默认配置更新
			 * 到子工具类实例对象中
			 */

			// 将默认配置添加到实例中	
			this.upSetting(CONFIGURATION.config)

			// 将通用样式更新到子集中
			forEach(this.subsets,function(subset){
				subset.style = clone(STYLETEXTELS);
			})

			// 将默认样式更新到子集中
			forEach(CONFIGURATION.styles,function(value,key){
				this.upStyles(key,value);
			},this)
		},
		upUserIntoSetting: function(ops){

			// 因为upSetting Func 接收的是一个对象
			// 所以先将用户的配置值转存到tempData临时对象中
			var tempData = {};

			forEach(ops,function(value,key){

				// 除了'styles' 外，其它的'key value'匀视为用户配置值
				if(key != 'styles'){

					if(key == 'el'){ ops[key] = getElement(value) }
					if(key == 'zoomScale'){ ops[key] = getZoomScale(value) }
					if(key == 'picsSpeed'){ ops[key] = getPicsSpeed(value) }
					if(key == 'adsorbSpeed'){ ops[key] = getAdsorbSpeed(value) }

					tempData[key] = ops[key];
				}else{

					// 将默认样式更新到子集中
					forEach(ops.styles,function(value,key){
						this.upStyles(key,value);
					},this)

				}
			},this)

			// 更新用户配置值到实例对象中
			this.upSetting(tempData)
		}
	})

	/***********************************************************/
	/**
	 * ??
	 *
	 */ 

	Mmoc.Fn.extend({ 
		getData: function(){
			var
			mmocStyle = this.style,
			mmocBorder = this.getBorder(),
			mmocPadding = this.getPadding();

			return {

				offsetY   : mmocStyle.top,
				offsetX   : mmocStyle.left,

				// 含边框和间距
				maxWidth  : mmocStyle.width  + (mmocBorder+mmocPadding)*2,
				maxHeight : mmocStyle.height + (mmocBorder+mmocPadding)*2
			}
		},
		getBorder: function(){

			return +(this.style.border+'').match(/\d+/)[0];
		},
		getOffset: function(){
			var mmocElem = this.element.tag;
			return {
				offsetY: mmocElem.offsetTop,
				offsetX: mmocElem.offsetLeft
			}
		},
		getPadding: function(){

			return this.style.padding;
		},
		getImgSize: function(idx,callback){
			var 
			mmoc = this,
			mmocWidth  = this.style.width,
			mmocHeight = this.style.height,
			mmocImgNode = this.element.children[idx],

			// 防止IE下 图片状态为display: none 时
			// 获取不到其宽高值，故，建一 Image 对象用其替之
			imgElem = new Image;

			// 设置图片路径
			imgElem.src = this.getImgPaths()[idx];

			waitFor(function(){

				var 
				imgWidth  = imgElem.width,
				imgHeight = imgElem.height;

				if(!!imgWidth && !!imgHeight && !!mmocImgNode.tag){

					// 计算img元素大小，保证其不超出'mmoc' 可见区域
					var percent = mmocWidth / imgWidth;

					if(imgHeight * percent > mmocHeight){

						// 进行第一轮计算后，图片的高还是超出'mmoc' 区域
						// 则用img元素的高作为基点再次进行计算，严格保证img元素宽高不超出'mmoc'的可见区域
						percent = mmocHeight / imgHeight;
					}

					imgWidth  = percent * imgWidth;
					imgHeight = percent * imgHeight;

					// 将计算后得到的最终宽高存储到节点中
					var mmocImgNodeData = mmocImgNode.data = {};
					mmocImgNodeData.width = imgWidth;
					mmocImgNodeData.height = imgHeight;

					callback(imgWidth+'px',imgHeight+'px',mmocImgNode.tag)
					return true;
				}
			})
		},
		getImgSeat: function(idx,callback){
			/**
			 *
			 * 该方法用于 将'mmoc' 下的图片设置居中显示
			 */

			var 
			mmoc = this,
			mmocData = this.getData();

			waitFor(function(){

				var mmocImgNode = mmoc.element.children[idx];

				if(!!mmocImgNode.data && 
					!!mmocImgNode.data.width && 
					!!mmocImgNode.data.height){

					var 

					// 'mmoc'下图片的偏移数 = ('mmoc'的最大宽高 减 'mmoc'下图片的宽高) 除 2 减 'mmoc'的边框大小
					offsetX = (mmocData.maxWidth  - mmocImgNode.data.width)  / 2 - mmoc.getBorder(),
					offsetY = (mmocData.maxHeight - mmocImgNode.data.height) / 2 - mmoc.getBorder();

					// 将计算后得到的偏移数存储到其节点中
					mmocImgNode.data.offsetX = offsetX;
					mmocImgNode.data.offsetY = offsetY;

					callback(
						offsetX+'px', offsetY+'px',
						mmocImgNode.tag
					)

					return true;
				}
			})
		}
	})

	Zoom.Fn.extend({
		getSize: function(callback){
			var 
			zoom = this,
			zoomNode = this.element;

			if(this.datum.zoomType == 'inside'){

				waitFor(function(){

					var 
					zoomElem = zoom.element.tag,
					mmocCurrImgNode = zoom.finder('mmoc').getCurrImgNode();

					if(!!zoomElem && !!mmocCurrImgNode.data){

						var
						width = mmocCurrImgNode.data.width,
						height = mmocCurrImgNode.data.height;

						zoomNode.data.width  = width;
						zoomNode.data.height = height;

						callback(width+'px',height+'px',zoomElem);

						return true;
					}
				})
			}
		},
		upImgSeat: function(){
			
			// 得到'zoom'下当前显示的图片
			var zoomCurrImgNode = this.getCurrImgNode();

			// 重置'zoom'下当前显示的图片其位置
			this.setImgSeat(this.finder('pics').element.data.imgChecked)
		},
		upLocation: function(){

			var 
			zoom = this,
			mmoc = this.finder('mmoc');

			if(this.datum.zoomType == 'inside'){

				waitFor(function(){

					var
					mmocBorder = mmoc.getBorder(),
					mmocOffset = mmoc.getOffset(),
					zoomElemData = zoom.element.data,
					mmocCurrImgNode = mmoc.getCurrImgNode();

					if(!!zoomElemData && mmocCurrImgNode.data){

						var
						offsetX = mmocCurrImgNode.data.offsetX + mmocOffset.offsetX + mmocBorder,
						offsetY = mmocCurrImgNode.data.offsetY + mmocOffset.offsetY + mmocBorder;

						// 重置'zoom'的偏移位
						zoom.element.tag.style.top  = offsetY +'px';
						zoom.element.tag.style.left = offsetX +'px';

						// 将新得到的偏移位存储到其节点中
						zoomElemData.offsetX = offsetX;
						zoomElemData.offsetY = offsetY;

						return true;
					}
				})
			}
		},
		getImgSize: function(idx,callback){

			var 
			zoom = this,mask = this.finder('mask'),
			zoomImgNode = this.element.children[idx],
			mmocImgNode = this.finder('mmoc').element.children[idx];

			waitFor(function(){

				if(!!mmocImgNode.data && 
					!!mmocImgNode.data.width && 
					!!mmocImgNode.data.height && !!zoomImgNode.tag){

					var 
					zoomWidth  = zoom.element.data.width  || zoom.style.width,
					zoomHeight = zoom.element.data.height || zoom.style.height,

					maskWidth  = mask.element.data.width  || mask.style.width,
					maskHeight = mask.element.data.height || mask.style.height,

			 		// 'zoom' 下的图片尺寸 = 'zoom'的宽高 / ('mask'的宽高 / 'mmoc'下图片的大小)
					zoomImgWidth  = zoomWidth  / (maskWidth  / mmocImgNode.data.width),
					zoomImgHeight = zoomHeight / (maskHeight / mmocImgNode.data.height);

					// 将计算后得到的宽高值存储到其节点中
					var zoomImgNodeData = zoomImgNode.data = {};
					zoomImgNode.data.width = zoomImgWidth;
					zoomImgNode.data.height = zoomImgHeight;

					callback(zoomImgWidth+'px',zoomImgHeight+'px',zoomImgNode.tag)
					return true;
				}
			})
		},
		getImgSeat: function(idx,callback){
			// 'zoom' 下的图片偏移数 = 'mask'在'mmoc'图片中的偏移数 / 'mmoc'图片的宽高 * 'zoom'图片的宽高

			var 
			zoom = this,
			mmoc = this.finder('mmoc'),
			mask = this.finder('mask'),

			mmocImgNode = mmoc.element.children[idx],
			zoomImgNode = zoom.element.children[idx],
			maskNodeData = mask.element.data;

			function calcImgSeat(){

				var mmocImgNodeData = mmocImgNode.data,

				// 'mask'在'mmoc'的图片中移动距离 (百分比)
				percentX = (maskNodeData.offsetX - mmocImgNodeData.minEdgeX) / mmocImgNodeData.width,
				percentY = (maskNodeData.offsetY - mmocImgNodeData.minEdgeY) / mmocImgNodeData.height;

				return {
					offsetX: -percentX * zoomImgNode.data.width,
					offsetY: -percentY * zoomImgNode.data.height
				}
			}

			function isCanCalcImgSeat(){

				if(!!maskNodeData && 
					!!mmocImgNode.data &&
					!!zoomImgNode.data &&
					!!maskNodeData.offsetX &&
					!!maskNodeData.offsetY &&
					typeof mmocImgNode.data.minEdgeX != 'undefined' &&
					typeof mmocImgNode.data.minEdgeY != 'undefined'
				){ return true }else{ return false }

			}

			if( isCanCalcImgSeat() ){
				var data = calcImgSeat();

				// 将'zoom'图片的偏移位存储到其节点中
				zoomImgNode.data.offsetX = data.offsetX;
				zoomImgNode.data.offsetY = data.offsetY;

				callback(data.offsetX +'px',data.offsetY +'px',zoomImgNode.tag )
			}else{
				// 获取'mask'的最小可移动边界
				mask.getMoveableArea(idx);

				// 计算'mask'在'mmoc'图片中的偏移数
				waitFor(function(){

					// 得到'mask'节点下'data'的最新值
					maskNodeData = mask.element.data;

					if( isCanCalcImgSeat() ){

						var data = calcImgSeat();

						// 将'zoom'图片的偏移位存储到其节点中
						zoomImgNode.data.offsetX = data.offsetX;
						zoomImgNode.data.offsetY = data.offsetY;

						callback(data.offsetX +'px',data.offsetY +'px',zoomImgNode.tag )

						return true;
					}

				})
			}
		}
	})

	Mask.Fn.extend({
		move: function(){
			var 
			mask = this,
			zoom = this.finder('zoom'),
			maskElemStyle = this.element.tag.style,
			zoomElemStyle = zoom.element.tag.style;

			// 隐藏'mask'元素
			// 隐藏'zoom'元素
			showOrHideElem(maskElemStyle,0);
			showOrHideElem(zoomElemStyle,0);

			addEvent(document,'mousemove',function(){

				// 检测光标是否悬停在'mmoc'下的图片上
				if(mask.isCanMove()){

					// 更新'mask'位置
					mask.upLocation();

					// 更新大图的位置
					zoom.upImgSeat();

					// 取消被选元素
					removeSelected();

					if(mask.datum.zoomType != 'inside'){

						// 显示'mask' 和 'zoom'元素
						showOrHideElem(maskElemStyle,1);
						showOrHideElem(zoomElemStyle,1);
					}else{
						showOrHideElem(zoomElemStyle,1);
						setCursorStyle(zoomElemStyle,'crosshair');
					}

					// 设置光标样式
					setCursorStyle(maskElemStyle,'crosshair');
				}else{

					// 隐藏'mask' 和 'zoom'元素
					showOrHideElem(maskElemStyle,0);
					showOrHideElem(zoomElemStyle,0);
				}
			})
		},
		drag: function(){
			var 
			mask = this,
			zoom = this.finder('zoom'),
			maskElemStyle = this.element.tag.style;

			// 设置光标样式
			setCursorStyle(maskElemStyle,'pointer');

			bindDragEvent(this.element.tag,
			function(){ // 鼠标按下

				// 记录当前按下鼠标时的坐标点
				mask.element.data.lastCoordX = event.offsetX;
				mask.element.data.lastCoordY = event.offsetY;

				// 设置光标样式
				setCursorStyle(maskElemStyle,'move');

			},function(){ // 鼠标移动

				// 更新'mask'位置
				mask.upLocation();

				// 更新大图的位置
				zoom.upImgSeat();

				// 取消被选元素
				removeSelected();

			},function(){ // 鼠标抬起

				// 还原光标样式
				setCursorStyle(maskElemStyle,'pointer');
			})
		},
		getSize: function(callback){
			var
			mask = this,
			mmoc = this.finder('mmoc'),
			zoomScale = this.datum.zoomScale,
			mmocCurrImgNode = mmoc.getCurrImgNode();

			waitFor(function(){
				if(!!mmocCurrImgNode.data){

					var
					maskWidth  = mmocCurrImgNode.data.width  / (zoomScale*10),
					maskHeight = mmocCurrImgNode.data.height / (zoomScale*10);

					// 将新得到的尺寸存储到其节点中
					mask.element.data.width  = maskWidth;
					mask.element.data.height = maskHeight;

					callback(maskWidth+'px',maskHeight+'px',mask.element.tag)
				}

				return true;
			})

		},
		isCanMove: function(){
			var 
			mouse = getCursorPos(),
			imgIndex = this.finder('pics').element.data.imgChecked,

			// 得到'mmoc'下当前显示的图片
			mmocCurrImgNode = this.finder('mmoc').element.children[imgIndex];

			if(
				!!mmocCurrImgNode.data &&
				mouse.pageX >= mmocCurrImgNode.data.minEdgeX &&
				mouse.pageY >= mmocCurrImgNode.data.minEdgeY &&
				mouse.pageX <= mmocCurrImgNode.data.maxEdgeX &&
				mouse.pageY <= mmocCurrImgNode.data.maxEdgeY 
			){ return true }else{ return false }
		},
		upLocation: function(){
			var 

			mouse = getCursorPos(),

			maskWt = this.element.data.width,
			maskHt = this.element.data.height,

			// 得到'mmoc'下当前显示的图片
			mmocCurrImgNodeData = this.finder('mmoc').getCurrImgNode().data;

			if(this.datum.zoomType == 'drag'){
				var 

				// 将鼠标点位到事件发生地
				offsetX = mouse.pageX - this.element.data.lastCoordX,
				offsetY = mouse.pageY - this.element.data.lastCoordY;
			}else{

				var 

				// 将鼠标定位到'mask'中部
				offsetX = mouse.pageX - maskWt/2,
				offsetY = mouse.pageY - maskHt/2;
			}


			// 超出最小边界，取最小边界
			offsetX = offsetX < mmocCurrImgNodeData.minEdgeX ? mmocCurrImgNodeData.minEdgeX : offsetX;
			offsetY = offsetY < mmocCurrImgNodeData.minEdgeY ? mmocCurrImgNodeData.minEdgeY : offsetY;

			// 超出最大边界，取最大边界
			offsetX = offsetX > mmocCurrImgNodeData.maxEdgeX - maskWt ? mmocCurrImgNodeData.maxEdgeX - maskWt : offsetX;
			offsetY = offsetY > mmocCurrImgNodeData.maxEdgeY - maskHt ? mmocCurrImgNodeData.maxEdgeY - maskHt : offsetY;

			// 将得到的偏移位更新到其节点中
			this.element.data.offsetX = offsetX;
			this.element.data.offsetY = offsetY;

			// 重置'mask'的位置
			this.setLocation();
		},
		getLocation: function(callback){
			var  data = this.getCenterAlign();

			if(!!this.element.data &&
				typeof this.element.data.offsetX != 'undefined' &&
				typeof this.element.data.offsetY != 'undefined'
			){

				callback(

					// 'mask' 移动事件执行的回调
					this.element.data.offsetX +'px',
					this.element.data.offsetY +'px',
					this.element.tag
				)

			}else{

				// 将'mask'的偏移数存储到其节点中
				var maskNodeData = this.element.data;
				maskNodeData.offsetX = data.offsetX;
				maskNodeData.offsetY = data.offsetY;

				// 'mask' 第一次定位执行的回调
				callback(data.offsetX,data.offsetY,this)
			}

		},
		getLoopData: function(){
			var

			gap = this.datum.dotGap,

			// 长宽比
			sizeX = this.datum.dotSize[0],
			sizeY = this.datum.dotSize[1],

			// 循环数
			loopX = (this.style.width  / (gap+sizeX)).toFixed(),
			loopY = (this.style.height / (gap+sizeX)).toFixed(),

			// 偏移步长
			stepX = sizeX+(this.style.width-loopX*sizeX) /(loopX-1),
			stepY = sizeY+(this.style.height-loopY*sizeY) /(loopY-1);

			return {
				loopX: loopX,loopY: loopY,
				sizeX: sizeX,sizeY: sizeY,
				stepX: stepX,stepY: stepY
			}
		},
		getDrawTool: function(){
			var ctx = this.element.tag.getContext('2d');

			//设置canvas 的宽高
			ctx.canvas.width  = this.style.width;
			ctx.canvas.height = this.style.height;

			// 设置点的颜色
			ctx.fillStyle = this.datum.dotColor;

			return ctx
		},
		drawingStyle: function(type,ctx){

			var 
			i,j,
			html = '',
			data = this.getLoopData();

			for(i=0;i<data.loopX;i++){
				for(j=0;j<data.loopY;j++){

					if(type == 'can'){

						ctx.fillRect(i*data.stepX,j*data.stepY,data.sizeX,data.sizeY)

					}else{
						var spanElem = document.createElement('span'),
						spanElemStyle = spanElem.style;

						// 给span 标签添加默认样式
						spanElemStyle.cssText = this.toCss(STYLETEXTELS);

						spanElemStyle.top     = j*data.stepY;
						spanElemStyle.left    = i*data.stepX;
						spanElemStyle.width   = data.sizeX +'px';
						spanElemStyle.height  = data.sizeY +'px';
						spanElemStyle.background = this.datum.dotColor;
						spanElemStyle.overflow = 'hidden';	// 防止低版本IE浏览器低像素像素溢出

						html += spanElem.outerHTML;
					}

				}
			}

			if(type == 'div'){
				this.element.tag.innerHTML = html;
				this.element.tag.appendChild(this.element.children[0].tag);
			}
		},
		setCenterAlign: function(){
			var 
			data = this.getCenterAlign(),
			maskElemStyle = this.element.tag.style;

			maskElemStyle.top  = data.offsetY +'px';
			maskElemStyle.left = data.offsetX +'px';

			// 给其节点记录当前偏移位
			this.element.data.offsetX = data.offsetX;
			this.element.data.offsetY = data.offsetY;
		},
		getCenterAlign: function(){
			var mmocData = this.finder('mmoc').getData();

			return {
				offsetX: mmocData.offsetX + mmocData.maxWidth  /2 - this.style.width/2,
				offsetY: mmocData.offsetY + mmocData.maxHeight /2 - this.style.height/2
			}
		},
		getMoveableArea: function(idx){

			var
			mask = this,
			mmoc = this.finder('mmoc'),
			imgNode  = mmoc.element.children[idx],

			// 最小边界
			minEdgeY = mmoc.style.top  + mmoc.getBorder(),
			minEdgeX = mmoc.style.left + mmoc.getBorder();

			waitFor(function(){

				if(!!imgNode.data && 
					typeof imgNode.data.offsetX != 'undefined' &&
					typeof imgNode.data.offsetY != 'undefined'){

					minEdgeX = minEdgeX + imgNode.data.offsetX;
					minEdgeY = minEdgeY + imgNode.data.offsetY;

					// 将'mask'在每张图片中的可移动边界值存储到其对应的'mmoc'下的图片节点中
					imgNode.data.minEdgeX = minEdgeX;
					imgNode.data.minEdgeY = minEdgeY;
					imgNode.data.maxEdgeX = minEdgeX + imgNode.data.width;
					imgNode.data.maxEdgeY = minEdgeY + imgNode.data.height;

					return true;
				}
			})
		}
	})

	Pics.Fn.extend({
		drag: function(){

			var pics = this,

			// 用于放置图片的ul 元素
			ulElem = this.element.children[0].tag,
			spanElem = this.element.children[1].tag;

			// 设置光标样式
			spanElem.style.cursor = 'pointer';

			function jumperSwitch(pack){
				/**
				 *
				 * 指定ul元素需要改变的方位及偏移数
				 */ 

				if(/^left$|^right$/.test(pics.datum.picsSeat)){ 
					pack.changer = ['top','differentY'];
				}else{ 
					pack.changer = ['left','differentX'];
				}
			}

			function updateUlElemOffset(pack){

				var 
				minus  = pack[pack.changer[1]],

				// 获取目前ul元素的遍移位
				offset = parseFloat(ulElem.style[pack.changer[0]]);

				// 当ul 元素超出指定范围后限制其可移动的最大距离
				if(offset > 0 || offset < pics.getData().minEdge){
					pack[pack.changer[1]] = 0; minus *= 0.1;
				}

				// 设置ul 元素的偏移值
				ulElem.style[pack.changer[0]] = offset + minus + 'px';
			}

			function resetUlElemOffset(type,offset){
				/**	
				 *
				 * 当ul元素超出边界后，执行ul的复位操作
				 */

				// 开启一个定时器，执行缓动效果
				waitFor(function(){

					offset *= 0.5;

					ulElem.style[type] = 
					parseFloat(ulElem.style[type]) - offset.toFixed() +'px';

					if(Math.abs(offset) < 0.5) return true;
				},pics.datum.adsorbSpeed*100)
			}

			bindDragEvent(this.element.tag,
				function(pack){ // 鼠标按下

					// 设置光标样式
					spanElem.style.cursor = 'move';

					// 获取第一次鼠标点击的坐标值
					var mouseCoord  = getCursorPos();
					pack.lastCoordX = mouseCoord.pageX;
					pack.lastCoordY = mouseCoord.pageY;

					// 存储当前需要改变的坐标
					jumperSwitch(pack);

				},function(pack){ // 鼠标移动

					// 获取当前点的鼠标坐标值
					var mouseCoord  = getCursorPos();

					// 计算前后两点的鼠标差值
					pack.differentX = mouseCoord.pageX - pack.lastCoordX;
					pack.differentY = mouseCoord.pageY - pack.lastCoordY;

					// 更新前一个点的鼠标坐标
					pack.lastCoordX = mouseCoord.pageX;
					pack.lastCoordY = mouseCoord.pageY;

					// 更新ul在页面上的偏移位
					updateUlElemOffset(pack);

					// 取消被选中元素
					removeSelected();

				},function(pack){ // 鼠标抬起

					// 设置光标样式
					spanElem.style.cursor = 'pointer';

					// 鼠标抬起后开启定时器，设置ul元素缓动效果
					waitFor(function(){

						pack.differentX *= 0.9;
						pack.differentY *= 0.9

						var changer = pack.changer;

						if(Math.abs(pack[changer[1]]) < 1.2){
							/**
							 * 当缓动结束后执行'边界检测'
							 */

							// 得到ul 可移动的最小边界
							var minEdge = pics.getData().minEdge,

							// 得到当前ul 在页面中的偏移数
							ulOffset = parseFloat(ulElem.style[changer[0]]);
							
							// 如果当前ul 超出指定范围则重置ul的偏移位
							ulOffset < minEdge && resetUlElemOffset(changer[0],ulOffset - minEdge);
							ulOffset > 0 && resetUlElemOffset(changer[0],ulOffset);

							return true;
						}


						// 更新ul在页面上的偏移位
						updateUlElemOffset(pack);

					},pics.datum.picsSpeed*100)
				});
		},
		hover: function(){
			var 
			pics = this,
			zoom = this.finder('zoom'),
			mask = this.finder('mask'),
			zoomImgs = zoom.element.children,
			mmocImgs = this.finder('mmoc').element.children;

			zoom.datum.zoomType == 'inside' && zoom.setSize(),zoom.upLocation();

			// 记录当前被选中图片的下标
			pics.element.data.imgChecked = 0;

			// 'pics' 下的图片被hover 得到当前图片的下标
			this.imgHover(function(currentIdx,lastIdx){

				// 取消被选元素
				removeSelected();

				// 设置当前被选中图片的边框
				pics.setImgBorder(currentIdx,lastIdx);

				// 记录当前被选中图片的下标
				pics.element.data.imgChecked = currentIdx;

				/**
				 * 兼容IE浏览器:
				 * 防止'zoom'元素为display: none 时
				 * 'zoom'下的图片元素无法进行正常切换
				 */
				showOrHideElem(zoom.element.tag.style,1)

				// 切换'mmoc' 和 'zoom' 中的图片
				mmocImgs[lastIdx].tag.style.display = 'none';
				zoomImgs[lastIdx].tag.style.display = 'none';
				mmocImgs[currentIdx].tag.style.display = 'block';
				zoomImgs[currentIdx].tag.style.display = 'block';

				if(zoom.datum.zoomType == 'inside'){

					zoom.setSize();
					mask.setSize();
					zoom.upLocation();
					zoom.setImgSize(currentIdx);
				}

				// 将'mask' 设置为居中显示
				mask.setCenterAlign();

				// 更新大图的位置
				zoom.upImgSeat();

			})
		},
		getSize: function(callback){
			var mmocData = this.finder('mmoc').getData();

			if(/^left$|^right$/.test(this.datum.picsSeat)){

				callback(
					this.style.width || 80,
					this.style.height || mmocData.maxHeight,this
				);

			}else{

				callback(
				this.style.width || mmocData.maxWidth,
				this.style.height || 80,this
				);
			}
		},
		getData: function(){
			var 

			// ul 下的图片间隔
			imgGap = this.datum.imgGap,

			// ul 下的图片宽度
			imgWH = this.getPicsMinLength(),

			// ul 下的图片个数
			imgLength = this.element.children[0].children.length,

			// ul 元素最大长度
			ulLength = imgLength * imgWH + imgLength * imgGap - imgGap,

			minEdge = (imgWH+imgGap) * imgLength - this.getPicsMaxLength() - imgGap;

			return {
				minEdge: - minEdge,
				ulLength: ulLength
			}
		},
		imgHover: function(callback){
			var pics = this, lastIdx = 0;

			// 给 'pics'元素绑定鼠标移动事件
			addEvent(this.element.tag,'mousemove',function(){

				// 获取图片下标
				var index = pics.getImgElemIndex();

				// 鼠标悬停在img元素上时只能触发一次imgHover 事件
				// 防止多次触发造成不必要的性能损失
				if(~index && index != lastIdx){
					callback(index,lastIdx);
					lastIdx = index;
				}
			})
		},
		getImgSize: function(idx,callback){

			// 图片的长宽等于'pics' 的最小长度
			var imgWH = this.getPicsMinLength(),

			imgNode = this.element.children[0].children[idx].children[0].children[0];

			callback(imgWH,imgWH,imgNode.props);
		},
		getImgSeat: function(idx,callback){

			var 
			offsetX = 0,
			offsetY = 0,
			imgNode = this.element.children[0].children[idx].children[0].children[0],
			movingStepLength = (this.datum.imgGap + this.getPicsMinLength()) * idx;

			/^left$|^right$/.test(this.datum.picsSeat)
			? offsetY = movingStepLength : offsetX = movingStepLength;

			callback(offsetX,offsetY,imgNode.props);
		},
		setImgBorder: function(currentIdx,lastIdx){

			try{

				var 
				imgWH = this.getPicsMinLength(),
				imgBorder = this.datum.imgBorder,
				ulElemNode = this.element.children[0],
				picsLastImgElem = ulElemNode.children[lastIdx].children[0].children[0].tag,
				picsCurrImgElem = ulElemNode.children[currentIdx].children[0].children[0].tag;

				// 为选中的图片设置边框
				picsLastImgElem.style.border = 0;
				picsCurrImgElem.style.border = imgBorder;

				// 重置图片宽高
				imgBorder = parseFloat(imgBorder);
				picsLastImgElem.style.width  = imgWH +'px';
				picsLastImgElem.style.height = imgWH +'px';
				picsCurrImgElem.style.width  = imgWH - imgBorder*2 +'px';
				picsCurrImgElem.style.height = imgWH - imgBorder*2 +'px';
			}catch(e){}
		},
		getImgElemIndex: function(){

			var type,coord,offset;
			if(/^left$|^right$/.test(this.datum.picsSeat)){
				type = 'top',coord = 'pageY',offset = 'offsetY';
			}else{ type = 'left',coord = 'pageX',offset = 'offsetX'}

			/**
			 *
			 * 求img元素下标:
			 *	
			 * 假设 img宽度: 80; img间隔: 10; 鼠标坐标: 97
			 *		
			 *		坐标 / 宽度 / ((宽度+间隔)/宽度)
			 *		97 / 80 / ((80+10)/80) = 1.0777777777777777
			 *		
			 *		宽度 / （宽度+间隔）+ '取1.07777777...' 整数部分
			 *		80 / (80+10) + 1 = 1.8888888888888888
			 *		
			 *		如果 1.07777777... <= 1.88888888... 
			 *		则'1.07777777...' 的整数部分就是图片下标
			 *		若等式不成立，则表明 当前鼠标停留在间隔段上，返回值应设为 -1
			 */

			// 得到当前ul元素在页面中的偏移位
			var ulElemOffset = parseFloat(this.element.children[0].tag.style[type]),

			imgWH = this.getPicsMinLength(),

			// 得到鼠标在ul元素中的偏移数
			offset = Math.abs(ulElemOffset) + getCursorPos()[coord] - this.element.data[offset],

			// 计算鼠标指针
			result = offset/imgWH/((imgWH+this.datum.imgGap)/imgWH),

			index = parseInt(result);

			// 对index的值进行检验
			// 检测当前鼠标是否停留在图片间隔段上
			if(result > imgWH/(imgWH+this.datum.imgGap) + index){

				// 将index 值设为 -1 , 表明当前鼠标并为悬停在img元素上
				index = -1;
			}

			return index;
		},
		getPicsMinLength: function(){
			/**
			 *
			 * 获取'pics' 的最小长度
			 */ 

			var 
			picsWidth  = this.style.width,
			picsHeight = this.style.height;

			return picsWidth < picsHeight ? picsWidth : picsHeight;
		},
		getPicsMaxLength: function(){
			/**
			 *
			 * 获取'pics' 的最小长度
			 */ 

			var 
			picsWidth  = this.style.width,
			picsHeight = this.style.height;

			return picsWidth > picsHeight ? picsWidth : picsHeight;
		}
	})


	/***********************************************************/
	/**
	 * ??
	 *
	 */ 

	Mmoc.Fn.extend({ 
		computeLayout: function(){ 

			// 隐藏超出的元素
			this.style.overflow = 'hidden';

			var imgNodes = this.element.children;

			forEach(imgNodes,function(imgNode,idx){

				// 设置图片尺寸
				this.setImgSize(idx);

				// 设置图片位置
				this.setImgSeat(idx);

				// 隐藏全部图片
				imgNode.props.style.display = 'none';
			},this)

			// 显示第一张图片
			waitFor(function(){
				if(!!imgNodes[0].tag){
					imgNodes[0].tag.style.display = 'block';
					return true;
				}
			})
		}
	})
	Zoom.Fn.extend({ 
		computeLayout: function(){ 

			// 设置大小
			this.setSize();

			// 设置其位置
			this.setLocation();

			// 隐藏超出的元素
			this.style.overflow = 'hidden';

			var imgNodes = this.element.children;

			forEach(imgNodes,function(imgNode,idx){

				// 设置图片尺寸
				this.setImgSize(idx);

				// 设置图片位置
				this.setImgSeat(idx);

				// 隐藏全部图片
				imgNode.props.style.display = 'none';
			},this)

			// 显示第一张图片
			waitFor(function(){
				if(!!imgNodes[0].tag){
					imgNodes[0].tag.style.display = 'block';
					return true;
				}
			})
		}
	})
	Mask.Fn.extend({
		createElement: function(){

			var 
			mask = this,
			tagName = 'div',
			children = [],
			canvasElem = document.createElement('canvas');

			// 若浏览器支持canvas,则用canvas绘图
			if(typeof canvasElem.getContext == 'function') {tagName = 'canvas'}else{
				children.push(nodeFormat(tagName,{style: clone(STYLETEXTELS)},[]))
			}

			// 将生成的虚拟节点存储到DOM树中	
			this.saveNode(nodeFormat(tagName,{cls: this.name,style: this.style},children))

			if(mask.datum.zoomType != 'inside'){

				waitFor(function(){

					if(!!mask.element.tag){

						// 如果浏览器支持canvas 则使用canvas的方式绘制，否则将使用HTML元素的方式绘制
						if('canvas' == mask.element.tagName){
							mask.drawingStyle('can',mask.getDrawTool());
						}else{
							suspend(function(){
								mask.drawingStyle('div');
							},20)
						}

						return true;
					}
				})
			}
		},
		computeLayout: function(){ 

			// 设置其位置
			this.setLocation();

			var divNode = this.element.children[0];

			if(!!divNode){

				/**
				 *
				 * 兼容低版本IE：
				 * 防止元素在无背景的情况下 mousedown 失效
				 */

				divNode.props.style.width = this.style.width;
				divNode.props.style.height = this.style.height;
				divNode.props.style.background = '#FFF';

				// 设置元素为透明背景
				setBgTransparency(divNode.props.style,0);
			}

			this.element.data.width  = this.style.width;
			this.element.data.height = this.style.height;
		},
		triggerEvents: function(){
			var zoom = this.finder('zoom');

			this.datum.zoomType != 'drag' ? this.move() : this.drag();

			if(this.datum.zoomType == 'inside'){

				zoom.setSize();
				this.setSize();
				zoom.upLocation();
				zoom.setImgSize(0);
			}
		}
	})

	Pics.Fn.extend({ 
		createElement: function(){
			var liElem = [], children = [];

			forEach(this.getImgPaths(),function(path){

				liElem.push(

					// 给ul添加子节点li
					nodeFormat('li',{style: clone(STYLETEXTELS)},[

					// 给li添加子节点 a
					nodeFormat('a',{style: clone(STYLETEXTELS)},[

					// 给a添加子节点 img
					nodeFormat('img',{src:path,style: clone(STYLETEXTELS)},[]) ]) ])
				)
			})

			// 给'pics' 添加ul子节点
			children.push(nodeFormat('ul',{style: clone(STYLETEXTELS)},liElem))

			// 给'pics' 添加span子节点，防止触发img的拖动事件，使'mouseup' 生效
			children.push(nodeFormat('span',{style: clone(STYLETEXTELS)},[]))

			// 将生成的虚拟节点存储到DOM树中	
			this.saveNode(nodeFormat('div',{cls: this.name,style: this.style},children))
		},
		computeLayout: function(){ 

			// 设置其尺寸
			this.setSize();

			// 设置其位置
			this.setLocation();

			// 隐藏超出的元素
			this.style.overflow = 'hidden';


			var
			ulNode = this.element.children[0],
			spanNode = this.element.children[1];

			// 去掉ul 下li元素的项目符号
			ulNode.props.style['list-style'] = 'none';

			/**
			 *
			 * 设置span 元素的样式
			 */ 
			spanNode.props.style.width  = this.style.width;
			spanNode.props.style.height = this.style.height;
			spanNode.props.style.background = 'skyblue';

			// 设置span 元素背景为透明
			setBgTransparency(spanNode.props.style,0);

			// 扁历li节点，设置li下的图片尺寸、位置
			forEach(ulNode.children,function(liNode,idx){

				var imgNode = liNode.children[0].children[0];

				// 隐藏全部图片
				imgNode.props.style.display = 'none';

				// 设置图片尺寸
				this.setImgSize(idx);

				// 设置图片位置
				this.setImgSeat(idx);

				// 显示图片
				waitFor(function(){

					if(!!imgNode.tag){
						imgNode.tag.style.display = 'block';

						return true;
					}

				})
			},this)
		},
		triggerEvents: function(){ 

			var data = this.getData();

			// 只有当图片超出可显示区域才需要绑定图片拖动事件
			data.ulLength > this.getPicsMaxLength() && this.drag();

			// 给'pics' 绑定hover 事件
			this.hover();
		}
	})

	/***********************************************************/
	/**
	 * 主功能
	 *
	 */ 

	ZoomLens.Fn.extend({
		initEeprom: function(ops){

			// 主工具在页面中的HTML 根元素
			this.element = nodeFormat('div',{
				cls:BOXCLASSNAME,
				style: clone(STYLETEXTELS)
			},[])

			forEach(this.subsets,function(subset){

				// 存放其所对应的元素样式表
				subset.style = {};

				// 记录当前创建好的实例对象
				subset.great = this;

				// 将setting关联到子工具中
				subset.datum = this.setting;
			},this)

			// 更新默认值到实例对象中
			this.upConfIntoSetting();

			// 更新用户值到子类工具中
			this.upUserIntoSetting(ops);
		},
		createElement: function(){ 
			/**
			 *
			 * 该方法为子类工具创建其在页面中所对应的虚拟DOM节点
			 */

			if(!!this.name){
				var children = [];

				// 给'mmoc' 和 'zoom' 创建图片
				forEach(this.getImgPaths(),function(path){
					children.push( nodeFormat('img',{src:path,style: clone(STYLETEXTELS)},[]))
				})

				// 将生成的虚拟节点存储到DOM树中	
				this.saveNode(nodeFormat('div',{cls: this.name,style: this.style},children))
			}

			// 创建子类工具中其所对应的虚拟DOM节点
			forEach(this.subsets,function(subset){
				subset.createElement();
			})
		},
		computeLayout: function(){ 

			var datum = this.setting,

			zoomScale = datum.zoomScale,
			maskStyle = this.subsets.mask.style,
			zoomStyle = this.subsets.zoom.style;


			if(datum.correlate){

				if(datum.zoomResize){

					// 'zoom' 的 'w' and 'h' 可调节时
					// 'mask' 的 'w' and 'h' 随 'zoom' 的尺寸改变而改变
					maskStyle.width  = zoomStyle.width  / (zoomScale*10);
					maskStyle.height = zoomStyle.height / (zoomScale*10);
				}else{

					// 'zoom' 的 'w' and 'h' 不可调节时
					// 'zoom' 的 'w' and 'h' 随 'mask' 的尺寸改变而改变
					zoomStyle.width  = maskStyle.width  * (zoomScale*10);
					zoomStyle.height = maskStyle.height * (zoomScale*10);
				}

			}

			// 设置子类工具中的元素样式
			forEach(this.subsets,function(subset){
				subset.element.data = {};
				subset.computeLayout();
			})
		},
		drawingLayout: function(){ 
			// 创建HTML元素
			this.updateElems();

			// 将创建好的HTML元素添加到页面中
			if(!!this.setting.el){ this.setting.el.appendChild(this.element.tag)
			}else{ this.warn('The specified tag element could not be found!') }
		},
		triggerEvents: function(){ 
			forEach(this.subsets,function(subset){
				subset.triggerEvents();
			})
		}
	})

	/***********************************************************/
	/**
	 * 主工具初始化
	 *
	 */ 
	ZoomLens.Fn.Init = function(ops){

		// 配置项
		this.setting = {};

		// 子工具
		this.subsets = {
			mmoc: new Mmoc,
			zoom: new Zoom,
			mask: new Mask,
			pics: new Pics
		};

		// 初始系统数据
		this.initEeprom(ops);

		// 创建HTML节点
		this.createElement();

		// 处理元素样式
		this.computeLayout();

		// 渲染页面布局
		this.drawingLayout();

		// 触发事件行为
		this.triggerEvents();
	}

	// 将ZoomLens 原型关联给Init
	ZoomLens.Fn.Init.prototype = ZoomLens.Fn.sProto();
	ZoomLens.Fn.Init.prototype.constructor = ZoomLens.Fn.Init;

	// 返回主工具
	return ZoomLens;
});