/**
 * Created by ucs_chenshaoyi on 2017/5/24.
 */
// 登录模块
var Login=(function(){
    return {
        do:function(action,params,req,res){
            var login = require("../../service/Login");
            if(action=='login'){
                login.checkLogin(params,req,res);
            }

            if(action=='logout'){
                login.logout(params,req,res);
            }
        }
    }
})()
module.exports=Login;

