define(
	[
		'mui',
		'zepto',
		'constants'
	],
	function(mui, $, Constants) {
		var that = this;
		/**	
		 * 显示加载中图层
		 * @param text 可为空，传入文字字符串
		 */
		var loadingIn = function(text) {
			var _text = '';
			var _class = '';
			var append_html = '';
			if($('.mui-loading').length > 0) {
				return false;
			}
			if(text) {
				_class = ' mui-loading-text';
				_text = '<p>' + text + '</p>';
				append_html = '<div class="backup"></div><div class="mui-loading' + _class + '"><span class="mui-spinner mui-spinner-white"></span>' + _text + '</div>';
			} else {
				_class = '';
				_text = '';
				append_html = '<div class="backup"></div>' +
					'<div class="mui-loading mui-spinner mui-spinner-white"></div>';
			}
			$('body').append(append_html);
		};

		/**	
		 * 隐藏加载中的图层
		 */
		var loadingOut = function() {
			$('.mui-loading, .backup').addClass('fade');
			setTimeout(function() {
				$('.mui-loading, .backup').remove();
			}, 350);
		};

		return {
			Comget: function(url, paramdata, successfun, errorfun) {
				mui.ajax(url, {
					dataType: 'json',
					data: paramdata,
					type: 'get',
					success: function(data) {
						if(data.success || data.code == 'success') {
							if(typeof successfun == 'function') {
								successfun(data)
							} else {
								mui.toast('调用网路请求语法有误')
							}
						} else {
							if(typeof errorfun == 'function') {
								errorfun(data.backMsg, data)
							} else {
								mui.toast(data.backMsg);
							}
						}
						loadingOut();
					},
					error: function(xhr, type, errorThrown) {
						if(type == 'timeout') {
							mui.toast('网络繁忙，稍后再试');
						} else {
							mui.toast('网络出现异常！')
						}
						loadingOut();
					}
				});
			},
			Compost: function(url, paramdata, successfun, errorfun) {
				mui.ajax(url, {
					dataType: 'json',
					data: paramdata,
					type: 'post',
					contentType: 'application/json',
					beforeSend: function (xhr) {
					// //发送ajax请求之前向http的head里面加入验证信息
					xhr.setRequestHeader("Token", sessionStorage.ticket); // 请求发起前在头部附加token
					},
					success: function(data) {
						if(data.success) {
							successfun(data)
						} else {
							if(typeof errorfun == 'function') {
								errorfun(data)
							} else {
								mui.toast(data.backMsg);
							}
						}
						loadingOut();
					},
					error: function(xhr, type, errorThrown) {
						if(type == 'timeout') {
							mui.toast('网络繁忙，稍后再试！');
						}else if(errorThrown == 'Unauthorized'){
							mui.toast('用户超时，请安全退出重新登录！');
						} else {
							mui.toast('网络出现异常！')
						}
						loadingOut();
					}
				});
			},
			strToJson: function(strJson) {
				if(strJson == null || strJson == undefined || strJson == "") {
					return {};
				}
				return eval('(' + strJson + ')');
			},
			//显示加载中图层
			loadingIn: loadingIn,
			//隐藏加载中的图层
			loadingOut: loadingOut
		};
	});