define(function (require, exports, module){
	var util = {
		errmsg: function(err){
			var errmenu = {
				'10000':'未知错误',
				'10001':'文件不存在',
				'10002':'方法不存在',
				'10003':'参数错误',
				'10004':'服务器错误',
				'10005':'未登陆',
				'10006':'对象不存在',
				'10007':'添加失败',
				'10008':'已经提交过相同数据',
				'10009':'更新错误',
				'10010':'参数验证未通过',
				'10011':'数据不存在',
				'11001':'验证码不能为空',
				'11002':'手机号码不能为空',
				'11003':'验证码不正确',
				'11004':'token不能为空',
				'11005':'手机号码不正确',
				'11006':'密码不能为空',
				'11007':'验证码已经过期',
				'11008':'注册失败',
				'11009':'账号不存在',
				'11010':'操作失败',
				'11011':'缺少报名数据',
				'11012':'用户名密码错误',
				'11013':'账号已经存在',
				'11014':'该账号已经被封停',
				'11015':'报名数据超出范围',
				'11016':'短消息发送失败',
				'11017':'手机号码不正确',
				'11018':'上传图片失败',
				'11019':'已经投过票',
				'11020':'评论内容不能为空',
				'11021':'该联系人被限制评价',
				'11022':'已经点过赞',
				'11023':'已经超出时间范围',
				'11024':'还未报名',
				'11025':'验证码发送失败',
				'11026':'已经认证',
				'11027':'还未认证',
				'11028':'发送邮件失败',
				'11029':'该支持名额已满',
				'11030':'金额不正确',
				'11031':'订单已支付完成'
			}
			return errmenu[err];
		},
		remind:function(remindType,remindText){
            var type = remindType || 0;
            var text = remindText || "保存成功";
            if(type == 0){
                var remind1 = $(".global-remind-1");
                if(remind1.length < 1){
                    $("body").append('<div class ="global-remind-1">'+text+'</div>');
                }else{
                    remind1.text(text);
                    remind1.show();
                }
                setTimeout(function(){
                    $(".global-remind-1").hide();
                },1500);
            }
            if(type == 1){
                var remind2 = $(".global-remind-2");
                if(remind2.length < 1){
                    $("body").append("<div class = 'global-remind-2'>"+text+"</div>");
                }else{
                    remind2.text(text);
                    remind2.show();
                }
                setTimeout(function(){
                    $(".global-remind-2").hide();
                },1500);
            }
        },
        setCookie: function (name, value, seconds){
        	seconds = seconds || 0;    
			var expires = "";
			if (seconds != 0) {
				var date = new Date();
				date.setTime(date.getTime() + (seconds * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + escape(value) + expires + "; path=/";
        },
        getCookie: function(name){
        	var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nameEQ) == 0) {
					return unescape(c.substring(nameEQ.length, c.length));
				}
			}
			return false;
        },
        clearCookie: function(name){
        	this.setCookie(name, "", -1);
        },
        ajax: function(options) {
			var ops = $.extend({
				button: "",
				autoAddUrl: true,
				addUrl: 'http://114.215.184.23/',
				loadId: "",
				type: "get",
				url: "",
				data: {},
				dataType: 'json',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					util.remind(0, '服务器连接异常，请确定您的网络连接状况');
					console.log( 'XMLHttpRequest.status:'
						+ XMLHttpRequest.status
						+ ',XMLHttpRequest.readyState:'
						+ XMLHttpRequest.readyState 
						+ ',textStatus:'
						+ textStatus 
					);
					$(ops.button).removeClass("disabled").removeAttr("disabled");
					$(ops.loadId).html("加载失败，请稍后重试");
				},
				fail: function(e) {
					util.remind(0, '服务器连接异常，请确定您的网络连接状况');
					$(ops.button).removeClass("disabled").removeAttr("disabled");
					$(ops.loadId).html("加载失败，请稍后重试");
				}
			},
			options);
			if ($(ops.button).length > 0 && ($(ops.button).is(":disabled") || $(ops.button).hasClass("disabled"))) {
				return false;
			}
			$(ops.button).addClass("disabled").attr("disabled", true);
			$.ajax({
				type: ops.type,
				url: ops.autoAddUrl?(ops.addUrl + ops.url):ops.url,
				// url: '/static/ng-modules/arale/util/'+ ops.url.replace('?a=','') +'.json',
				data: ops.data,
				dataType: ops.dataType,
				success: function(res) {
					$(ops.button).removeClass("disabled").removeAttr("disabled");
					if( res.err != 0 ){
						if(res.errcode == '10000'){
							util.remind(0, res.desc );
						}else{
							util.remind(0, util.errmsg(res.errcode));
						}
					}
					typeof ops.success !== "undefined" && ops.success.call(this, res);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$(ops.button).removeClass("disabled").removeAttr("disabled");
					typeof ops.error !== "undefined" && ops.error.call(this, XMLHttpRequest, textStatus, errorThrown);
				},
				fail: function(e) {
					$(ops.button).removeClass("disabled").removeAttr("disabled");
					typeof ops.fail !== "undefined" && ops.fail.call(this, e);
				}
			});
			return this;
		},
		getCidData: function(){
			var me = this;
        	if( $('input[name="projStorage"]').length > 0 ){
        		var projData = $('input[name="projStorage"]').val();
        		return JSON.parse(projData);
        	}else{
        		util.ajax({
					url: '?a=projclass',
					success: function (res){
						if( res.err == 0 ){
							var _string = JSON.stringify(res.data.proj_class);
							$('body').append('<input type="hidden" name="projStorage" value="'+_string+'">');
							return JSON.parse( _string );
						}
					}
				});
        	}
		}
	}
	return util;
})