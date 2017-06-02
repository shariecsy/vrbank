var DownloadFile=(function(){
    return {
        //验证传入的地址是否存在，若存在，该返回什么，若不存在，该返回当前最新版本
        checkURL:function(req,res,folder,callback){
            var config = require('../../config/system.js');
            var host=req.protocol+"://"+req.hostname+":"+config.port;
            var downloadAPI="/api/DownloadFile/download";

            //判断文件夹是否存在
            var fs = require('fs');
            var crypto = require('crypto');
            var distPath=__dirname+'/../..'+config.storage_path+folder;

            if(fs.existsSync(distPath)){
                fs.readFile(distPath+"/index.json",function(err,data) {
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    var hash = crypto.createHash('md5');
                    var filename = "new_"+jsonObj.module.zipFileName;
                    var rs = fs.createReadStream(distPath+"/"+filename);
                    var states = fs.statSync(distPath+'/'+filename);

                    rs.on('data', hash.update.bind(hash));
                    rs.on('end', function () {
                        callback({url:host+downloadAPI+folder,md5:hash.digest('hex'),size:states.size});
                    });
                });
            }else{
                callback({url:"当前版本文件不存在",md5:"",size:""});
            }

        },
        download:function(req,res){
            var config = require('../../config/system.js');
            var baseUrl=req.baseUrl;
            var dir='/../..'+config.storage_path+req.originalUrl.split(baseUrl)[1];//"/GRC/tour/1";
            var path=__dirname+dir;
            var fs=require("fs");
            var filename;

            fs.readFile(path+"/index.json",function(err,data) {
                if (err) throw err;
                var jsonObj = JSON.parse(data);

                filename=jsonObj.module.zipFileName;
                if(fs.existsSync(path+"/new_"+filename)){
                    res.download(path+"/new_"+filename,filename,function(err){
                        if(!err){
                            console.log('download successfully');
                        }else{
                            console.log(err);
                        }
                        res.end();
                    });
                }else{
                    res.send("找不到你要的这个文件哟");
                    res.end();
                }
            });
        }
    };
})();
module.exports=DownloadFile;