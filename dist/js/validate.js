define([], function() {
	var validate = {
		//只准输入字母和数字
		checkLetterAndNumber: function(str) {
			if(/^[A-Za-z0-9]+$/.test(str)) {
				return true;
			} else {
				return false;
			}
		},
		//密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
		checkPwd: function(str) {
			if(/^[a-zA-Z]\w{5,17}$/.test(str)) {
				return true;
			} else {
				return false;
			}
		},
		//手机号码
		checkTelephone: function(str) {
			if(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str)) {
				return true;
			} else {
				return false;
			}
		},
		//腾讯QQ号
		checkQQ: function(str) {
			if(/[1-9][0-9]{4,}/.test(str)) {
				return true;
			} else {
				return false;
			}
		},
		//非零的正整数
		checkIntNumber: function(num) {
			if(/^[1-9]\d*$/.test(num)) {
				return true;
			} else {
				return false;
			}
		},
		//中文、英文、数字包括下划线
		checkCommonString: function(str) {
			if(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(str)) {
				return true;
			} else {
				return false;
			}
		},
		//汉字
		checkChinese: function(str) {
			if(/^[\u4e00-\u9fa5]{0,}$/.test(str)) {
				return true;
			} else {
				return false;
			}
		}
	};

	return validate;
})