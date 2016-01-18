define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var payPage = Widget.extend({
		events: {
			'click .btn-pay': 'toPayTheOidHandle',
			'click .pay-way': 'checkpaywayHandle'
		},
		render: function(prarmarr){
			var result;
			var me = this;
			me.ordernums = prarmarr[0].replace(/oid=/,'');
			me.ordername = prarmarr[1].replace(/name=/,'');
			me.ordermoney = prarmarr[2].replace(/money=/,'');
			me.$el = this.element;
			me.$el.html('<div class="loading"></div>');
			result = payPage.superclass.render.apply(this, arguments);
			me.initPayPageDataFn();
			return result;
		},
		checkpaywayHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if( $target.hasClass('active') ){
				return;
			}else{
				me.$('.pay-way').removeClass('active');
				$target.addClass('active');
			}
		},
		initPayPageDataFn: function(){
			var me = this;
			me.$el.html( mainHtml({
				oid: me.ordernums,
				name: me.ordername,
				money: me.ordermoney
			}) );
		},
		toPayTheOidHandle: function(){
			var me = this;
			util.ajax({
				url: '?a=projordercomplete',
				data: {
					oid: me.ordernums
				},
				success: function(res){
					if( res.err == 0 ){
						util.remind(1, '订单支付成功');
						location.href = '#/orderresult/oid='+me.ordernums;
					}
				}
			});
		}
	});
	module.exports = payPage;
})