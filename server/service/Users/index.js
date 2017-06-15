var Users=(function(){
    var config = require('../../config/system.js');
    var Md5= require('../Md5/index');
    var user_list = config.user_list;
    var findUser=function(params){
        
        var paramsMd5List=Md5.transformToMd5(params.username,params.password);

        for(var i =0;i<user_list.length;i++){
            if(paramsMd5List.username==user_list[i].username && paramsMd5List.password==user_list[i].password){
                return {isUser:true,isPassword:true};
            }
            if(paramsMd5List.username==user_list[i].username && paramsMd5List.password!=user_list[i].password){
                return {isUser:true,isPassword:false};
            }

            if(paramsMd5List.username!=user_list[i].username){
                return {isUser:false,isPassword:false};
            }

        }
    };
    return {
        findUser:findUser
    };
})();

module.exports=Users;