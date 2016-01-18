define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var FormValidator = require('arale/formvalidator/formvalidator');
	var util = require('arale/util/util');
	var idCards = require('arale/idcard/idcard');
	var mainHtml = require('./template/main-html');
	var contentHtml = require('./template/content-html');
	var renzheng = Widget.extend({
		events: {
			'click .control-btn': 'renzhengBtnHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html(mainHtml());
			result = renzheng.superclass.render.apply(me, arguments);
			me.showInfoFn();
			return result;
		},
		showInfoFn: function(){
			var me = this;
			util.ajax({
				url: '?a=rnameinfo',
				success: function (res){
					if(res.err == 0){
						$('#renzheng-group').html( contentHtml(res.data) );
						me.initFormValidator();
					}
				}
			});
		},
		initFormValidator: function(){
			var me = this;
			me.validator = new FormValidator('#renzheng-group',{
				onSubmit: false,
                inputs:["username",'ids'],
                rules: {
                    username: 'required|minlength:2',
                    ids: 'required|check18IdCard'
                },
                messages: {
                    username:{
                        required:"姓名不能为空",
                        minlength:"姓名长度不能小于2位"
                    },
                    ids:{
                    	required:"身份证号不能为空",
                        check18IdCard:"请输入正确的身份证号"
                    }                
                }
            });
            me.validator.extendRules({
            	check18IdCard: function(fieldName, value){
            		return idCards.check18IdCard(value);
            	}
            });
            me.validator.launched();
		},
		renzhengBtnHandle: function(){
			var me = this;
			if( me.validator.result() ){
				util.ajax({
					url: '?a=rnameadd',
					data: {
						name: me.$('input[name="username"]').val(),
						code: me.$('input[name="ids"]').val()
					},
					success: function(res){
						if( res.err == 0 ){
							console.log(res);
							util.remind(1, '实名认证成功');
							location.href = '#/memain'
						}
					}
				});
			}
		}
	});
	module.exports = renzheng;
})