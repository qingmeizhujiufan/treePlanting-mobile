define([
	'knockout',
	'text!pages/pub/login/login.html',
	'constants',
	'util',
	'validate',
	'mui',
	'css!./login'
], function(ko, template, Constants, Util, validate) {
	var postLoginUrl = Constants.BASEHOST + 'api/game/login';

	var viewModel = {
		username: ko.observable(''),
		password: ko.observable('')
	};
	
	viewModel.load = function() {}

	viewModel.login = function() {
		if(!validate.checkLetterAndNumber(viewModel.username())){
			mui.toast('用户名输入不合法，请重新输入');
			viewModel.username('');
			return;
		}
		if(!validate.checkLetterAndNumber(viewModel.password())){
			mui.toast('密码输入不合法，请重新输入');
			viewModel.password('');
			return;
		}
		var params = {
			user_name: viewModel.username(),
			user_pwd: viewModel.password()
		}
		Util.loadingIn();
		Util.Compost(postLoginUrl, JSON.stringify(params), function(data) {
			if(data.success) {
				sessionStorage.ticket = data.token;
				var backData = data.backData;
				var json_data = Util.strToJson(backData);
				sessionStorage.id = json_data[0].id;
				sessionStorage.name = json_data[0].user_name;
				sessionStorage.sex = json_data[0].user_sex;
				sessionStorage.pwd = json_data[0].user_pwd;
				sessionStorage.secondpwd = json_data[0].user_secondpwd;
				sessionStorage.realname = json_data[0].user_realname;
				sessionStorage.telephone = json_data[0].user_telephone;
				sessionStorage.qq = json_data[0].user_qq;
				sessionStorage.weixin = json_data[0].user_weixin;
				sessionStorage.alipay = json_data[0].user_alipay;
				sessionStorage.points = json_data[0].user_points;
				window.router.setRoute('game/home/home');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//块点击事件
	viewModel.clickItem = function(param) {
		window.router.setRoute(param);
	}

	var init = function(params) {
		viewModel.load();
	}
	return {
		'model': viewModel,
		'template': template,
		'init': init
	};
})