define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var FormValidator = require('arale/formvalidator/formvalidator');
	var mainHtml = require('./template/main-html');
	var util = require('arale/util/util');
	var curTime = 59;
	var curTimeIsCount = false;
	var interTime = null;
	function myTime(){
		if(curTime == 0){
			clearInterval(interTime);
			$('.code-nums').html('点击获取验证码');
			curTime = 59;
			curTimeIsCount = false;
		}else{
			$('.code-nums').html(curTime+'s后重新发送');
			curTime--;
		}
	}
	var changePwd = Widget.extend({
		events: {
			'click .control-btn': 'pwdBtnHandle',
			'click .code-nums': 'sendMsgHandle'
		},
		render: function(){
			var me = this;
			var result;
			var userphone = $('input[name="qmcz-g-userphone"]').val();
			userphone = userphone.substring(0,3)+"****"+userphone.substring(3,7);
			me.element.html(mainHtml({phoneMsk: userphone}));
			result = changePwd.superclass.render.apply(me, arguments);
			me.initFormValidator();
			return result;
		},
		initFormValidator: function(){
			var me = this;
			me.validator = new FormValidator('#changepwd-group',{
				onSubmit: false,
                inputs:['newpwd','phonecode'],
                rules: {
                    curpwd: 'required|minlength:6',
                    newpwd: 'required|minlength:6',
                    phonecode: 'required|minlength:4|maxlength:4'
                },
                messages: {
                    curpwd:{
                        required:"密码不能为空",
                        minlength:"密码长度不能小于6位"
                    },
                    newpwd:{
                    	required:"密码不能为空",
                        minlength:"密码长度不能小于6位"
                    },
                    phonecode: {
                    	required: '验证码不能为空',
                    	minlength: '验证码长度为4位字符',
                    	maxlength: '验证码长度为4位字符'
                    }
                }
            });
            me.validator.launched();
		},
		pwdBtnHandle: function(){
			var me = this;
			if( me.validator.result() ){
				util.ajax({
					url: '?a=resetpwd',
					data: {
						phone: $('input[name="qmcz-g-userphone"]').val(),
						pwd: me.$('input[name="curpwd"]').val(),
						newpwd: me.$('input[name="newpwd"]').val(),
						code: me.$('input[name="phonecode"]').val()
					},
					success: function (res){
						if(res.err == 0){
							//clear cookie status
							util.clearCookie('isLogin_qmcz');
							util.clearCookie('user_qmcz');
							util.remind(1, '密码重置成功，请重新登录！');
							location.href = '#/login';
						}
					}
				})
			}
		},
		sendMsgHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if( curTimeIsCount ){
				return;
			}
			if( interTime ){
				clearInterval( interTime );
			}

			util.ajax({
				url: '?a=getcode',
				data: {
					phone: $('input[name="qmcz-g-userphone"]').val(),
					type: 1
				},
				success: function(res){
					if( res.err == 0 ){
						util.remind(1 ,'短信验证码发送成功');
						// zlt
						me.$('input[name="phonecode"]').val( res.data.code );
						curTime = 59;
						curTimeIsCount = true;
						interTime = setInterval( myTime ,1000);
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
			result = changePwd.superclass.destroy.apply(me, arguments);
			return result;
		}
	});
	module.exports = changePwd;
})