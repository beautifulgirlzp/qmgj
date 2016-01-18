define(function (require, exports, module){
	var Widget = require('arale/widget/1.1.1/widget');
	var moment = require('gallery/moment/2.0.0/moment');
	var util = require('arale/util/util');
	var mainHtml = require('./template/main-html');
	var headHtml = require('./template/head-html');
	var contentHtml = require('./template/content-html');
	var infoPage = Widget.extend({
		events: {
			'change #file-input': 'dealFileImgHandle',
			'click .checkbox-control span.sprite': 'checkboxHandle',
			'click .radio-control span.sprite': 'radioboxHandle',
			'click .control-btn': 'submitHandle'
		},
		render: function(){
			var me = this;
			var result;
			me.element.html( mainHtml() );
			result = infoPage.superclass.render.apply(me, arguments);
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
						me.$('.right-content-box').html( contentHtml({
							data: me._userinfo,
							projclass: util.getCidData()
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
		dealFileImgHandle: function(e){
			var me = this;
			var selectFile = $(e.currentTarget).get(0).files[0];
			if(selectFile){
				me.$('.me-info-box img.user-headimg').hide();
				$(e.currentTarget).removeClass('file-input');
				me.$('.headimg-control').addClass('hasLoadimg');
			}else{
				me.$('.me-info-box img.user-headimg').show();
				$(e.currentTarget).addClass('file-input');
				me.$('.headimg-control').removeClass('hasLoadimg');
			}
		},
		checkboxHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			if( $target.hasClass('sprite-redcheck-gray') ){
				if( me.$('.checkbox-control .sprite-redcheck-active').length >= 3 ){
					util.remind(0, '关注圈子最多可选3个！');
					return;
				}else{
					$target.removeClass('sprite-redcheck-gray').addClass('sprite-redcheck-active');
				}
			}else{
				$target.removeClass('sprite-redcheck-active').addClass('sprite-redcheck-gray');
			}
		},
		radioboxHandle: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			me.$('.radio-control span.sprite-blueradio-active').removeClass('sprite-blueradio-active').addClass('sprite-blueradio-gray');
			$target.addClass('sprite-blueradio-active').removeClass('sprite-blueradio-gray');
		},
		submitHandle: function(e){
			var me = this;
			var _circleid = [];
			var _username = me.$('input[name="name"]');
			var _radioboxNode = me.$('.radio-control .sprite-blueradio-active');
			var _checkboxNodes = me.$('.checkbox-control .sprite-redcheck-active');
			if( _username.val() == '' ){
				util.remind(0,'请输入昵称');
				return;
			}

			if( _radioboxNode.length == 0 ){
				util.remind(0, '请选择性别！')
				return;
			}
			me.$('input[name="sex"]').val( _radioboxNode.data('sex') );

			if( _checkboxNodes.length == 0 ){
				util.remind(0, '请选择关注的圈子！')
				return;
			}
			_.each(_checkboxNodes,function(item,index){
				_circleid.push(  $(item).data('id') );
			});
			me.$('input[name="quanzi"]').val( _circleid.toString() );
			var _formData = new FormData($("#meinfo-form")[0]);
			$.ajax({
				url: '?a=useredit',
				type: 'post',
				processData : false,  
                contentType : false,  
				data: _formData,
				success: function(res){
					if( res.err == 0 ){
						util.remind(1, '个人信息编辑成功！');
						location.href = '#/memain';
					}else{
						util.remind(0, util.errmsg(res.errcode));
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					util.remind(0, '服务器连接异常，请确定您的网络连接状况');
				}
			})
		}
	});
	module.exports = infoPage;
})