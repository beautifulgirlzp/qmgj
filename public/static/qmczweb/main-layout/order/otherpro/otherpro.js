define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var otherPage = Widget.extend({
		events: {},
		render: function(paramarr){
			var result;
			var me = this;
			me.$el = this.element;
			me.ordernums = paramarr[0];
			result = otherPage.superclass.render.apply(this,arguments);
			me.initPageDataFn();
			return result;
		},
		initPageDataFn: function(){
			var me = this;
			util.ajax({
				url: '?a=projinfo',
				data: {
					id: me.ordernums
				},
				success: function(res){
					if(res.err == 0){
						me.$el.html( mainHtml({pro:res.data}) )
					}
				}
			});
		}
	});
	module.exports = otherPage;
})