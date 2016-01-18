define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var circlePage = Widget.extend({
		events: {

		},
		render: function(){
			var result;
			this.element.html( mainHtml() );
			util.remind(1, '此为静态展示页，功能正在努力开发中');
			result = circlePage.superclass.render.apply(this, arguments);
			return result;
		},
		destroy: function(){
			var result;
			result = circlePage.superclass.destroy.apply(this, arguments);
			return result;
		}
	});
	module.exports = circlePage;
})