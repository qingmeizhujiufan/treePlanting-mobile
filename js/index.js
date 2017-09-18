require(
	[
		'zepto',
		'knockout',
		'util',
		'constants',
		'routerurls',
		'director',
		'mui'
	],
	function($, ko, Util, Constants, RouterUrls) {
		var loginProjectUserUrl = Constants.BASEHOST + "loginContext/getProjectUserInfo";
		var loginContextUrl = Constants.MAURL + "maservlet/ssoLogin/checkToken";
		var viewModel = {};

		window.addRouter = function(path, func) {
			var pos = path.indexOf('/:');
			var truePath = path;
			if(pos != -1)
				truePath = path.substring(0, pos);
			func = func || function() {
				var params = arguments;
				initPage('pages' + truePath, params);
			}
			var tmparray = truePath.split("/");
			if(tmparray[1] in router.routes && tmparray[2] in router.routes[tmparray[1]] && tmparray[3] in router.routes[tmparray[1]][tmparray[2]]) {
				return;
			} else {
				router.on(path, func);
				if(pos != -1)
					router.on(truePath, func);
			}
		}

		window.router = Router();

		$(function() {
			initPageRouter();
			window.addEventListener('orientationchange', function(event) {
				if(window.orientation == 180 || window.orientation == 0) {
					alert("请将手机横屏以获取良好的体验，祝您游戏愉快！");
				}
				if(window.orientation == 90 || window.orientation == -90) {
					initPageRouter();
				}
			});
		});

		function initPageRouter() {
			var homeUrl = "/pub/start/start";
			addRouter(homeUrl);
			//加载游戏路由
			if(RouterUrls.gameRouters && RouterUrls.gameRouters.length > 0) {
				for(var i = 0; i < RouterUrls.gameRouters.length; i++) {
					addRouter(RouterUrls.gameRouters[i]);
				}
			}
			//加载公共路由
			if(RouterUrls.pubRouters && RouterUrls.pubRouters.length > 0) {
				for(var i = 0; i < RouterUrls.pubRouters.length; i++) {
					addRouter(RouterUrls.pubRouters[i]);
				}
			}
			var url = window.location.href;
			if((url.indexOf('#') == -1) || (url.indexOf('#') == url.length - 1)) {
				window.router.setRoute(homeUrl);
				sessionStorage.curRouteIndex = 0;
			}

			window.router.init();
		}

		/**	
		 * 获取页面请求地址后面的参数
		 */
		function GetRequest() {
			var url = location.search; //获取url中"?"符后的字串 
			var theRequest = new Object();
			if(url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for(var i = 0; i < strs.length; i++) {
					var eqIndex = strs[i].indexOf("=");
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(eqIndex + 1));
				}
			}
			return theRequest;
		}

		/**	
		 * 处理移动上下文
		 * @param id 地址参数
		 * @param module 页面模块地址
		 */
		function loginContext(id, module) {
			var urlParam = GetRequest();
			initPageBack(id, module);
		}

		/**		
		 * 初始化页面加载完毕回调
		 * @param id 地址参数
		 * @param module 页面模块地址
		 */

		function initPageBack(id, module) {
			ko.cleanNode($('#content')[0]);
			$("#content").html("");
			$('#content').html(module.template);

			if(module.model) {
				ko.applyBindings(module.model, $('#content')[0]);
				module.init(id, viewModel.loginContext);
				/* 注册input的MUI中的相关方法*/
				mui('.mui-input-row input').input();
				objBlurFun('input');
				objBlurFun("textarea"); //IOS焦点失去问题&简单处理IOS输入法下fixed问题（次问题仍然存在，只是简单处理）
				androidGiTest(); //安卓输入法遮挡问题
			} else {
				module.init(id);
			}
		}

		/**		
		 * 适配IOS焦点问题，如果不是当前触摸点不在input、textarea上,那么都失去焦点
		 * @param sDom dom节点类型
		 * @param time 毫秒时间
		 */
		function objBlurFun(sDom, time) {
			var time = time || 300;
			//判断是否为苹果
			var isIPHONE = navigator.userAgent.toUpperCase().indexOf("IPHONE") != -1;
			if(isIPHONE) {
				var obj = document.querySelectorAll(sDom);
				window.addEventListener("dragstart", function() {
					for(var i = 0; i < obj.length; i++) {
						obj[i].blur();
					}
				}, false);
				for(var i = 0; i < obj.length; i++) {
					objBlur(obj[i], time);
				}
			}
		}

		/**	
		 * 元素失去焦点隐藏iphone的软键盘
		 * @param sDom dom节点类型
		 * @param time 毫秒时间
		 */
		function objBlur(sdom, time) {
			if(sdom) {
				sdom.addEventListener("focus", function() {
					setTimeout(function() {
						document.addEventListener("tap", docTouchend, false);
					}, 200)
				}, false);

			} else {
				throw new Error("objBlur()没有找到元素");
			}
			var docTouchend = function(event) {
				if(event.target != sdom) {
					sdom.blur();
					document.removeEventListener('tap', docTouchend, false);
				}
			};
		}

		/**	
		 * 解决安卓输入框遮挡问题
		 */
		function androidGiTest() {
			if(/Android [4-6]/.test(navigator.appVersion)) {
				window.addEventListener("resize", function() {
					if(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
						window.setTimeout(function() {
							document.activeElement.scrollIntoViewIfNeeded();
						}, 0);
					}
				})
			}
		}

		/**	
		 * 初始化页面
		 * @param p 页面模块地址
		 * @param id 地址参数
		 */
		function initPage(p, id) {
			var module = p;
			requirejs.undef(module);
			require([module], function(module) {
				//每次界面跳转清除mui初始化状态，否则点返回时，mui初始化报错		
				mui.clearinits();
				//初始化上下文信息
				loginContext(id, module);
				//			objBlurFun('input');
				//			objBlurFun("textarea"); //IOS焦点失去问题&简单处理IOS输入法下fixed问题（次问题仍然存在，只是简单处理）
				//			androidGiTest(); //安卓输入法遮挡问题
			})
		}
	});