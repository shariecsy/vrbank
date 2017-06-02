var CheckUpdate=(function(){
    return {
        do:function(action,params,req,res){
            var cu=require("../../service/CheckUpdate");
            if(action=="check"){
                cu.check(action,params,req,res);
                // console.log(__dirname);
            }
        }
    }
})();

module.exports=CheckUpdate;