define(function (require,exports,module){
	var Widget = require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var mailresultPage = Widget.extend({
		events: {

		},
		render: function(){
			var me = this;
			var result;
			me.element.html(mainHtml());
			result = mailresultPage.superclass.render.apply(me, arguments);
			me.countMinFn();
			return result;
		},
		countMinFn: function(){
			var me = this;
			var curTime = 5;
			var interTime;
			function myTime (argument) {
				if(curTime == 0){
					clearInterval(interTime);
					location.href = '#/memain';
				}else{
					me.$('.count-min').html(curTime);
					curTime--;
				}
			}
			if( me.interTime ){
				clearInterval(me.interTime);
			}
			me.interTime = setInterval( myTime ,1000);
		},
		destroy: function(){
			var me = this;
			var result;
			if( me.interTime ){
				clearInterval(me.interTime);
			}
			result = mailresultPage.superclass.destroy.apply(me,arguments);
			return result;
		}
	});
	module.exports = mailresultPage;
})