define(function (require, exports, module){
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var nextstepHtml = require('./template/nextstep-html');
	var curTime = 59;
	var curTimeIsCount = false;
	var interTime = null;
	function myTime(){
		if(curTime == 0){
			clearInterval(interTime);
			$('.verify-callback').html('点击获取验证码');
			curTime = 59;
			curTimeIsCount = false;
		}else{
			$('.verify-callback').html(curTime+'s后重新发送');
			curTime--;
		}
	}

	var findpwdPage = Widget.extend({
		events: {
			'click .verify-callback': 'sendMsgHandle',
			'click .findpwd-next-step': 'btnToFindpwdHandle',
			'click .findpwd-submit': 'findpwdSubmitHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html( mainHtml() );
			result = findpwdPage.superclass.render.apply( me, arguments );
			return result;
		},
		sendMsgHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);

			var TelRegex = /^(1[^012][0-9]{9})$/i;
			var $tel = me.$('input[type="tel"]');
			if( TelRegex.test($.trim($tel.val())) ){
				$tel.parent().removeClass('err-group');
			}else{
				$tel.parent().addClass('err-group');
				return false;
			}
			if( curTimeIsCount ){
				return;
			}
			if( interTime ){
				clearInterval( interTime );
			}

			util.ajax({
				url: '?a=getcode',
				data: {
					phone: 13223423412,
					type: 1
				},
				success: function(res){
					if( res.err == 0 ){
						util.remind(1, '短信验证码发送成功');
						curTime = 59;
						curTimeIsCount = true;
						interTime = setInterval( myTime ,1000);
					}
				}
			})
		},
		btnToFindpwdHandle: function (e){
			var me = this;
			var TelRegex = /^(1[^012][0-9]{9})$/i;
			var $tel = me.$('input[type="tel"]');
			if( TelRegex.test($.trim($tel.val())) ){
				$tel.parent().removeClass('err-group');
			}else{
				$tel.parent().addClass('err-group');
				return false;
			}

			var $msg = me.$('input[name="msgcode"]');
			if( $.trim($msg.val()).length == 6 ){
				$msg.parents('.item-group').removeClass('err-group');
			}else{
				$msg.parents('.item-group').addClass('err-group');
				return false;
			}
			me.$('.findpwd-group').html(nextstepHtml({
				phone: $.trim($tel.val()),
				code: $.trim($msg.val())
			}));
			if( interTime ){
				clearInterval( interTime );
			}
			return;
		},
		findpwdSubmitHandle: function(e){
			var me = this;
			var $pwd = $('input[type="password"]');
			if( $pwd.val().length < 6  ){
				$pwd.parent().addClass('err-group');
				return false;
			}else{
				$pwd.parent().removeClass('err-group');
			}
			util.ajax({
				url: '?a=resetpwd',
				data: {
					phone: me.$('input[name="phone"]').val(),
					code: me.$('input[name="code"]').val(),
					pwd: $pwd.val()
				},
				success: function(res){
					console.log(res);
					if(res.err == 0){
						util.remind(1, '密码找回成功，请重新登录！');
						location.href = '#/login';
					}
				}
			})
		},
		destroy: function(){
			var me = this;
			var result;
			if( interTime ){
				clearInterval( interTime );
			}
			result = findpwdPage.superclass.destroy.apply(me, arguments);
			return result;
		}
	});
	module.exports = findpwdPage;
})