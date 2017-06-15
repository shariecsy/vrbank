var fs=require("fs");
var path=require("path");
var config=require("../../config/system.js");
var util=require('../../util/index.js');
var CheckUpdate=(function(){
    var _checkFile_=function(params,req,res){
        var data={
            "result":0,	//请求结果 int类型
            "data":{
                "isUpdate":1,	//是否更新 boolean类型
                "downloadUrl":"",	//更新地址 String类型,
                "fileMD5":"",
                "fileSize":0//单位:字节
            },
            "msg":"请求成功"	//提示消息 String类型
        };
        var download=require("../DownloadFile");
        //查看当前的请求条件是否和当前最新版本的文件相符

        if(typeof params.module=='string'){
            params.module=JSON.parse("{"+params.module.substring(1,params.module.length-1)+"}");
        }

        if(params==undefined||params.module==undefined||params.module.identify==undefined||params.module.name==undefined||params.module.build==undefined){
            data.result=4;
            data.msg="对不起，你要传点参数给我";
            data.isUpdate=0;
            data.data.downloadUrl="当前版本文件不存在";
            res.json(data);
            res.end();
        }
        var id = params.module.identify;
        var name = params.module.name;
        var build = params.module.build;

        if((id.length>0)&&(name.length>0)&&(build*1>=0)){
            //查看当前目录下是否有该文件夹，有则返回下载地址，没有就返回最新的下载地址
            var modulePath=path.join(__dirname,'/../..'+config.storage_path.zip+"/"+id+"/"+name);
            var distPath=path.join(__dirname,'/../..'+config.storage_path.zip+"/"+id+"/"+name+"/"+build);
            if(fs.existsSync(modulePath)){
                var ch=util.walk(modulePath);
                var versions=[];
                var moduleName;
                var patten=path.sep+id+path.sep +name+path.sep;
                for(var i=0;i<ch.length;i++){
                    moduleName=ch[i].split(patten)[1].split(path.sep)[0];
                    versions.push(moduleName*1);
                }

                versions=unique(versions);
                var max=Math.max.apply(null, versions);

                if(fs.existsSync(distPath)){
                    //目录存在
                    //如果当前是最新的，返回0，不是最新的返回1
                    if(build*1<max){
                        build=max;
                        data.data.isUpdate=1;
                    }else{
                        data.data.isUpdate=0;
                    }
                }else{
                    //目录不存在
                    //传入10，现在版本是2
                    if(build*1>=max){
                        data.data.isUpdate=0;//不需更新回退到旧版本
                    }else{
                        build=max;
                        data.data.isUpdate=1;//返回一个最新的
                    }
                }

                download.checkURL(req,res,"/"+id+"/"+name+"/"+build,function(obj){
                    data.data.downloadUrl=obj.url;
                    data.data.fileMD5=obj.md5;
                    data.data.fileSize=obj.size;
                    res.json(data);
                    res.end();
                });
            }else{
                data.data.isUpdate=0;
                data.data.downloadUrl="当前版本文件不存在";
                res.json(data);
                res.end();
            }
        }else{
            data.data.isUpdate=0;
            data.data.downloadUrl="当前版本文件不存在";
            res.json(data);
            res.end();
        }
    };

    var _checkVersion_=function(params,req,res){
        // res.json({"canUpload":true,"msg":"ok"});
        // res.end();
        var responseData={
            canUpload:false,
            currentVersion:0,
            msg:''
        };
        var id = params.module.identify;
        var name = params.module.name;
        var build = params.module.build;

        if((id.length>0)&&(name.length>0)&&(build*1>=0)){
            //查看当前目录下是否有该文件夹，有则返回下载地址，没有就返回最新的下载地址
            var modulePath=path.join(__dirname,'/../..'+config.storage_path.zip+"/"+id+"/"+name);
            var distPath=path.join(__dirname,'/../..'+config.storage_path.zip+"/"+id+"/"+name+"/"+build);
            if(fs.existsSync(modulePath)){
                var ch=util.walk(modulePath);
                var versions=[];
                var moduleName;
                var patten=path.sep+id+path.sep +name+path.sep;
                for(var i=0;i<ch.length;i++){
                    moduleName=ch[i].split(patten)[1].split(path.sep)[0];
                    versions.push(moduleName*1);
                }

                versions=unique(versions);
                var max=Math.max.apply(null, versions);

                //比较要上传的这个版本号A和服务器上的最新版本号B
                //若目录存在，A==B,canUpload=true
                if(fs.existsSync(distPath)){
                    responseData.canUpload=true;
                    responseData.currentVersion=max;
                    responseData.msg="服务器上存在相同版本号的文件，将覆盖之前的文件";
                }else{
                    //目录不存在
                    //A>B,canUpload=true,否则canUpload=false
                    if(build*1>max){
                        responseData.canUpload=true;
                        responseData.currentVersion=max;
                        responseData.msg="服务器上的文件都比该版本文件低，可以更新";
                    }else{
                        responseData.canUpload=false;
                        responseData.currentVersion=max;
                        // responseData.msg="服务器上的文件都比该版本文件高，不可以更新";
                        responseData.msg="版本号低于当前版本号。";
                    }
                }

            }else{
                responseData.canUpload=true;
                responseData.currentVersion=0;
                responseData.msg="服务器上没有这个模块的文件";
            }
        }else{
            responseData.canUpload=false;
            responseData.currentVersion=0;
            responseData.msg="输入的校验参数有误";
        }

        res.json(responseData);
        res.end();
    };

    //数组去重
    var unique=function(array){
        var r = [];
        for(var i = 0, l = array.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
                if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
        }
        return r;
    }

    return {
        check:_checkFile_,
        checkVersion:_checkVersion_
    };
})();
module.exports=CheckUpdate;