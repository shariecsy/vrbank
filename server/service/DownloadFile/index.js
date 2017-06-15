var path=require("path");
var fs = require('fs');
var crypto = require('crypto');

var DownloadFile=(function(){
    return {
        //验证传入的地址是否存在，若存在，该返回什么，若不存在，该返回当前最新版本
        checkURL:function(req,res,folder,callback){
            var config = require('../../config/system.js');
            var host=req.protocol+"://"+req.hostname+":"+config.port;
            var downloadAPI="/api/DownloadFile/download";

            //判断文件夹是否存在
            var distPath=path.join(__dirname,'/../..'+config.storage_path.zip+folder);

            if(fs.existsSync(distPath)){
                fs.readFile(distPath+"/module.json",function(err,data){
                    try{
                        if (err) console.info(err);
                        var jsonObj = JSON.parse(data);
                        var hash = crypto.createHash('md5');
                        var filename = "new_"+jsonObj.zipFileName;
                        var rs = fs.createReadStream(distPath+"/"+filename);
                        var states = fs.statSync(distPath+'/'+filename);

                        rs.on('data', hash.update.bind(hash));
                        rs.on('end', function () {
                            callback({url:host+downloadAPI+folder,md5:hash.digest('hex'),size:states.size});
                        });
                    }catch(e){
                        console.log(e);
                    }
                });
            }else{
                callback({url:"当前版本文件不存在",md5:"",size:""});
            }

        },
        download:function(req,res){
            var config = require('../../config/system.js');
            var baseUrl=req.baseUrl;
            var _path_=path.join(__dirname,'/../..'+config.storage_path.zip+req.originalUrl.split(baseUrl)[1]);
            var filename;

            fs.readFile(_path_+"/module.json",function(err,data) {
                try{
                    if(err){
                        console.info(err);
                    }
                    var jsonObj = JSON.parse(data);

                    filename=jsonObj.zipFileName;
                    if(fs.existsSync(_path_+"/new_"+filename)){
                        res.download(_path_+"/new_"+filename,filename,function(err){
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
                }catch(e){
                    console.log(e);
                    res.end();
                }
            });
        }
    };
})();
module.exports=DownloadFile;