define([
	'knockout',
	'text!pages/game/friendHome/friendHome.html',
	'constants',
	'util',
	'mui',
	'css!./../home/home'
], function(ko, template, Constants, Util) {
	var postNewUserInfoUrl = Constants.BASEHOST + 'Home/UpdateUserInfo';
	var getUserPlantingInfoUrl = Constants.BASEHOST + 'Home/GetUserPlantInfo';
	var getUserLevelUrl = Constants.BASEHOST + 'Home/CalcUserSysSplit';
	var postPlantTeeInfoUrl = Constants.BASEHOST + 'Home/UserPlantTree';
	var postpickPeachUrl = Constants.BASEHOST + 'Home/GetIncomFromTree';
	var postAddPlantUrl = Constants.BASEHOST + 'Home/UserPlantPeachToTree';
	var postLaunchExchangeUrl = Constants.BASEHOST + 'Home/LaunchExchange';
	var getMyExchangeUrl = Constants.BASEHOST + 'Home/GetMyExchange';
	var getCallMeExchangeUrl = Constants.BASEHOST + 'Home/GetCallMeExchange';
	var checkSecondPwdUrl = Constants.BASEHOST + 'Home/CheckSecondPwd';
	var getNoticeListUrl = Constants.BASEHOST + 'AdminNotice/GetNoticeList';
	var getUserLowerLevelUrl = Constants.BASEHOST + 'Home/GetUserLowerLevel';

	var viewModel = {
		user_name: ko.observable(''),
		user_realname: ko.observable(''),
		user_sex: ko.observable(''),
		store: ko.observable(0),
		totalgains: ko.observable(0),
		user_tree_level: ko.observable(0),
		openDrop: ko.observable(false),
		treeInfo: ko.observable({
			type: '',
			typeName: '', //type:  1) 蜜桃树   2) 仙桃树    3) 蟠桃树
			id: '',
			total: 0,
			isAddPlant: ko.observable(false),
			addPlantSum: ko.observable(0)
		}),
		plantInfo: ko.observableArray([]),
	};

	/* 返回首页 */
	viewModel.backHome = function() {
		window.router.setRoute('game/home/home');
	}
	
	viewModel.load = function(param) {
		if(param && param[0]){
			viewModel.user_name(param[0]);
			Util.loadingIn();
		//获取用户果树种植情况
		viewModel.getUserPlantingInfo();
		}else{
			mui.toast('查询失败！');
			viewModel.backHome();
		}
	}

	/* 获取用户植树情况 */
	viewModel.getUserPlantingInfo = function() {
		var param = {};
		param.username = viewModel.user_name();
		$.post(getUserPlantingInfoUrl, param, function(data) {
			data = Util.strToJson(data);
			if(data.success) {
				var plantInfo = Util.strToJson(data.backData)[0];
				console.log('plantInfo==111=', plantInfo);
				var plantsInfoList = [];
				for(prop in plantInfo) {
					if(prop.indexOf('peach') > -1) {
						plantsInfoList.push({
							index: prop.split('peach')[1],
							total: parseInt(plantInfo[prop]),
							hasPeach: ko.observable(false)
						});
					}
					if(prop.indexOf('user_store') > -1) {
						viewModel.store(parseFloat(plantInfo[prop]).toFixed(4));
					}
					if(prop.indexOf('user_totalgains') > -1) {
						viewModel.totalgains(parseFloat(plantInfo[prop]).toFixed(4));
					}
				};
				var allPlantsList = [];
				var treeSum = 0;
				for(var i = 0; i < plantsInfoList.length; i += 2) {
					var item = plantsInfoList[i];
					item.income = plantsInfoList[i + 1].total;
					if(item.income > 0)
						item.hasPeach(true);
					if(item.total >= 300)
						treeSum++;
					allPlantsList.push(item);
				};
				console.log('allPlantsList===', allPlantsList);
				viewModel.plantInfo(allPlantsList);
				viewModel.user_tree_level(treeSum);
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	var init = function(params) {
		viewModel.load(params);
	}
	return {
		'model': viewModel,
		'template': template,
		'init': init
	};
})