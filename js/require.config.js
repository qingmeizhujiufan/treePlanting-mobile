require.config({
	baseUrl:".",
	paths: {
		text: "js/requirejs/text",
		css: "js/requirejs/css",
		mui: "js/mui",
		constants:'js/constants',
		director: "js/director.min",
		util: "js/util",
		knockout: "js/knockout/knockout",
		zepto: "js/zepto",
		routerurls: "js/routerUrls",
		imgsource: "js/imgSource",
		validate: "js/validate",
		jquery: "js/jquery-3.2.1"
	},
	shim: {
		director: {
			exports: 'Router'
		},
		zepto: {
			exports: '$'
		}
	}
});