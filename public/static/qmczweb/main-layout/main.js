define(function (require, exports, module){
	var Router = require('./router/router');
	var util = require('arale/util/util');
	window.util = util;
	var headHtml = require('./template/header-html');
	var indexPage = {
		router: function(){
			var me = this;
			_.each( Router, function(item,index){
		    	Path.map( item.hash ).enter(function(){
		    		var pathMe = this;
		    		var isLogin = util.getCookie('isLogin_qmcz');
		    		window.scrollTo(0,0);
		    		if( item.needLogin === 2 ){
		    			seajs.use( item.path ,function( a ){
			    			if( !me.curWidget ){
				    			me.curWidget = new a({
				    				element: '#page-container',
				    				className: 'qmcz-g-body ' + item.className
				    			});
			    			}
			    			$('#page-container').attr({class: 'qmcz-g-body ' + item.className}).html('<div class="loading"></div>');
			    			var paramArr = [];
			    			for(var i = 1;i <= 3;i++){
			    				if(pathMe.params["param"+i] != undefined){
			    					paramArr.push(pathMe.params["param"+i]);
			    				}
			    			}
				    		me.curWidget.render( paramArr );
				    	});
		    		}else if( item.needLogin === 0 ){
		    			if( isLogin === 'token_t_qmcz' ){
							location.href = '#/memain';
		    			}else{
		    				seajs.use( item.path ,function( a ){
				    			if( !me.curWidget ){
					    			me.curWidget = new a({
					    				element: '#page-container',
					    				className: item.className
					    			});
				    			}
				    			$('#page-container').attr({class: 'qmcz-g-body ' + item.className}).html('<div class="loading"></div>');
					    		me.curWidget.render([
					    			pathMe.params["param1"] || "",
					    			pathMe.params["param2"] || "",
					    			pathMe.params["param3"] || ""
					    		]);
					    	});
		    			}
		    		}else if( item.needLogin === 1 ){
		    			if( isLogin !== 'token_t_qmcz' ){
		    				util.clearCookie('isLogin_qmcz');
							util.clearCookie('user_qmcz');
							util.remind(1, '请先进行账户登录');
							location.href = '#/login';
		    			}else{
		    				seajs.use( item.path ,function( a ){
				    			if( !me.curWidget ){
					    			me.curWidget = new a({
					    				element: '#page-container',
					    				className: item.className
					    			});
				    			}
				    			$('#page-container').attr({class: 'qmcz-g-body ' + item.className}).html('<div class="loading"></div>');
					    		me.curWidget.render([
					    			pathMe.params["param1"] || "",
					    			pathMe.params["param2"] || "",
					    			pathMe.params["param3"] || ""
					    		]);
					    	});
		    			}
		    		}
		    	})
		    	.to(function(){
			    	$("title").html(item.title);
			    	$('#header-row-box').html(
			    		headHtml({
			    			isLogin: util.getCookie('isLogin_qmcz'),
			    			name: util.getCookie('user_qmcz')
			    		})
			    	);
			    	$(".qmcz-g-header .left-nav-box li").removeClass('active');
			    	$(".qmcz-g-header .left-nav-box li."+item.tag).addClass('active');
			    }).exit(function(){
			    	me.curWidget && me.curWidget.destroy();
			    	me.curWidget = null;
			    });
		    });
			Path.rescue(function(){
			    $("#page-container").html('<h3 style="text-align: center;margin-top: 200px;">您查找的信息不存在 .>_<. 请联系客服姐姐</h3>');
			});
			Path.root("#/index");
			Path.listen();
		},
		getGlobalData: function (){
			var me = this;
			util.ajax({
				url: '?a=projclass',
				success: function (res){
					if( res.err == 0 ){
						var _string = JSON.stringify(res.data.proj_class);
						$('body').append("<input type='hidden' name='projStorage' value='"+_string+"'>");
					}
				}
			});
		},
		eventsFn: function(){
			$('body').on('keypress','#qmcz-g-searchinput',function(event){
	            if(event.keyCode == "13"){
	            	var _inputval = $('#qmcz-g-searchinput').val();
	            	if( _inputval != '' ){
	            		location.href = "#/prolist/0/key" + _inputval;
	            	}
	            }
	        });
	        $("#header-row-box").on('click','.qmcz-p-logout',function(e){
				util.ajax({
					url: '?a=logout',
					success: function(res){
						if( res.err == 0 ){
							util.remind(1, '退出成功！');
							util.clearCookie('isLogin_qmcz');
							util.clearCookie('user_qmcz');
							location.href = '#/login';
						}
					}
				});
			});
		},
		fixedFooterFn: function(){
			var $dom = $('#page-container');
			var mT = parseInt( $dom.css("marginTop") ),
			mB = parseInt( $dom.css("marginBottom") );
			var h = parseInt($(window).height()) - 169 - mT - mB ;
			$dom.css("minHeight",h + "px");
		},
		init: function (){
			var me = this;
			me.router();
			me.getGlobalData();
			me.eventsFn();
			me.fixedFooterFn();
		}
	};
	module.exports = indexPage;
})