

    Pagination
    ##====================================##

    引入
    ##====================================##
    //这个是普通分页
    var Pagination = require('base-modules/pagination/pagination');
    //这个是表格分页
    var Pagination = require('base-modules/pagination/pagination2');
  
    
    路径
    ##====================================##
    base-modules/pagination/pagination
    base-modules/pagination/pagination2
    
    
    实例化配置
    ##====================================##
    //初始化分页组件
    var pagination = new Pagination({
        "element": $el, //分页的外层容器 必须
        "pageSize": 10, //分页默认的每页显示数量 必须
        "className":"pagination-table-wrapper"   //默认的样式名称 不传默认pagination-table-wrapper 非必须
        "totalSize": -1, // 要分页的数据总量 非必须
        "activePageNumber": 1, //默认激活的页面不传默认1 非必须
        "visiblePageNums": 7 //最小可见页码 >3,第一页和末页为保留页码  非必须
    });
    //在页面渲染分页组件
    pagination.render(); 
    //页面序号变化时通知表格刷新
    pagination.on('page', function(pageNumber) {
        table.refresh({
            pageNumber: pageNumber // int，页码
        });
    });
    //页面每页显示数量变化时,通知表格刷新  pagination2，拥有此事件
    pagination.on('pagesize', function(pageSize) {
        table.refresh({
            pageSize: pageSize //int,每页显示数量
        });
    });
    
    

    
    
    方法
    ##====================================##
    setTotalSize  //设置分页的总数据,设置总数据后分页内部数据会自行调整
	reset  //重置分页数据 所有数据清零
    getCurrentPageNum //获取当前页码
    destroy //销毁分页
    hide   //隐藏分页
    show   //显示分页
    jump   //跳转到指定页码
    常用方法setTotalSize，如pagination2和表格结合使用时，请求完数据后将返回的数据条数设置到分页数据里,如：
    util.api({
	  url:
	  ...
	  success : function(res){
			if (res.success) {
				pagination.setTotalSize(res.value.totalCount);
			}
	  }
    })


    事件
    ##====================================##
    page 事件 ：
       当分页页码变化(activePageNumber)时，激活page事件，参数{pageNumber:pageNumber},请参考上面例子
    pagesize 事件(pagination2拥有此事件)：
       当分页每页显示条数变化时(pagesize)时，激活pagesize事件,参数 {pageSize:pageSize},请参考上面例子
    
    
    样式
    ##====================================##
	提供默认样式,如需自定义样式请在组件初始化时配置容器顶层样式名称，如：         
    var pagination = new Pagination({
        "element": $el,
        "pageSize": 10, 
        "className":"new-pagination-table"   //自定义分页容器的样式名称为new-pagination-table
    });
    
    
    