var Users=(function(){
    var config = require('../../config/system.js');
    var crypto = require('crypto');
    var user_list = config.user_list;

    var findUser=function(params){
        for(var i =0;i<user_list.length;i++){
            if(params.username==user_list[i].username && params.password==user_list[i].password){
                return {isUser:true,isPassword:true};
            }
            if(params.username==user_list[i].username && params.password!=user_list[i].password){
                return {isUser:true,isPassword:false};
            }
            if(params.username!=user_list[i].username){
                return {isUser:false,isPassword:false};
            }
        }
    };
    var getMd5 = function(username,password){
        var md5_username=crypto.createHash('md5',username).update('password').digest('hex');
        var md5_password=crypto.createHash('md5',password).update('password').digest('hex');
        return {
            username:md5_username,
            password:md5_password
        };

    };
    return {
        findUser:findUser,
        getMd5:getMd5
    };
})();

module.exports=Users;