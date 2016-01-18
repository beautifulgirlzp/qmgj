define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var contentHtml = require('./template/content-html');
	var Pagination = require('arale/pagination/pagination');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var prolistPage = Widget.extend({
		events: {
			'click .sift-cid span': 'cidClickHandle',
			'click .sift-type span': 'typeClickHandle',
			'click .sift-order span': 'orderClickHandle'
		},
		render: function( paramArr ){
			var result;
			var me = this;
			me.query = {
				page: 1,
				type: 0,
				cid: 0,
				order: 0
			}
			me.query.cid = paramArr[0];
			if( paramArr.length > 1 ){
				me.query.keyword = paramArr[1].replace(/key/,'');
				$('#qmcz-g-searchinput').val(me.query.keyword);
			}
			me.element.html( mainHtml({
				query: me.query,
				cidData: util.getCidData()
			}) );
			result = prolistPage.superclass.render.apply(me, arguments);
			me.getprojlistData();
			return result;
		},
		cidClickHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			me.$('.sift-cid span').removeClass('active');
			$target.addClass('active');
			me.query.cid = $target.data('cid');
			me.getprojlistData();
		},
		typeClickHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			me.$('.sift-type span').removeClass('active');
			$target.addClass('active');
			me.query.type = $target.data('type');
			me.getprojlistData();
		},
		orderClickHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if($target.hasClass('active')){
				return;
			}
			me.$('.sift-order span').removeClass('active');
			$target.addClass('active');
			me.query.order = $target.data('order');
			me.getprojlistData();
		},
		getprojlistData: function(){
			var me = this;
			me.$('.prolist-show-box').html('<div class="loading"></div>');
			util.ajax({
				url: '?a=projlist',
				data: me.query,
				success: function(res){
					if(res.err == 0){
						me.$('.prolist-show-box').html(contentHtml({
							list: res.data.list,
							projclass: util.getCidData()
						}));
						setTimeout(function(){
							me.$('.pro-ject .pro-ject-word').dotdotdot();
						},51);
						if(me.pagination){
							me.pagination.destroy();
						}
						if( res.data.list.length > 0 ){
							me.initPagination(res.data.count,res.data.countpage);
						}
					}
				}
			})
		},
		initPagination: function (size, per){
			var me = this;
			me.pagination = new Pagination({
		        "element": $('#prolist-page-wraper'),
		        "pageSize": 9,//每页3*3个
		        "className":"ui-pagination",
		        "totalSize": size,
		        "activePageNumber": me.query.page,
		        "visiblePageNums": 7
		    });
		    me.pagination.render();
		    me.pagination.on('page', function(pageNumber) {
		        me.query.page = pageNumber;
		        me.getprojlistData();
		    });
		}
	});
	module.exports = prolistPage;
})