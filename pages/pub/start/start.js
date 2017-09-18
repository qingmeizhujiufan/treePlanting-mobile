define([
	'knockout',
	'zepto',
	'text!pages/pub/start/start.html',
	'constants',
	'util',
	'imgsource',
	'mui',
	'css!./start'
], function(ko, $, template, Constants, Util, ImgSource) {
	var postLoginUrl = Constants.BASEHOST + 'Home/login';

	var viewModel = {
		start: ko.observable(false),
		rate: ko.observable(0),
		bar: ko.observable(0)
	};

	viewModel.load = function() {
		var gameImgList = ImgSource.login;
		gameImgList = gameImgList.concat(ImgSource.game);
		var sum = gameImgList.length;
		var onSuccessCount = 0;
		for(var i = 0; i < sum; i++) {
			var img = new Image();
			img.src = gameImgList[i];
			img.onload = function() {
				onSuccessCount++;
				var rate = Math.ceil(onSuccessCount / sum * 100);
				var bar = rate * 50 / 100;
				viewModel.rate(rate);
				viewModel.bar(bar);
				if(rate == 100) {
					window.router.setRoute('pub/login/login');
				}
			}
		}
	}

	var init = function() {
		Util.loadingIn();
		var startImgList = ImgSource.start;
		var onSuccessCount = 0;
		for(var i = 0; i < startImgList.length; i++) {
			var img = new Image();
			img.src = startImgList[i];
			img.onload = function() {
				onSuccessCount++;
				if(onSuccessCount == startImgList.length) {
					viewModel.start(true);
					Util.loadingOut();
					setTimeout(function(){
						viewModel.load();
					}, 1000);
					
				}
			}
		}
	}
	return {
		'model': viewModel,
		'template': template,
		'init': init
	};
})