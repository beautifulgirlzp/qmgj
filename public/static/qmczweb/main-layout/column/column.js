define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var columnPage = Widget.extend({
		render: function(){
			var me = this;
        	var result;
        	me.element.html( mainHtml() );
        	util.remind(1, '此为静态展示页，功能正在努力开发中');
        	result = columnPage.superclass.render.apply(this,arguments);
            return result;
		}
	});
	module.exports = columnPage;
})