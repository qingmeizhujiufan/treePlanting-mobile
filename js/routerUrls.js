define(function() {
	//应用的路由地址
	return {
		//游戏路由
		gameRouters: [
			"/game/home/home",
			"/game/friendHome/friendHome/:id"
		],
		//公共路由
		pubRouters: [
			"/pub/login/login",
			"/pub/start/start"
		],
	};
});