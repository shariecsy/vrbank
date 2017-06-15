var CheckUpdate=(function(){
    return {
        do:function(action,params,req,res){
            var cu=require("../../service/CheckUpdate");
            if(action=="check"){
                cu.check(params,req,res);
            }

            if(action=="checkVersion"){
                cu.checkVersion(params,req,res);
            }
        }
    }
})();

module.exports=CheckUpdate;