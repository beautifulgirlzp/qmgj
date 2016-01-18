define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var FormValidator = require('arale/formvalidator/formvalidator');
	var mainHtml = require('./template/main-html');
	var contentHtml = require('./template/content-html');
	var mailBox = Widget.extend({
		events: {
			'click .control-btn': 'mailBtnHandle',
			'click .mailbox-group .mail-btn-change': 'showMailGroupHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html(mainHtml());
			result = mailBox.superclass.render.apply(me, arguments);
			me.showMailInfoFn();
			return result;
		},
		showMailInfoFn: function(){
			var me = this;
			util.ajax({
				url: '?a=rmailinfo',
				success: function(res){
					if(res.err == 0){
						$('#mailbox-group').html( contentHtml(res.data) );
						me.initFormValidator();
					}
				}
			})
		},
		showMailGroupHandle: function(){
			var me = this;
			me.$('.mail-box-controls').show();
			me.$('.mail-success-group').hide();
		},
		initFormValidator: function(){
			var me = this;
			me.validator = new FormValidator('#mailbox-group',{
				onSubmit: false,
                inputs:["mailbox",'curpwd'],
                rules: {
                    curpwd: 'required|minlength:6',
                    mailbox: 'required|email'
                },
                messages: {
                    curpwd:{
                        required:"密码不能为空",
                        minlength:"密码长度不能小于6位"
                    },
                    mailbox:{
                    	required:"邮箱不能为空",
                        email:"请输入正确的邮箱格式"
                    }                
                }
            });
            me.validator.launched();
		},
		mailBtnHandle: function(){
			var me = this;
			if( me.validator.result() ){
				util.ajax({
					url: '?a=rmailadd',
					success: function(res){
						if( res.err == 0 ){
							location.href = '#/mailstatus/sendmail';
						}
					}
				});
			}
		}
	});
	module.exports = mailBox;
})