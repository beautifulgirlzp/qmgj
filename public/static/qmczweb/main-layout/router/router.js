define(function (require, exports, module){
	//0 只能不登录时候访问
	//1 只能登录时候访问
	//2 无所谓
	var modules = [{
	        title:     '全民共进 - 首页',
	        needLogin: 2,
	        path:      'static/qmczweb/main-layout/index/index',
	        hash:      '#/index',
	        tag: 	   'indexTag',
	        className: 'qmcz-p-index',
	        callback_exit: function(){}
	    },{
	    	title:     '全民共进 - 节目专栏',
	    	needLogin: 2,
	        path:      'static/qmczweb/main-layout/column/column',
	        hash:      '#/column',
	        tag: 	   'columnTag',
	        className: 'qmcz-p-column',
	        callback_exit: function(){}
	    },{
	    	title: 	   '全民共进 - 圈子',
	    	needLogin: 2,
	        path:      'static/qmczweb/main-layout/circle/circle',
	        hash:      '#/circle',
	        tag: 	   'circleTag',
	        className: 'qmcz-p-circle',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 项目列表',
	    	needLogin: 2,
	        path:      'static/qmczweb/main-layout/prolist/prolist',
	        hash:      '#/prolist(/:param1)(/:param2)',
	        tag: 	   'prolistTag',
	        className: 'qmcz-p-prolist',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 项目详情',
	    	needLogin: 2,
	        path:      'static/qmczweb/main-layout/prodetail/prodetail',
	        hash:      '#/prodetail/:param1',
	        tag: 	   'prodetailTag',
	        className: 'qmcz-p-prodetail',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 登录',
	    	needLogin: 0,
	        path:      'static/qmczweb/main-layout/login/login',
	        hash:      '#/login',
	        tag: 	   'loginTag',
	        className: 'qmcz-p-login',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 注册',
	    	needLogin: 0,
	        path:      'static/qmczweb/main-layout/register/register',
	        hash:      '#/register',
	        tag: 	   'registerTag',
	        className: 'qmcz-p-register',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 找回密码',
	    	needLogin: 0,
	        path:      'static/qmczweb/main-layout/findpwd/findpwd',
	        hash:      '#/findpwd',
	        tag: 	   'findpwdTag',
	        className: 'qmcz-p-findpwd',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 个人主页',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/me/memain/memain',
	        hash:      '#/memain',
	        tag: 	   'memainTag',
	        className: 'qmcz-p-me',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 个人信息',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/me/meinfo/meinfo',
	        hash:      '#/meinfo',
	        tag: 	   'meinfoTag',
	        className: 'qmcz-p-me',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 安全设置',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/me/mesafeset/mesafeset',
	        hash:      '#/mesafeset(/:param1)',
	        tag: 	   'mesafesetTag',
	        className: 'qmcz-p-me',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 邮箱认证',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/mailstatus/sendmail/sendmail',
	        hash:      '#/mailstatus/sendmail',
	        tag: 	   'mailstatusTag',
	        className: 'qmcz-p-sendmail',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 邮箱认证',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/mailstatus/mailresult/mailresult',
	        hash:      '#/mailstatus/mailresult',
	        tag: 	   'mailresultTag',
	        className: 'qmcz-p-mailresult',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 关注的圈子',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/me/mecircle/mecircle',
	        hash:      '#/mecircle',
	        tag: 	   'mecircleTag',
	        className: 'qmcz-p-me',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 购买记录',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/me/mebuyrecord/mebuyrecord',
	        hash:      '#/mebuyrecord',
	        tag: 	   'mebuyrecordTag',
	        className: 'qmcz-p-me',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 确认订单',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/order/confirm/confirm',
	        hash:      '#/orderconfirm/:param1/:param2',
	        tag: 	   'orderconfirmTag',
	        className: 'qmcz-p-orderconfirm',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 其他项目',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/order/otherpro/otherpro',
	        hash:      '#/orderotherpro/:param1',
	        tag: 	   'orderotherproTage',
	        className: 'qmcz-p-orderotherpro',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 订单支付',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/order/pay/pay',
	        hash:      '#/orderpay/:param1/:param2/:param3',
	        tag: 	   'orderpayTag',
	        className: 'qmcz-p-orderpay',
	        callback_exit: function(){}
	    },{
	    	title: 		'全民共进 - 订单完成',
	    	needLogin: 1,
	        path:      'static/qmczweb/main-layout/order/result/result',
	        hash:      '#/orderresult/:param1',
	        tag: 	   'orderresultTag',
	        className: 'qmcz-p-orderresult',
	        callback_exit: function(){}
	    }];
    module.exports = modules;
})