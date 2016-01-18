define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var resultPage = Widget.extend({
		evnets: {

		},
		render: function( paramArr ){
			var result;
			var me = this;
			me.ordernums = paramArr[0].replace(/oid=/,'');
			this.element.html(mainHtml({
				oid: me.ordernums
			}));
			result = resultPage.superclass.render.apply(this, arguments);
			return result;
		}
	});
	module.exports = resultPage;
})