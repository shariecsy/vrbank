// 上传文件模块
var df=require("../../service/UpLoadFile");
var UploadFile=(function(){
    return {
        do:function(action,params,req,res){
            if(action=='upload'){
                if(df.checkLogin(req,res)){
                    res.json({isExpired:'true',url:'/login.html',msg:'会话已过期咯，请重新登录'});
                }else{
                    df.upload(params,req,res);
                }
            }
        }
    }
})()
module.exports=UploadFile;
