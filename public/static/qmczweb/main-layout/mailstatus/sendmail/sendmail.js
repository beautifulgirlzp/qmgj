define(function (require,exports,module){
	var Widget = require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var curTime = 119;
	var curTimeIsCount = false;
	var interTime = null;
	function myTime(){
		if(curTime == 0){
			clearInterval(interTime);
			$('.qmcz-p-sendmail .btn-resend').html('重新发送').removeClass('gray');
			curTime = 119;
			curTimeIsCount = false;
		}else{
			$('.qmcz-p-sendmail .btn-resend').html(curTime+'s后重新发送').addClass('gray');
			curTime--;
		}
	}
	var sendmailPage = Widget.extend({
		events: {
			'click .btn-resend': 'resendMailHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html(mainHtml());
			result = sendmailPage.superclass.render.apply(me, arguments);
			return result;
		},
		resendMailHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('gray')){
				return;
			}
			if( curTimeIsCount ){
				return;
			}
			if( interTime ){
				clearInterval( interTime );
			}
			util.ajax({
				url: '?a=rmailsend',
				success: function(res){
					if(res.err == 0){
						util.remind(1, '重新发送成功，请注意查收！');
						$target.addClass('gray');
						curTime = 119;
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
				clearInterval(interTime);
			}
			result = sendmailPage.superclass.destroy.apply(me,arguments);
			return result;
		}
	});
	module.exports = sendmailPage;
})