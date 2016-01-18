define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var moment = require('gallery/moment/2.0.0/moment');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var headHtml = require('./template/head-html');

	var html1 = require('./template/html1-html');
	var html2 = require('./template/html2-html');
	var html3 = require('./template/html3-html');
	var changepwd = require('./changepwd/changepwd');
	var renzheng = require('./renzheng/renzheng');
	var mailbox = require('./mailbox/mailbox');
	var safesetPage = Widget.extend({
		events: {
			'click .me-safeset-box .content-nav-group li': 'safesetNavHandle'
		},
		render: function( paramArr ){
			var result;
			var me = this;
			me.curPageType = paramArr[0] || 0;
			me.element.html( mainHtml() );
			result = safesetPage.superclass.render.apply(me, arguments);
			me.initInfoPageFn();
			return result;
		},
		initInfoPageFn: function(){
			var me = this;
			util.ajax({
				url: '?a=userinfo',
				data: {uid: 0},
				success: function(res){
					if( res.err == 0 ){
						me._userinfo = res.data;
						me._userinfo.hello = me.getTimeItemFn();
						me._userinfo.login_time = moment(parseInt(me._userinfo.login_time)).format('YYYY-MM-DD HH:mm:ss');
						me.$('.info-head-box').html( headHtml({
							data: me._userinfo
						}) );
						me.$('.me-safeset-box .content-nav-group li').eq(me.curPageType).click();
					}
				}
			})
		},
		getTimeItemFn: function(){
			//早上好（5-9），上午好（9-11），中午好（11-13），下午好（13-19），晚上好（20-5）
			var me = this;
			var _curH = parseInt( moment().format('HH') );
			var _hello = '';
			if(_curH >= 5 && _curH < 9){
				_hello = '早上好'
			}else if(_curH >= 9 && _curH < 11){
				_hello = '上午好'
			}else if(_curH >= 11 && _curH < 13){
				_hello = '中午好'
			}else if(_curH >= 13 && _curH < 19){
				_hello = '下午好'
			}else if(_curH >= 19 || _curH <5){
				_hello = '晚上好'
			}
			return _hello;
		},
		safesetNavHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			var _index = $target.data('index');
			$target.siblings().removeClass('active');
			$target.addClass('active');
			me.curWidget && me.curWidget.destroy();
			
			if(_index == 0){
				me.curWidget = new changepwd({
					element: '.me-safeset-box .content-form-group',
					className: 'safeset-changepwd-group'
				});
				me.curWidget.render();
			}else if(_index == 1){
				me.curWidget = new renzheng({
					element: '.me-safeset-box .content-form-group',
					className: 'safeset-renzheng-group'
				});
				me.curWidget.render();
			}else if(_index == 2){
				me.curWidget = new mailbox({
					element: '.me-safeset-box .content-form-group',
					className: 'safeset-mailbox-group'
				});
				me.curWidget.render();
			}
		},
		destroy: function(){
			var me = this;
			var result;
			me.curWidget && me.curWidget.destroy();
			result = safesetPage.superclass.destroy.apply(me, arguments);
			return result;
		}
	});
	module.exports = safesetPage;
})