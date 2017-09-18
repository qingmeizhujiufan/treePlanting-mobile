define([
	'knockout',
	'text!pages/game/home/home.html',
	'constants',
	'util',
	'validate',
	'mui',
	'css!./home'
], function(ko, template, Constants, Util, validate) {
	var loginOutUrl = Constants.BASEHOST + 'api/game/LoginOut';
	var postNewUserInfoUrl = Constants.BASEHOST + 'api/game/UpdateUserInfo';
	var getUserPlantingInfoUrl = Constants.BASEHOST + 'api/game/GetUserPlantInfo';
	var getUserLevelUrl = Constants.BASEHOST + 'api/game/CalcUserSysSplit';
	var postPlantTeeInfoUrl = Constants.BASEHOST + 'api/game/UserPlantTree';
	var postpickPeachUrl = Constants.BASEHOST + 'api/game/GetIncomFromTree';
	var postAddPlantUrl = Constants.BASEHOST + 'api/game/UserPlantPeachToTree';
	var postGetTreeRestPeachesUrl = Constants.BASEHOST + 'api/game/GetTreeRestPeaches';
	var postLaunchExchangeUrl = Constants.BASEHOST + 'api/game/LaunchExchange';
	var getMyExchangeUrl = Constants.BASEHOST + 'api/game/GetMyExchange';
	var getCallMeExchangeUrl = Constants.BASEHOST + 'api/game/GetCallMeExchange';
	var checkSecondPwdUrl = Constants.BASEHOST + 'api/game/CheckSecondPwd';
	var getNoticeListUrl = Constants.BASEHOST + 'AdminNotice/GetNoticeList';
	var getUserLowerLevelUrl = Constants.BASEHOST + 'api/game/GetUserLowerLevel';
	var postConfirmExchangeUrl = Constants.BASEHOST + 'api/game/ConfirmMyExchange';
	var postConfirmMyExchangeUrl = Constants.BASEHOST + 'api/game/ConfirmCallMeExchange';
	var postCancleMyExchangeUrl = Constants.BASEHOST + 'api/game/CancleMyExchange';
	var getGetHangeSellInfoUrl = Constants.BASEHOST + 'api/game/GetHangeSellInfo';
	var postStartHangeSellUrl = Constants.BASEHOST + 'api/game/StartHangeSell';
	var getGetMyHangeSellInfoUrl = Constants.BASEHOST + 'api/game/GetMyHangeSellInfo';
	var postRemoveMyHangeSellUrl = Constants.BASEHOST + 'api/game/RemoveMyHangeSell';
	var postInviteNewUserUrl = Constants.BASEHOST + 'api/game/inviteNewUser';
	var postCancleCallMeExchangeUrl = Constants.BASEHOST + 'api/game/CancleCallMeExchange';
	var postCollectPointsUrl = Constants.BASEHOST + 'api/game/CollectPoints';
	var getNewPointsUrl = Constants.BASEHOST + 'api/game/GetPoints';
	var checkInviteUserUrl = Constants.BASEHOST + 'api/game/checkInviteUser';
	var postConvertPointsUrl = Constants.BASEHOST + 'api/game/PointsToPeach';
	var postLotteryUrl = Constants.BASEHOST + 'api/game/GuessLotto';

	var viewModel = {
		user_name: ko.observable(''),
		user_pwd: ko.observable('******'),
		user_pwd_2: ko.observable('******'),
		user_secondpwd: ko.observable('******'),
		user_secondpwd_2: ko.observable('******'),
		user_realname: ko.observable(''),
		user_sex: ko.observable(''),
		user_telephone: ko.observable(''),
		user_qq: ko.observable(''),
		user_weixin: ko.observable(''),
		user_alipay: ko.observable(''),
		user_points: ko.observable(0),
		user_level: ko.observable(''),
		user_tree_level: ko.observable(0),
		user_split_rate: ko.observable(0),
		store: ko.observable(0),
		totalgains: ko.observable(0),
		user_enablesell_sum: ko.observable(0),
		openDrop: ko.observable(false),
		isCloseBGM: ko.observable(true),
		treeInfo: ko.observable({
			type: '',
			typeName: '', //type:  1) 蜜桃树   2) 仙桃树    3) 蟠桃树
			id: '',
			total: 0,
			isAddPlant: ko.observable(false),
			addPlantSum: ko.observable(0),
			pickSum: ko.observable(0)
		}),
		plantInfo: ko.observableArray([]),
		isShowMallWindow: ko.observable(false),
		isShowUserInfoWindow: ko.observable(false),
		isShowTeeWindow: ko.observable(false),
		isShowSecondpwdWindow: ko.observable({
			showSecondpwdWindow: false,
			showHallWindow: false
		}),
		chooseDealOrHallSell: ko.observable(0), //1: 交易     2： 挂卖
		exchanger: ko.observable(''),
		exchangeSum: ko.observable(300),
		hangSum: ko.observable(100),
		myExchangeList: ko.observableArray([]),
		callMeExchangeList: ko.observableArray([]),
		isShowNoticeWindow: ko.observable(false),
		noticeList: ko.observableArray([]),
		isShowFriendsWindow: ko.observable(false),
		isShowInviteWindow: ko.observable(false),
		inviteData: ko.observable({
			pname: '',
			user_realname: '',
			user_name: '',
			user_sex: '男',
			user_weixin: '',
			user_telephone: '',
			user_qq: '',
			user_alipay: ''
		}),
		friendsList: ko.observableArray([]),
		isShowSettingWindow: ko.observable(false),
		hangSellList: ko.observableArray([]),
		myHangSellList: ko.observableArray([]),
		pointsList: [{
				peach: 90,
				points: 100
			},
			{
				peach: 180,
				points: 200
			},
			{
				peach: 270,
				points: 300
			},
		],
		lotteryState: ko.observable(0),
		lotteryText: ko.observable(''),
		lotteryBtn: ko.observable('开始抽奖')
	};

	/* 控制音乐 */
	viewModel.manageBGM = function() {
		var x = document.getElementById("myAudio");
		var isCloseBGM = viewModel.isCloseBGM();
		if(isCloseBGM) {
			x.pause();
		} else {
			x.play();
		}
		viewModel.isCloseBGM(!isCloseBGM);
	}

	/* 查看朋友种植情况  */
	viewModel.showFriendHome = function() {
		var username = this.user_name;
		window.router.setRoute('game/friendHome/friendHome/' + username);
	}

	/* 收获积分 */
	viewModel.collectPoints = function() {
		if(this.tree_sum == 0)
			return;
		var param = {};
		param.id = sessionStorage.id;
		param.type_from = this.user_name;
		param.sum = this.lower_level == 1 ? this.tree_sum * 2 : this.tree_sum;
		Util.Compost(postCollectPointsUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				mui.toast('收取成功');
				var param = {};
				param.id = sessionStorage.id;
				Util.loadingIn();
				Util.Compost(getUserLowerLevelUrl, JSON.stringify(param), function(data) {
					if(data.success) {
						var userList = data.backData;
					}
					viewModel.friendsList(userList);
					Util.loadingOut();
				});
				viewModel.getNewPoints();
			} else {
				mui.toast(data.backMsg);
			}
		});
	}

	/* 获取最新积分  */
	viewModel.getNewPoints = function() {
		var param = {};
		param.user_name = viewModel.user_name();
		Util.Compost(getNewPointsUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.user_points(data.points);
			} else {
				mui.toast(data.backMsg);
			}
		});
	}

	/* 兑换积分  */
	viewModel.convertPoints = function(obj, dom) {
		var that = this;
		if(viewModel.user_points() < that.poins) {
			mui.toast('积分不足，多多收取好友积分喔！');
			return;
		}
		dom.stopPropagation();
		var btnArray = ['取消', '确定'];
		mui.confirm('将消耗' + that.points + '，确认要兑换吗？', '温馨提示', btnArray, function(e) {
			if(e.index == 1) {
				var param = {};
				param.id = sessionStorage.id;
				param.sum = that.points;
				Util.Compost(postConvertPointsUrl, JSON.stringify(param), function(data) {
					if(data.success) {
						mui.toast('恭喜！成功兑换 ' + that.peach + ' 个桃子。');
						viewModel.load();
						viewModel.getNewPoints();
					} else {
						mui.toast(data.backMsg);
					}
				});
			}
		});
	}

	/* 打开商城 */
	viewModel.openMall = function() {
		viewModel.isShowMallWindow(true);
	}
	/* 关闭商城 */
	viewModel.closeMall = function() {
		viewModel.isShowMallWindow(false);
	}

	/* 刷新应用 */
	viewModel.refushApp = function() {
		viewModel.load();
	}

	/* 确认增种 */
	viewModel.sureAdd = function() {
		var treeInfo = viewModel.treeInfo();
		console.log('treeInfo', treeInfo);
		if(treeInfo.isAddPlant()) {
			treeInfo.isAddPlant(false);
		} else {
			treeInfo.isAddPlant(true);
		}
	}

	/* 打开或者关闭用户信息窗口 */
	viewModel.showUserInfoWindow = function() {
		viewModel.isShowUserInfoWindow(true);
	}
	viewModel.closeUserInfoWindow = function() {
		viewModel.isShowUserInfoWindow(false);
	}

	/* 打开或者关闭果树信息窗口 */
	viewModel.showTeeWindow = function() {
		var type_id = this.index.split('_');
		var treeinfo = {};
		treeinfo.type = type_id[1];
		treeinfo.typeName = type_id[1] == '1' ? '蜜桃树' : (type_id[1] == '2' ? '仙桃树' : '蟠桃树'), //type:  1) 蜜桃树   2) 仙桃树    3) 蟠桃树
			treeinfo.id = type_id[2];
		treeinfo.total = this.total;
		treeinfo.isAddPlant = ko.observable(false);
		treeinfo.addPlantSum = ko.observable(0);
		treeinfo.pickSum = ko.observable(0);
		viewModel.treeInfo(treeinfo);
		viewModel.isShowTeeWindow(true);
	}
	viewModel.closeTeeWindow = function() {
		viewModel.isShowTeeWindow(false);
	}

	/* 关闭二级密码窗口 */
	viewModel.closeSecondpwdWindow = function() {
		viewModel.isShowSecondpwdWindow({
			showSecondpwdWindow: false,
			showHallWindow: false
		});
		viewModel.user_secondpwd('');
	}

	viewModel.updateUserInfo = function() {
		if(!validate.checkPwd(viewModel.user_pwd())) {
			mui.toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
			return;
		}
		if(viewModel.user_pwd_2() != viewModel.user_pwd()) {
			viewModel.user_pwd('');
			viewModel.user_pwd_2('');
			mui.toast('密码不一致，请重新输入密码！');
			return;
		}
		if(!validate.checkPwd(viewModel.user_secondpwd())) {
			mui.toast('二级密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
			return;
		}
		if(viewModel.user_secondpwd_2() != viewModel.user_secondpwd()) {
			viewModel.user_secondpwd('');
			viewModel.user_secondpwd_2('');
			mui.toast('密码不一致，请重新输入密码！');
			return;
		}

		var param = {};
		param.user_name = viewModel.user_name();
		param.user_pwd = viewModel.user_pwd();
		param.user_secondpwd = viewModel.user_secondpwd();
		param.user_realname = viewModel.user_realname();
		param.user_telephone = viewModel.user_telephone();
		param.user_qq = viewModel.user_qq();
		param.user_weixin = viewModel.user_weixin();
		param.user_alipay = viewModel.user_alipay();
		Util.loadingIn();
		Util.Compost(postNewUserInfoUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				mui.toast('修改成功！');
				viewModel.closeUserInfoWindow();
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});

	}

	//挂买大厅
	viewModel.showHallSellWindow = function() {
		var plantInfo = viewModel.plantInfo();
		var count = 0;
		for(var i = 0; i < plantInfo.length; i++) {
			if(plantInfo[i].total >= 300) {
				count++;
			}
		}
		if(count == 0) {
			mui.toast('抱歉，请至少种植一棵树');
			return;
		}
		viewModel.user_secondpwd('');
		viewModel.chooseDealOrHallSell(2);
		viewModel.isShowSecondpwdWindow({
			showSecondpwdWindow: true,
			showHallWindow: false
		});
	}
	viewModel.closeHallSellWindow = function() {
		viewModel.chooseDealOrHallSell(0);
	}

	//交易大厅
	viewModel.showDealWindow = function() {
		var plantInfo = viewModel.plantInfo();
		var count = 0;
		for(var i = 0; i < plantInfo.length; i++) {
			if(plantInfo[i].total >= 300) {
				count++;
			}
		}
		if(count == 0) {
			mui.toast('抱歉，请至少种植一棵树');
			return;
		}
		viewModel.user_secondpwd('');
		viewModel.chooseDealOrHallSell(1);
		viewModel.isShowSecondpwdWindow({
			showSecondpwdWindow: true,
			showHallWindow: false
		});
	}
	viewModel.closeDealWindow = function() {
		viewModel.chooseDealOrHallSell(0);
	}

	viewModel.showFriendWindow = function() {
		var param = {};
		param.id = sessionStorage.id;
		Util.loadingIn();
		Util.Compost(getUserLowerLevelUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				var userList = data.backData;
				console.log('userList===== ', userList);
				viewModel.friendsList(userList);
				viewModel.isShowFriendsWindow(true);
			} else {
				mui.toast(backMsg);
			}
			Util.loadingOut();
		});
	}

	viewModel.closeFriendWindow = function() {
		viewModel.isShowFriendsWindow(false);
	}

	viewModel.showInviteWindow = function() {
		viewModel.isShowInviteWindow(true);
	}
	viewModel.closeInviteWindow = function() {
		viewModel.isShowInviteWindow(false);
	}
	viewModel.comfirmInviteInfo = function() {
		var inviteData = viewModel.inviteData();
		if(!validate.checkLetterAndNumber(inviteData.pname)) {
			mui.toast('推荐人由字母和数字组成，请重新输入');
			return;
		}
		if(!validate.checkLetterAndNumber(inviteData.user_name)) {
			mui.toast('用户名由字母和数字组成，请重新输入');
			return;
		}
		if(!validate.checkChinese(inviteData.user_realname)) {
			mui.toast('姓名必须为汉字');
			return;
		}
		if(!validate.checkTelephone(inviteData.user_telephone)) {
			mui.toast('电话号码不正确，请重新输入');
			return;
		}
		if(!validate.checkCommonString(inviteData.user_weixin)) {
			mui.toast('微信含有不合法字符，请重新输入');
			return;
		}
		if(!validate.checkQQ(inviteData.user_qq)) {
			mui.toast('QQ号输入不正确');
			return;
		}
		if(!validate.checkCommonString(inviteData.user_alipay)) {
			mui.toast('支付宝含有不合法字符，请重新输入');
			return;
		}

		var checkInviteUser = {};
		checkInviteUser.pname = inviteData.pname;
		Util.Compost(checkInviteUserUrl, JSON.stringify(checkInviteUser), function(data) {
			if(data.success) {
				var param = {};
				param.pid = data.id;
				param.pname = inviteData.pname;
				param.username = inviteData.user_name;
				param.realname = inviteData.user_realname;
				param.sex = inviteData.user_sex;
				param.telephone = inviteData.user_telephone;
				param.wechatno = inviteData.user_weixin;
				param.qqno = inviteData.user_qq;
				param.alipayno = inviteData.user_alipay;
				param.selfname = viewModel.user_name();
				Util.loadingIn();
				Util.Compost(postInviteNewUserUrl, JSON.stringify(param), function(data2) {
					if(data2.success) {
						viewModel.closeInviteWindow();
						mui.toast('邀请信息提交成功，请等候后台处理！');
						viewModel.load();
					} else {
						mui.toast(data2.backMsg);
					}
					Util.loadingOut();
				});
			} else {
				mui.toast(data.backMsg);
			}
		});
	}

	viewModel.openSelectList = function() {
		var openDrop = viewModel.openDrop();
		viewModel.openDrop(!openDrop);
	}

	/* 打开公告栏   */
	viewModel.openNoticeWindow = function() {
		Util.loadingIn();
		$.post(getNoticeListUrl, null, function(data) {
			console.log('data===== ', data);
			var data = Util.strToJson(data);
			console.log('noticeList===== ', data);
			viewModel.noticeList(Util.strToJson(data.backData.noticeList));

			viewModel.isShowNoticeWindow(true);
			Util.loadingOut();
		});
	}

	/* 关闭公告栏  */
	viewModel.closeNoticeWindow = function() {
		viewModel.isShowNoticeWindow(false);
	}

	viewModel.showSetting = function() {
		viewModel.isShowSettingWindow(true);
	}

	viewModel.closeSetting = function() {
		viewModel.isShowSettingWindow(false);
	}

	viewModel.showPlant = function() {

	}

	viewModel.showCollect = function() {

	}

	//检查二级密码是否正确
	viewModel.checkSecondpwd = function() {
		var param = {};
		param.username = viewModel.user_name();
		param.secondpwd = viewModel.user_secondpwd();
		Util.loadingIn();
		Util.Compost(checkSecondPwdUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.isShowSecondpwdWindow({
					showSecondpwdWindow: false,
					showHallWindow: true
				});
				if(viewModel.chooseDealOrHallSell() == 1) {
					viewModel.getMyExchange();
					viewModel.getCallMeExchange();
				} else {
					viewModel.getHangeSellInfo();
					viewModel.getMyHangeSellInfo();
				}
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//发起交易
	viewModel.launchExchange = function() {
		if(viewModel.exchanger() == '') {
			mui.toast('交易人不能为空');
			return;
		}
		if(!validate.checkIntNumber(viewModel.exchangeSum())) {
			mui.toast('请输入整数');
			return;
		}
		var param = {};
		param.poster = viewModel.user_name();
		param.exchanger = viewModel.exchanger();
		param.sum = viewModel.exchangeSum();
		Util.loadingIn();
		Util.Compost(postLaunchExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				mui.toast('发起交易已提交，请等候对方确认！');
				viewModel.getUserPlantingInfo();
				viewModel.closeDealWindow();
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//我发起的交易列表
	viewModel.getMyExchange = function() {
		var param = {};
		param.username = viewModel.user_name();
		Util.loadingIn();
		Util.Compost(getMyExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				var backData = data.backData;
				if(JSON.stringify(backData) !== "{}") {
					for(var i = 0; i < backData.length; i++) {
						var state = backData[i].state;
						switch(state) {
							case 0:
								backData[i].title = '待验收';
								break;
							case 1:
								backData[i].title = '待确认';
								break;
							case 2:
								backData[i].title = '回复取消';
								break;
							case 3:
								backData[i].title = '已完成';
								break;
							case 4:
								backData[i].title = '已取消';
								break;
							default:
								backData[i].title = '异常';
								break;
						}
					}
					viewModel.myExchangeList(backData);
					console.log('myExchangeList====', viewModel.myExchangeList());
				}
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//我的被交易表表
	viewModel.getCallMeExchange = function() {
		var param = {};
		param.username = viewModel.user_name();
		Util.loadingIn();
		Util.Compost(getCallMeExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				var backData = data.backData;
				if(JSON.stringify(backData) !== "{}") {
					for(var i = 0; i < backData.length; i++) {
						var state = backData[i].state;
						switch(state) {
							case 0:
								backData[i].title = '待验收';
								break;
							case 1:
								backData[i].title = '待确认';
								break;
							case 2:
								backData[i].title = '回复取消';
								break;
							case 3:
								backData[i].title = '已完成';
								break;
							case 4:
								backData[i].title = '已取消';
								break;
							default:
								backData[i].title = '异常';
								break;
						}
					}
					viewModel.callMeExchangeList(backData);
					console.log('callMeExchangeList====', viewModel.callMeExchangeList());
				}
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//确认交易按钮事件
	viewModel.cofirmExchange = function() {
		var param = {};
		param.id = this.id;
		param.username = viewModel.user_name();
		param.user_exchangename = this.user_exchangename;
		param.sum = this.user_exchangenumber;
		Util.loadingIn();
		Util.Compost(postConfirmExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.getMyExchange();
				mui.toast('确认成功！');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//取消交易时间事件
	viewModel.cancleMyExchange = function() {
		var param = {};
		param.id = this.id;
		param.username = viewModel.user_name();
		param.sum = this.user_exchangenumber;
		Util.loadingIn();
		Util.Compost(postCancleMyExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.getMyExchange();
				viewModel.getUserPlantingInfo();
				mui.toast('取消成功！');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//确认@我交易按钮
	viewModel.cofirmCallMeExchange = function() {
		var param = {};
		param.id = this.id;
		Util.loadingIn();
		Util.Compost(postConfirmMyExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.getCallMeExchange();
				mui.toast('确认成功！');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//取消@Me待验收
	viewModel.cancleCallMeExchange = function() {
		var param = {};
		param.id = this.id;
		param.username = this.user_name;
		param.sum = this.user_exchangenumber;
		Util.loadingIn();
		Util.Compost(postCancleCallMeExchangeUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.getCallMeExchange();
				mui.toast('取消成功！');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//查询所有挂买信息
	viewModel.getHangeSellInfo = function() {
		Util.loadingIn();
		Util.Compost(getGetHangeSellInfoUrl, null, function(data) {
			if(data.success) {
				var backData = data.backData;
				if(JSON.stringify(backData) !== "{}") {
					for(var i = 0; i < backData.length; i++) {
						backData[i].title = '进行中';
					}
					viewModel.hangSellList(backData);
				}
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//发布挂买信息
	viewModel.startHange = function() {
		if(!validate.checkIntNumber(viewModel.hangSum())) {
			mui.toast('请输入的数量有误，请重新输入');
			return;
		}
		var param = {};
		param.username = viewModel.user_name();
		param.sum = viewModel.hangSum();
		Util.loadingIn();
		Util.Compost(postStartHangeSellUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.getHangeSellInfo();
				mui.toast('发布挂买信息成功');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//获取我的挂买列表
	viewModel.getMyHangeSellInfo = function() {
		var param = {};
		param.username = viewModel.user_name();
		Util.loadingIn();
		Util.Compost(getGetMyHangeSellInfoUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				var backData = data.backData;
				if(JSON.stringify(backData) !== "{}") {
					for(var i = 0; i < backData.length; i++) {
						var hangsellstate = backData[i].hangsellstate;
						switch(hangsellstate) {
							case 0:
								backData[i].title = '已结束';
								break;
							case 1:
								backData[i].title = '进行中';
								break;
							default:
								backData[i].title = '异常';
								break;
						}
					}
					viewModel.myHangSellList(backData);
				}
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//关闭挂买
	viewModel.closeHangSell = function() {
		var param = {};
		param.username = viewModel.user_name();
		param.sellid = this.id;
		param.sum = this.hangsell_number;
		Util.loadingIn();
		Util.Compost(postRemoveMyHangeSellUrl, JSON.stringify(param), function(data) {
			var data = Util.strToJson(data);
			if(data.success) {
				viewModel.getHangeSellInfo();
				viewModel.getMyHangeSellInfo();
				mui.toast('关闭挂买成功');
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	viewModel.load = function() {
		Util.loadingIn();
		//获取用户等级情况
		viewModel.getUserLevelInfo();
		//获取用户果树种植情况
		viewModel.getUserPlantingInfo();
	}

	viewModel.getUserLevelInfo = function() {
		var param = {};
		param.username = viewModel.user_name();
		Util.loadingIn();
		Util.Compost(getUserLevelUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.user_split_rate((data.backData * 100).toFixed(2));
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	/* 获取用户植树情况 */
	viewModel.getUserPlantingInfo = function() {
		var param = {};
		param.username = sessionStorage.name;
		Util.loadingIn();
		Util.Compost(getUserPlantingInfoUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				var plantInfo = data.backData;
				var plantsInfoList = [];
				for(prop in plantInfo) {
					if(prop.indexOf('peach') > -1) {
						plantsInfoList.push({
							index: prop.split('peach')[1],
							total: Math.round(plantInfo[prop]),
							hasPeach: ko.observable(false)
						});
					}
					if(prop.indexOf('user_store') > -1) {
						viewModel.store(plantInfo[prop]);
					}
					if(prop.indexOf('user_totalgains') > -1) {
						viewModel.totalgains(plantInfo[prop]);
					}
					if(prop.indexOf('user_enablesell_sum') > -1) {
						viewModel.user_enablesell_sum(plantInfo[prop]);
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
				viewModel.plantInfo(allPlantsList);
				viewModel.user_tree_level(treeSum);
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	/* 种植 */
	viewModel.plantTree = function(obj, dom) {
		dom.stopPropagation();
		var btnArray = ['取消', '确定'];
		mui.confirm('即将种植一棵新树，确认？', '温馨提示', btnArray, function(e) {
			if(e.index == 1) {
				var type = 1,
					id = 1,
					sum = 300,
					existIndex = -1;
				var lastest_tree_index = '';
				var plantInfo = viewModel.plantInfo();
				if(viewModel.sum < 300) {
					mui.toast('您的仓库果实总量不够');
					return;
				}
				for(var i = 0; i < plantInfo.length; i++) {
					if(plantInfo[i].total >= 300) {
						lastest_tree_index = plantInfo[i].index;
						type = parseInt(lastest_tree_index.split('_')[1]);
						id = parseInt(lastest_tree_index.split('_')[2]);
						existIndex = i;
					}
				}
				var param = {};
				param.username = viewModel.user_name();
				if(existIndex == -1 || existIndex == plantInfo.length) {
					param.treetpye = type;
					param.treeid = id;
					param.sum = sum;
				} else {
					if(type == 1) {
						if(id != 10) {
							param.treetpye = type;
							param.treeid = id + 1;
							param.sum = 300;
						} else {
							param.treetpye = 2;
							param.treeid = 1;
							param.sum = 1000;
						}
					} else if(type == 2) {
						if(id != 5) {
							param.treetpye = type;
							param.treeid = id + 1;
							param.sum = 1000;
						} else {
							param.treetpye = 3;
							param.treeid = 1;
							param.sum = 5000;
						}
					} else if(type == 3) {
						mui.toast('您已种满所有树');
						return;
					} else {
						param.treetpye = type;
						param.treeid = id;
						param.sum = sum;
					}
				}

				console.log('param=====', param);
				Util.loadingIn();
				Util.Compost(postPlantTeeInfoUrl, JSON.stringify(param), function(data) {
					if(data.success) {
						mui.toast('恭喜您，新种一个树！');
						viewModel.load();
					} else {
						mui.toast(data.backMsg);
					}
					Util.loadingOut();
				});
			} else {}
		});
	}

	/* 采摘 */
	viewModel.pickPeachs = function(obj, dom) {
		dom.stopPropagation();
		var that = this;
		if(this.hasPeach()) {
			var type_id = that.index.split('_');
			var param = {};
			param.username = viewModel.user_name();
			param.treetpye = parseInt(type_id[1]);
			param.treeid = parseInt(type_id[2]);
			param.sum = that.income;
			Util.loadingIn();
			Util.Compost(postpickPeachUrl, JSON.stringify(param), function(data) {
				if(data.success) {
					that.hasPeach(false);
					mui.toast('恭喜，已采摘' + that.income + '个桃子！');
					viewModel.load();
				} else {
					mui.toast(data.backMsg);
				}
				Util.loadingOut();
			});
		}
	}

	/* 确认增种 */
	viewModel.comfirmAddPlant = function() {
		var treeInfo = viewModel.treeInfo();
		if(!validate.checkIntNumber(treeInfo.addPlantSum())) {
			mui.toast('请输入整数');
			return;
		}
		if(treeInfo.isAddPlant()) {
			var param = {};
			param.username = viewModel.user_name();
			param.treetpye = parseInt(treeInfo.type);
			param.treeid = parseInt(treeInfo.id);
			param.sum = treeInfo.addPlantSum();
			Util.loadingIn();
			Util.Compost(postAddPlantUrl, JSON.stringify(param), function(data) {
				if(data.success) {
					viewModel.closeTeeWindow();
					mui.toast('桃树增种成功！');
					viewModel.load();
				} else {
					mui.toast(data.backMsg);
				}
				Util.loadingOut();
			});
		}
	}

	/* 树上摘桃子 */
	viewModel.comfirmPick = function() {
		var treeInfo = viewModel.treeInfo();
		if(!validate.checkIntNumber(treeInfo.pickSum())) {
			mui.toast('请输入整数');
			return;
		}
		var param = {};
		param.username = viewModel.user_name();
		param.treetype = parseInt(treeInfo.type);
		param.treeid = parseInt(treeInfo.id);
		param.sum = treeInfo.pickSum();
		Util.loadingIn();
		Util.Compost(postGetTreeRestPeachesUrl, JSON.stringify(param), function(data) {
			if(data.success) {
				viewModel.closeTeeWindow();
				mui.toast('摘桃成功！');
				viewModel.load();
			} else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}

	//块点击事件
	viewModel.clickItem = function(param) {
		Util.loadingIn();
		window.router.setRoute(param);
	}

	//退出游戏
	viewModel.existGame = function(obj, dom) {
		dom.stopPropagation();
		var btnArray = ['取消', '确定'];
		mui.confirm('确认要退出吗？', '温馨提示', btnArray, function(e) {
			if(e.index == 1) {
				var param = {};
				param.userId = sessionStorage.id;
				Util.loadingIn();
				Util.Compost(loginOutUrl, JSON.stringify(param), function(data) {
					if(data.success) {
						sessionStorage.clear();
						window.router.setRoute('pub/login/login');
					} else {
						mui.toast(data.backMsg);
					}
					Util.loadingOut();
				});
			}
		});
	}

	//抽奖
	viewModel.lottery = function(){
		Util.loadingIn();
		viewModel.lotteryState(0);
		viewModel.lotteryText('');
		viewModel.lotteryBtn('抽奖中...');
		var param = {};
		param.id = sessionStorage.id;
		Util.Compost(postLotteryUrl, JSON.stringify(param), function(data){
			viewModel.lotteryBtn('继续抽奖');
			if(data.success){
				viewModel.load();
				viewModel.getNewPoints();
				viewModel.lotteryText(data.backData);
				setTimeout(function(){
					viewModel.lotteryState(1);
				}, 1000);
			}else {
				mui.toast(data.backMsg);
			}
			Util.loadingOut();
		});
	}
	
	//vanvas 雨落
	viewModel.canvasRain = function() {
		var getPixelRatio = function(context) {
			var backingStore = context.backingStorePixelRatio ||
				context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

			return(window.devicePixelRatio || 1) / backingStore;
		};
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		var w = c.width = window.innerWidth * getPixelRatio(ctx);
		var h = c.height = window.innerHeight;
		var clearColor = 'rgba(0, 0, 0, 0.1)';
		var max = 60;
		var drops = [];

		function random(min, max) {
			return Math.random() * (max - min) + min;
		}

		function randomColor() {
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			return "rgb(" + r + "," + g + "," + b + ")"; //IE7不支出rgb
		};

		function O() {}
		O.prototype = {
			init: function() {
				this.x = random(0, w);
				this.y = 0;
				this.color = randomColor();
				this.w = 2;
				this.h = 1;
				this.vy = random(4, 5);
				this.vw = 3;
				this.vh = 1;
				this.size = 2;
				this.hit = random(h * .8, h * .9);
				this.a = 0.5;
				this.va = .96;
			},
			draw: function() {
				if(this.y > this.hit) {
					ctx.beginPath();
					ctx.moveTo(this.x, this.y - this.h / 2);
					ctx.bezierCurveTo(
						this.x + this.w / 2, this.y - this.h / 2,
						this.x + this.w / 2, this.y + this.h / 2,
						this.x, this.y + this.h / 2);

					ctx.bezierCurveTo(
						this.x - this.w / 2, this.y + this.h / 2,
						this.x - this.w / 2, this.y - this.h / 2,
						this.x, this.y - this.h / 2);

					ctx.strokeStyle = 'hsla(180, 100%, 50%, ' + this.a + ')';
					ctx.stroke();
					ctx.closePath();

				} else {
					ctx.fillStyle = this.color;
					ctx.fillRect(this.x, this.y, this.size, this.size * 5);
				}
				this.update();
			},
			update: function() {
				if(this.y < this.hit) {
					this.y += this.vy;
				} else {
					if(this.a > .03) {
						this.w += this.vw;
						this.h += this.vh;
						if(this.w > 100) {
							this.a *= this.va;
							this.vw *= .98;
							this.vh *= .98;
						}
					} else {
						this.init();
					}
				}

			}
		}

		function resize() {
			w = c.width = window.innerWidth * getPixelRatio(ctx);
			h = c.height = window.innerHeight;
		}

		function setup() {
			//		canvas.style.opacity = "0.1";
			for(var i = 0; i < max; i++) {
				(function(j) {
					setTimeout(function() {
						var o = new O();
						o.init();
						drops.push(o);
					}, j * 100)
				}(i));
			}
		}

		function anim() {
			ctx.fillStyle = clearColor;
			ctx.fillRect(0, 0, w, h);
			for(var i in drops) {
				drops[i].draw();
			}
			requestAnimationFrame(anim);
		}

		window.addEventListener("resize", resize);

		setup();
		anim();
	}

	var init = function(params) {
		if(sessionStorage.id) {
			viewModel.user_name(sessionStorage.name);
			viewModel.user_sex(sessionStorage.sex);
			viewModel.user_pwd(sessionStorage.pwd);
			viewModel.user_secondpwd(sessionStorage.secondpwd);
			viewModel.user_realname(sessionStorage.realname);
			viewModel.user_telephone(sessionStorage.telephone);
			viewModel.user_weixin(sessionStorage.weixin);
			viewModel.user_qq(sessionStorage.qq);
			viewModel.user_alipay(sessionStorage.alipay);
			viewModel.user_points(sessionStorage.points);
		} else {
			window.router.setRoute('pub/login/login');
		}
		viewModel.load();
		viewModel.canvasRain();
		mui('.mui-scroll-wrapper:not(.system-scroll)').scroll();
	}
	return {
		'model': viewModel,
		'template': template,
		'init': init
	};
})