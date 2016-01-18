define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var moment = require('gallery/moment/2.0.0/moment');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var headHtml = require('./template/head-html');
	var recordlistHtml = require('./template/recordlist-html');
	// list-table-page
	var Pagination = require('arale/pagination/pagination');
	var recordPage = Widget.extend({
		events:{
			'click .me-buyrecord-box .content-nav-group li': 'recordNavHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html( mainHtml() );
			me.query = {
				type: 2,
				page: 1
			}
			result = recordPage.superclass.render.apply(me, arguments);
			me.initInfoPageFn();
			me.getRecordListFn();
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
		recordNavHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			var _index = $target.data('index');
			$target.siblings().removeClass('active');
			$target.addClass('active');
			me.query.type = _index;
			me.getRecordListFn();
		},
		initPagination: function (totalSize, pageSize){
			var me = this;
			if( me.pagination ){
				me.pagination.destroy();
			}
			me.pagination = new Pagination({
		        "element": me.$('.me-buyrecord-box .list-table-page'),
		        "pageSize": 9,//购买记录 每页9条数据
		        "className":"ui-pagination",
		        "totalSize": totalSize,
		        "activePageNumber": me.query.page,
		        "visiblePageNums": 7
		    });
		    me.pagination.render();
		    me.pagination.on('page', function(pageNumber) {
		        me.query.page = pageNumber;
		        me.getRecordListFn();
		    });
		},
		getRecordListFn: function(){
			var me = this;
			me.$('.me-buyrecord-box .list-table-body').html('<div class="loading"></div>');
			util.ajax({
				url: '?a=userorderlist',
				data: me.query,
				success: function(res){
					if( res.err == 0 ){
						me.$('.me-buyrecord-box .list-table-body').html( recordlistHtml({
							type: me.query.type,
							list: res.data.list
						}) );
						if( me.pagination ){
							me.pagination.destroy();
						}
						if( res.data.list ){
							me.initPagination(res.data.count, res.data.countpage);
						}
					}
				}
			});
		}
	});
	module.exports = recordPage;
})