define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var confirmPage = Widget.extend({
		events: {
			'click .btn-topay': 'submitHandle'
		},
		render: function(paramarr){
			var result;
			var me = this;
			me.$el = this.element;
			me.ordernums = paramarr[0];
			me.spid = paramarr[1].replace(/spid/,'');
			result = confirmPage.superclass.render.apply(this,arguments);
			me.initPageDataFn();
			return result;
		},
		initPageDataFn: function(){
			var me = this;
			util.ajax({
				url: '?a=projorderinfo',
				data: {
					id: me.ordernums,
					spid: me.spid
				},
				success: function(res){
					if(res.err == 0){
						me.ordername = res.data.name;
						me.ordermoney = res.data.rprice;
						me.$el.html( mainHtml({pro:res.data}) )
					}
				}
			});
		},
		submitHandle: function(){
			var me = this;
			util.ajax({
				url: '?a=projorderadd',
				data:{
					id: me.$('input[name="id"]').val(),
					name: me.$('input[name="name"]').val(),
					spid: me.spid,
					desc: me.$('textarea[name="desc"]').val(),
					rprice: me.$('input[name="rprice"]').val()
				},
				success: function(res){
					if( res.err == 0 ){
						location.href = '#/orderpay/oid='+res.data.oid+'/name='+ me.ordername +'/money='+me.ordermoney;
					}
				}
			})
		}
	});
	module.exports = confirmPage;
})