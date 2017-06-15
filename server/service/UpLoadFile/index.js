var fs = require('fs');
var path = require('path');
var config = require('../../config/system.js');
var util=require('../../util/index.js');
var uf=require('../../service/UpdateFile/');
var UploadFile=(function(){

    var mkdir = function (dirpath,dirname) {
        if(typeof dirname === "undefined"){
            if(fs.existsSync(dirpath)){
                return;
            }else{
                // console.log(path.dirname(dirpath))
                mkdir(dirpath,path.dirname(dirpath));
            }
        }else{
            //判断第二个参数是否正常，避免调用时传入错误参数
            if(dirname !== path.dirname(dirpath)){
                mkdir(dirpath);
                return;
            }
            if(fs.existsSync(dirname)){
                fs.mkdirSync(dirpath)
            }else{
                mkdir(dirname,path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
    };

    var upload = function (params,req,res) {
        // console.log(req);  // 上传的文件信息
        // console.log(upload_file_path);
        // console.log('POST上传的字段是：'+' '+req.body);
        // console.log(req.body);
        var id = params.identify;
        var name = params.name;
        var build = params.build;
        var tempBuild=util.getGUID();//上传到临时目录
        var description = params.description;
        var des_file = path.join(__dirname,'/../../'+config.storage_path[params.filetype]+"/" +id+"/"+name+"/"+build+"/"+ req.files[0].originalname);//文件上传路径
        var upload_file_path = path.join(__dirname,'/../../'+config.storage_path[params.filetype]+"/"+id+"/"+name+"/"+build);

        //需要添加上传时的文件校验
        //要上传的版本和服务器端现有的版本比较

        var temp_des_file = path.join(__dirname,'/../../'+config.storage_path[params.filetype]+"/" +id+"/"+name+"/"+tempBuild+"/"+ req.files[0].originalname);//临时文件上传路径
        var temp_upload_file_path= path.join(__dirname,'/../../'+config.storage_path[params.filetype]+"/"+id+"/"+name+"/"+tempBuild);

        mkdir(temp_upload_file_path);

        fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(temp_des_file, data, function (err) {
                try{
                    if( err ){
                        console.log( err );
                        res.json({msg:'提交失败，请重新提交'});
                    }
                    var jsonStr = {
                        "identify":id,
                        "name":name,
                        "build":build,
                        "description":description,
                        "zipFileName":req.files[0].originalname
                    };
                    var jsonData = JSON.stringify(jsonStr);
                    fs.writeFile(temp_upload_file_path+ "/module.json",jsonData,function (err,data) {
                        try{
                            if(err){
                                console.log(err);
                            }
                            //调峰哥的接口
                            uf.update(params,temp_upload_file_path,upload_file_path,req.files[0].originalname);
                            res.json({msg:'提交成功'});
                            res.end();
                        }catch(e){
                            console.info(e);
                        }
                    });

                }catch(e){
                    console.info(e);
                    res.end();
                }
            });
        });
    };
    return {
        upload:upload
    };
})();
// UploadFile.test();
module.exports=UploadFile;