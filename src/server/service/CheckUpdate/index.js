var CheckUpdate=(function(){
    var _CheckFile_=function(action,params,req,res){

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

        var http=require("http");
        var config=require("../../config/system.js");
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
            var fs=require("fs");
            var modulePath=__dirname+'/../..'+config.storage_path+"/"+id+"/"+name;
            var distPath=__dirname+'/../..'+config.storage_path+"/"+id+"/"+name+"/"+build;
            if(fs.existsSync(modulePath)){
                var ch=walk(modulePath);
                var versions=[];
                var moduleName;
                var patten="/"+id+"/"+name+"/";
                for(var i=0;i<ch.length;i++){
                    moduleName=ch[i].split(patten)[1].split("\/")[0];
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
                // download.checkURL(req,res,"/"+id+"/"+name+"/"+build,function(obj){});
                // download.checkURL(req,res,"/"+id+"/"+name+"/"+build,function(obj){});
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

    //遍历获取目录结构
    var walk=function(dir) {
        var fs=require("fs");
        var children = [];
        fs.readdirSync(dir).forEach(function(filename){
            var path = dir+"/"+filename;
            var stat = fs.statSync(path);
            if (stat && stat.isDirectory()) {
                children = children.concat(walk(path))
            }
            else {
                children.push(path)
            }
        });

        return children
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
        check:_CheckFile_
    };
})();
module.exports=CheckUpdate;