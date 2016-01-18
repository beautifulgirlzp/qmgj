define(function (require, exports, module){
	var mainHtml = require('./template/main-html');
	var slideImg = require('./slideImg/slideImg');
	var hotproHtml = require('./template/hotpro-html');
	var newproHtml = require('./template/newpro-html');
	var unitHtml = require('./template/unit-html');
	var Widget=require('arale/widget/1.1.1/widget');
	var util = require('arale/util/util');
	var indexPage = Widget.extend({
		events: {
			'click .pro-left-nav li': 'leftNavLiHandle'
		},
        render: function (){
        	var me = this;
        	var result;
        	me.element.html( mainHtml() );
        	result = indexPage.superclass.render.apply(this,arguments);
        	me.initIndexDataFn();
            return result;
        },
        initIndexDataFn: function(){
        	var me = this;
        	util.ajax({
				url: '?a=indexinfo',
				success: function(res){
					if(res.err == 0){
						console.log(res.data);
						me.initSlideImg( res.data.slides );
						me.initHotProFn( res.data.hot );
						me.initNewProFn( res.data.new );
						me.initUnitFn( res.data.unit );
						setTimeout(function(){
							me.$('.pro-ject .pro-ject-word').dotdotdot();
						},51);
					}
				}
			});
        },
        initUnitFn: function(unitpro){
        	var me = this;
        	me.$('.index-teams-box .team-img-box').html( unitHtml({unit: unitpro}) );
        },
        initNewProFn: function(newpro){
        	var me = this;
        	me.$('.index-maintv-box .row').html( newproHtml({
    			newpro: newpro,
    			projclass: util.getCidData()
    		}) );
        },
        initHotProFn: function(hotpro){
        	var me = this;
        	me.$('.index-hotpro-box .row').html( hotproHtml({
    			hotpro: hotpro,
    			projclass: util.getCidData()
    		}) );
        },
		initSlideImg: function (slideArr){
			var me = this;
			if( slideArr.length > 0 ){
				var slideimgArr = [];
				_.each(slideArr,function(item,index){
					slideimgArr.push({
						imageUrl: item.img,
						forwardUrl: '#/prodetail/'+item.id,
						isNewPage: false
					});
				});
				new slideImg({
					gap: 5000,
					box: '.index-slide-box .slide-img-box',
					imgs: slideimgArr
				});
			}
		},
		leftNavLiHandle: function (e){
			var me = this;
			var $target = $(e.currentTarget);
			var _ant = $target.data('id');
			me.$('.hot-pro-box .pro-info').hide();
			if(me.$('.hot-pro-box .left-nav-li-'+_ant).length > 0){
				me.$('.hot-pro-box .left-nav-li-'+_ant).show();
			}else{
				me.$('.hot-pro-box .left-nav-li-none').show();
			}
			me.$('.pro-left-nav li').removeClass('active');
			me.$('.pro-more a').attr('href','#/prolist/' + _ant);
			$target.addClass('active');
		}
	});
	module.exports = indexPage;
})