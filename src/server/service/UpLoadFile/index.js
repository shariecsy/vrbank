var config = require('../../config/system.js');
var fs = require('fs');
var path = require('path');
var uf=require('../../service/UpdateFile/');
var UploadFile=(function(){
    //判断登录状态
    var checkLogin=function(req,res){
        if(!req.session.loginUser){
            return true;
        }
        return false;
    };
    //验证传入的地址是否存在，若存在，该返回什么，若不存在，该返回当前最新版本
    var check = function(req,res,path,callback){

    };
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
    }
    var upload = function (params,req,res) {

        console.log(req);  // 上传的文件信息

        var id = req.body.identify;
        var name = req.body.name;
        var build = req.body.build;
        var description = req.body.description;
        var des_file = __dirname+'/../../'+config.storage_path+"/" +id+"/"+name+"/"+build+"/"+ req.files[0].originalname;//文件上传路径
        var upload_file_path = __dirname+'/../../'+config.storage_path+"/"+id+"/"+name+"/"+build;
        // console.log(upload_file_path);
        // console.log('POST上传的字段是：'+' '+req.body);
        console.log(req.body);
        mkdir(upload_file_path);
        fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if( err ){
                    console.log( err );
                    res.json({msg:'提交失败，请重新提交'});
                    res.end();
                }else{
                    var jsonStr = {
                        "module":{
                            "identify":id,
                            "name":name,
                            "build":build,
                            "description":description,
                            "zipFileName":req.files[0].originalname
                        }
                    };
                    var jsonData = JSON.stringify(jsonStr);
                    fs.writeFile(upload_file_path+ "/module.json",jsonData,function (err,data) {
                        if(err){
                            console.log(err)
                        }else {
                            // console.log(data);
                            //调峰哥的接口
                            uf.append(upload_file_path,req.files[0].originalname,"module.json");
                        }
                    })

                    // console.log(JSON.stringify(data));
                }
                res.json({msg:'提交成功'});
                res.end();
            });
        });
    }
    return {
        upload:upload,
        checkLogin:checkLogin
    };
})();
// UploadFile.test();
module.exports=UploadFile;