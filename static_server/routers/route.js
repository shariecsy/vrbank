var Route = (function() {
	var init = function(router){
		router.use(function(req,res,next){
			next();
		});

		router.use('/api/:module/:action',function(req,res,next){
		    console.log("------------------------route.js start-------------------------------------");
            console.log("params:");
            console.log(req.params);//url解析
            console.log("body:");
            console.log(req.body);//post方法的参数
			console.log("------------------------route.js end-------------------------------------");
			try{
				var api = require('../api/'+req.params.module);
				if(api.do){
                    api.do(req.params.action,req.body,req,res);
                }else{
                    res.status(404).send('这个页面不存在呀');
                }
			}catch(e){
                console.error(e);
                res.status(404).send('这个页面不存在呀');
			}
		});
	};

	return {
		use:function(router){
			// console.info(router);
			init(router);
			return router;
		}
	}
})();

module.exports = Route;