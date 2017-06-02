/**
 * Created by ucs_chenshaoyi on 2017/5/24.
 */
var Login = (function(){
    var users=require('../Users/index.js');

    var checkLogin=function(params,req,res){
        var user=users.findUser(params);

        if(user.isUser&&user.isPassword){
            req.session.regenerate(function(err) {
                if(err){
                    res.json({code: 2, msg: '登录失败',url:''});
                    res.end();
                }

                req.session.loginUser = params.username;
                res.json({code: 1, msg: '登录成功',url:'upload.html'});
                res.end();
            });
        }

        if(user.isUser&&!user.isPassword){
            res.json({code: 0, msg: '密码不正确',url:''});
            res.end();
        }

        if(!user.isUser){
            res.json({code: 0, msg: '帐号不存在',url:''});
            res.end();
        }
    };

    var logout=function(params,req,res){
        req.session.loginUser = null;
        req.session.destroy(function(err) {
            if (err) {
                res.json({code: 2, msg: '退出登录失败'});
                return;
            }
            res.clearCookie("skey");
            res.json({code:1,msg:"退出登录成功",url:"login.html"});
            res.end();
        });
    };

    return {
        checkLogin:checkLogin,
        logout:logout
    }
})();
module.exports=Login;