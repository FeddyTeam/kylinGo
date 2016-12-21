var kylin = (function(){
	return {
		// 框架的初始化
		init:function(){
			// ie8兼容
			if(typeof document.addEventListener == "undefined"){
				window.Element.prototype.addEventListener = function(){
					if(typeof arguments[0] == "string"){
						arguments[0] = "on"+arguments[0]
					}
					window.Element.prototype.attachEvent.apply(this,arguments);
				}
				window.JSON = {}
				window.JSON.parse = function(str){
					var json =  eval('(' + str + ')'); 
					console.log(json)
					return json; 
				}
			}
			// 响应式
			this.reactiveJump();
		},
		// 响应式跳转 
		reactiveJump : function(){
			// 判断用户平台
			if(navigator.userAgent.toLowerCase().search(/windows/) != -1){
				var platform = "windows";
			}else if(navigator.userAgent.toLowerCase().search(/macintosh/) != -1){
				var platform = "mac";
			}else if(navigator.userAgent.toLowerCase().search(/iphone/) != -1){
				var platform = "iphone";
			}else if(navigator.userAgent.toLowerCase().search(/ipad/) != -1){
				var platform = "ipad";
			}else if(navigator.userAgent.toLowerCase().search(/android/) != -1){
				var platform = "android";
			}
			// 判断当前用户页面平台
			if(window.location.href.toLowerCase().search(/wap.shadowcreator.com/) != -1){
				var sitePlatform = "wap";
			}else if(window.location.href.toLowerCase().search(/www.shadowcreator.com/) != -1){
				var sitePlatform = "www";
			}else{
				var sitePlatform = "none";
			}

			// 电脑端
			if((platform == "windows" || platform == "mac" || platform == "ipad") && sitePlatform == "wap"){
				window.location.href = window.location.href.replace(/wap.shadowcreator.com/,"www.shadowcreator.com");
			}else if((platform == "iphone" || platform == "android") && sitePlatform == "www"){
				window.location.href = window.location.href.replace(/www.shadowcreator.com/,"wap.shadowcreator.com");
			}
		},
		// dom函数会选择符合条件的第一个标签
		dom:function(dom){
			return document.querySelector(dom)
		},
		// domAll函数会选择符合条件的所有标签
		domAll:function(dom){
			if(!!document.querySelectorAll){
				// 支持querySelectorAll
				return document.querySelectorAll(dom);
			}else{
				if(dom[0] == "."){
					// class
					var domName = dom.substring(1);
					return document.getElementsByClassName(domName);
				}else{
					// 标签
					return document.getElementsByTagName(dom);
				}
			}
		},
		// get方法，其传入数据data需为一个对象，path为要get的地址
		get:function(path,data,success,fail){
			var str = "?"
			for(var index in data){
				str += index + "=" + data[index] + "&";
			}
			str = str.substring(0,str.length-1);
			
			var xhr = new XMLHttpRequest();
			xhr.open('GET', path+str,  true);
			xhr.send(null);
			xhr.onreadystatechange = function(){
			    if(xhr.readyState == 4){
			        /*
			        ** Http状态码
			        ** 1xx ：信息展示
			        ** 2xx ：成功
			        ** 3xx ：重定向
			        ** 4xx : 客户端错误
			        ** 5xx ：服务器端错误
			        */
			        if(xhr.status == 200){
			            success(xhr);
			        } else {
			        	console.log("ajax请求失败")
			            console.log(xhr);
			        }
			    }
			}
		},
		// post方法，其传入数据data需为一个对象，path为要post的地址
		post : function(path,data,success,fail){
			var str = ""
			for(var index in data){
				str += index + "=" + encodeURI(data[index]) + "&";
			}
			str = str.substring(0,str.length-1);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', path,  true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(str);
			xhr.onreadystatechange = function(){
			    if(xhr.readyState == 4){
			        /*
			        ** Http状态码
			        ** 1xx ：信息展示
			        ** 2xx ：成功
			        ** 3xx ：重定向
			        ** 4xx : 客户端错误
			        ** 5xx ：服务器端错误
			        */
			        if(xhr.status == 200){
			        	success(xhr);
			        } else {
			            fail(xhr);
			        }
			    }
			}
		},
		//设定Cookie值
		setCookie:function(c_name,value,expiredays){
			var exdate=new Date()
			exdate.setDate(exdate.getDate()+expiredays)
			document.cookie=c_name+ "=" +escape(value)+
			((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+';path=/';
		},
		getCookie : function(name){
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    		if(arr != null) return unescape(arr[2]); return null;
		},
		//删除cookie
		delCookie :function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=this.getCookie(name);
			if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		},
		// 获取get参数
		getQueryString:function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},
		// 数据统计
		/**
		name:总体访问名，官网/社区
		address：location。href
		action：访问/点击/悬浮
		unit：购买按钮/焦点图/为空则表示就是当前页
		remark：备注（通常为空）
		platform：android/ios/Windows/mac
		*/
		stat : function(name,action,unit,remark){
			if(!name){
				name = "官网";
			}
			if(!action){
				action = "";
			}
			if(!unit){
				unit = "";
			}
			if(!remark){
				remark = "";
			}
			var data = {};
			data.name = name;
			data.action = action;
			data.unit = unit;
			data.remark = remark;
			data.address = window.location.href;
			if(kylin.getCookie("login") == "1"){
				data.ifLogin = true;
			}else{
				data.ifLogin = false;
			}
			// platform
			if(navigator.userAgent.toLowerCase().search(/windows/) != -1){
				data.platform = "windows";
			}else if(navigator.userAgent.toLowerCase().search(/macintosh/) != -1){
				data.platform = "mac";
			}else if(navigator.userAgent.toLowerCase().search(/iphone/) != -1){
				data.platform = "iphone";
			}else if(navigator.userAgent.toLowerCase().search(/ipad/) != -1){
				data.platform = "ipad";
			}else if(navigator.userAgent.toLowerCase().search(/android/) != -1){
				data.platform = "android";
			}
			var path = 'http://www.shadowcreator.com/api/staticHandler.php';
			var str = "?";
			for(var index in data){
				str += index + "=" + data[index] + "&";
			}
			str = str.substring(0,str.length-1);
			
			var statImg = new Image();
			statImg.src = path+str;
		},
	}
})()
// 初始化
kylin.init()
// 统计当前访问
kylin.stat("官网","访问","","");