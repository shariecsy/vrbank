// 下载文件模块
var DownloadFile=(function(){
    return {
        do:function(action,params,req,res){
            var df=require("../../service/DownloadFile");
            if(action=='download'){
                df.download(req,res);
            }
        }
    }
})()
module.exports=DownloadFile;
