define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var maininfoHtml = require('./template/maininfo-html');
	var leftSupportHtml = require('./template/leftbox-html');
	var page1Html = require('./template/page1-html');
	var page2Html = require('./template/page2-html');
	var page3Html = require('./template/page3-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var prodetailPage = Widget.extend({
		events: {
			'click .detail-nav-box li': 'detailNavHandle',
			'click .btn-support': 'ahrefToSupportHandle'
		},
		render: function(paramArr){
			var result;
			var me = this;
			me.proId = paramArr[0];
			me.element.html( mainHtml() );
			me.getProDetailDataFn();
			result = prodetailPage.superclass.render.apply(me, arguments);
			return result;
		},
		getProDetailDataFn: function(){
			var me = this;
			util.ajax({
				url: '?a=projinfo',
				data: {
					id: me.proId
				},
				success: function(res){
					if( res.err == 0 ){
						me.projinfo = res.data;
						me.$('.detail-maininfo-box').html( maininfoHtml({
							projinfo: res.data,
							projclass: util.getCidData()
						}) );
						me.$('.detail-stepsinfo-box .stepsinfo-left').html( page1Html({
							projinfo: me.projinfo
						}) );
						me.$('.detail-stepsinfo-box .stepsinfo-right').html( leftSupportHtml({
							projinfo: me.projinfo
						}) );
						setTimeout(function(){
							me.$('.info-words').dotdotdot();
						},51);
					}
				}
			});
		},
		detailNavHandle: function (e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			var _index = $target.data('index');
			$target.siblings().removeClass('active');
			$target.addClass('active');
			if(_index == 0){
				me.$('.detail-stepsinfo-box .stepsinfo-left').html( page1Html({
					projinfo: me.projinfo
				}) );
			}else if(_index == 1){
				if( !me.projhistory ){
					util.ajax({
						url: '?a=projhistory',
						data:{
							id: me.proId
						},
						success: function (res){
							if(res.err == 0){
								me.projhistory = res.data.list;
								me.$('.detail-stepsinfo-box .stepsinfo-left').html( page2Html({
									projhistory: me.projhistory
								}) );
							}
						}
					})
				}else{
					me.$('.detail-stepsinfo-box .stepsinfo-left').html( page2Html({
						projhistory: me.projhistory
					}) );
				}
			}else if(_index == 2){
				me.$('.detail-stepsinfo-box .stepsinfo-left').html( page3Html({

				}) );
			}
		},
		ahrefToSupportHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('disabled')){
				return;
			}
			window.scrollTo(0,985)
		}
	});
	module.exports = prodetailPage;
})