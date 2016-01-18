define(function (require, exports, module){
	var Widget=require('arale/widget/1.1.1/widget');
	var mainHtml = require('./template/main-html');
	var util = require('arale/util/util');
	var curTime = 59;
	var curTimeIsCount = false;
	var interTime = null;
	function myTime(){
		if(curTime == 0){
			clearInterval(interTime);
			$('input[type="tel"]').attr('disabled',false);
			$('.verify-callback').html('点击获取验证码');
			curTime = 59;
			curTimeIsCount = false;
		}else{
			$('.verify-callback').html(curTime+'s后重新发送');
			curTime--;
		}
	}

	var registerPage = Widget.extend({
		events: {
			'click .verify-callback': 'sendMsgHandle',
			'click .btn-group': 'btnToRegisterHandle',
			'click .readme-group .sprite': 'greenUsHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html( mainHtml() );
			result = registerPage.superclass.render.apply(me, arguments);
			return result;
		},
		greenUsHandle: function(e){
			var $target = $(e.currentTarget);
			if( $target.hasClass('sprite-bluecheck-gray') ){
				$target.removeClass('sprite-bluecheck-gray').addClass('sprite-bluecheck-active');
			}else{
				$target.addClass('sprite-bluecheck-gray').removeClass('sprite-bluecheck-active');
			}
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
					phone: $.trim($tel.val()),
					type: 0
				},
				success: function(res){
					if( res.err == 0 ){
						util.remind(1 ,'短信验证码发送成功');
						//用于测试验证码这块 zlt
						me.$('input[name="msgcode"]').val( res.data.code );
						$tel.attr('disabled','disabled');
						curTime = 59;
						curTimeIsCount = true;
						interTime = setInterval( myTime ,1000);
					}
				}
			})
		},
		btnToRegisterHandle: function(e){
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

			var $pwd = $('input[type="password"]');
			if( $pwd.val().length < 6  ){
				$pwd.parent().addClass('err-group');
				return false;
			}else{
				$pwd.parent().removeClass('err-group');
			}

			if( me.$('.readme-group .sprite-bluecheck-active').length == 0 ){
				util.remind(0, '请先同意《全民共进用户协议》');
				return false;
			}
			util.ajax({
				url: '?a=reg',
				data: {
					phone: $.trim($tel.val()),
					code: $.trim($msg.val()),
					pwd: $.trim($pwd.val())
				},
				success: function(res){
					console.log(res);
					if(res.err == 0){
						util.remind(1, '注册成功，请重新登录！');
						location.href = '#/login';
					}
				}
			})
		},
		destroy: function(){
			var me = this;
			var result;
			if (interTime) {
				clearInterval(interTime);
			}
			result = registerPage.superclass.destroy.apply(me, arguments);
			return result;
		}
	});
	module.exports = registerPage;
})