var Route = (function() {
	var init = function(router){
		router.use(function(req,res,next){
			next();
		});

		//登录状态判断
        router.use('/', function(req, res, next){
            var isLogined=checkLoginSession(req);
            var url=req.url;
            var config=require("../config/system");
            var isWhiteNameList=false;
            //url列表
            // *.html、/api/DownloadFile/downnload/

            var dynamicUrlPattern=/\/api(\/)*\w+/g;
            var dynamicUrlFlag=dynamicUrlPattern.test(url);

            if(dynamicUrlFlag){
                //白名单数组
                for(var i=0;i<config.white_name_list.length;i++){
                    if(url==config.white_name_list[i]){
                        isWhiteNameList=true;
                    }
                }

                if(!isWhiteNameList){
                    //如果请求的是非静态资源，直接跳过，让其在具体业务中返回登录判断
                    if(dynamicUrlFlag){
                        return next();
                    }else{
                        if(isLogined){
                            //去到具体业务页面
                            res.redirect('/upload.html');
                        }else{
                            res.redirect("/login.html");
                        }
                    }
                }
            }else{
                if(url=="/login.html"||url=="/logout.html"||url=="/upload.html"){
                    if(isLogined){
                        //去到具体业务页面
                        if(url!="/upload.html"){
                            res.redirect('/upload.html');
                        }else{
                            return next();
                        }
                    }else{
                        if(url!="/login.html"){
                            res.redirect("/login.html");
                        }else{
                            return next();
                        }
                    }
                }else{
                    return next();
                }
            }
        });

		router.use('/api/:module/:action',function(req,res,next){
		    console.log("------------------------route.js start-------------------------------------");
		    console.log("url:");
		    console.log(req.url);
            console.log("params:");
            console.log(req.params);//url解析

            console.log("query:");
            console.log(req.query);//get方法的参数

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

	var checkLoginSession=function(req){
        var sess = req.session;
        try{
            var loginUser = sess.loginUser;
        }catch(e){
            loginUser='';
        }
        var isLogined = !!loginUser;

        return isLogined;
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