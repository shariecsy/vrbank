var Users=(function(){
    var config = require('../../config/system.js');
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
    return {
        findUser:findUser
    };
})();

module.exports=Users;