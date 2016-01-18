define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var loginPage = Widget.extend({
		events: {
			'click .btn-group': 'checkFormHandle',
			'click .readme-group .sprite': 'greenUsHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html( mainHtml() );
			result = loginPage.superclass.render.apply( me, arguments );
			return result;
		},
		checkFormHandle: function(e){
			var me = this;
			var TelRegex = /^(1[^012][0-9]{9})$/i;
			var $tel = me.$('input[type="tel"]');
			if( TelRegex.test($.trim($tel.val())) ){
				$tel.parent().removeClass('err-group');
			}else{
				$tel.parent().addClass('err-group');
				return false;
			}

			var $pwd = $('input[type="password"]');
			if( $pwd.val().length < 6  ){
				$pwd.parent().addClass('err-group');
				return false;
			}else{
				$pwd.parent().removeClass('err-group');
			}
			util.ajax({
				url: '?a=login',
				data: {
					phone: $.trim( $tel.val() ),
					pwd: $.trim( $pwd.val() )
				},
				success: function(res){
					if(res.err == 0){
						util.remind(1, '登录成功！');
						util.setCookie('isLogin_qmcz', 'token_t_qmcz');
						util.setCookie('user_qmcz', res.data.name);
						location.href = '#/memain';
					}
				}
			})
		},
		greenUsHandle: function(e){
			var $target = $(e.currentTarget);
			if( $target.hasClass('sprite-bluecheck-gray') ){
				$target.removeClass('sprite-bluecheck-gray').addClass('sprite-bluecheck-active');
			}else{
				$target.addClass('sprite-bluecheck-gray').removeClass('sprite-bluecheck-active');
			}
		},

	});
	module.exports = loginPage;
})