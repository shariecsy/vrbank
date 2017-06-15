var fs = require("fs");
var path = require('path');
var archiver = require('archiver');
var decompress = require('decompress');
var util=require('../../util/index.js');
var UpdateFile=(function(){
    var config = require("../../config/system");

    var update=function(params,tempUploadPath,distUploadPath,uploadFileName){
        var fileType=params.filetype;
        if(fileType=='zip'){
            //如果文件夹已经存在，该怎么做；不存在，又该怎么做
            if(fs.existsSync(distUploadPath)){
                //可以全部更新也可以部分更新
                if(params.isFull*1==1){
                    //删掉原来版本的所有文件，写入临时目录里创建文件
                    util.deleteAll(distUploadPath);
                    fs.renameSync(tempUploadPath,distUploadPath);
                    updateAll(distUploadPath,uploadFileName);
                }else{
                    //覆盖原有文件，将临时目录里的文件覆盖原文件夹里的文件
                    //部分更新
                    //若出现上传了新的压缩包，其压缩包和已有压缩包一样，又要部分更新的情况怎么办？
                    updatePart(params,tempUploadPath,distUploadPath,uploadFileName);
                }
            }else{
                //如果没有该版本的文件，只能新创建->重命名临时文件夹
                fs.renameSync(tempUploadPath,distUploadPath);
                updateAll(distUploadPath,uploadFileName);
            }
        }else if(fileType=='app'){
            //如果文件夹已经存在，该怎么做；不存在，又该怎么做
            if(fs.existsSync(distUploadPath)){
                //删掉，将临时文件夹里的文件重新写入到真实路径
                deleteAll(distUploadPath);
                //重命名临时文件夹
                fs.renameSync(tempUploadPath,distUploadPath);
            }else{
                //直接写入临时文件夹里面的文件到真实路径-重命名临时文件夹
                fs.renameSync(tempUploadPath,distUploadPath);
            }
        }
    };

    var updatePart=function(params,tempUploadPath,distUploadPath,uploadFileName){
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        //A->现在上传的临时的
        //B->已经存在的

        //先解压现有临时目录和已经存在的压缩包
        //临时目录
        var newFileNameA="new_"+path.parse(uploadFileName).name+".zip";//要再作处理
        var folderA=tempUploadPath+path.sep+"tempA";

        //已经存在的
        var appendFileName="module.json";
        var data=fs.readFileSync(distUploadPath+path.sep+appendFileName);
        var jsonObj = JSON.parse(data);
        var oldFileNameB=jsonObj.zipFileName;
        var folderB=distUploadPath+path.sep+"tempB";

        var output = fs.createWriteStream(distUploadPath+path.sep+newFileNameA);//写回临时的目录

        output.on('close', function () {
            //复制一份压缩处理后的文件，重新命名为原来上传时的名字
            var sourceFile = distUploadPath+path.sep+newFileNameA;
            var destPath = distUploadPath+path.sep+uploadFileName;

            //如当前上传的文件和已经存在的文件重名，则删除原文件，以写入新文件
            if(fs.existsSync(destPath)){
                fs.unlinkSync(destPath);
            }
            var readStream = fs.createReadStream(sourceFile);
            var writeStream = fs.createWriteStream(destPath);
            readStream.pipe(writeStream);

            //替换module.json文件
            sourceFile = tempUploadPath+path.sep+appendFileName;
            destPath = distUploadPath+path.sep+appendFileName;
            readStream = fs.createReadStream(sourceFile);
            writeStream = fs.createWriteStream(destPath);
            readStream.pipe(writeStream);
            readStream.on("close",function(){
                //删除临时目录
                util.deleteAll(tempUploadPath);
                util.deleteAll(folderB);

                //删除原目录下的压缩包文件
                fs.unlinkSync(distUploadPath+path.sep+oldFileNameB);
                fs.unlinkSync(distUploadPath+path.sep+"new_"+oldFileNameB);

                console.log("------------------------close-------------------------------------");
            });
        });

        archive.on('error', function (err) {
            console.info(err);
        });

        archive.on('end', function () {
            console.info("------------------------end-------------------------------------");
        });

        archive.pipe(output);

        util.deleteAll(folderA);
        fs.mkdirSync(folderA);

        util.deleteAll(folderB);
        fs.mkdirSync(folderB);

        decompress(distUploadPath+path.sep+oldFileNameB, folderB).then(function (files) {
            decompress(tempUploadPath+path.sep+uploadFileName, folderA).then(function (files) {
                //将A目录下的文件夹tempA里所有的文件全部复制到B目录的tempB文件夹里
                var chA = util.walk(folderA);

                archive.append(fs.createReadStream(tempUploadPath + path.sep + appendFileName), {name: appendFileName});//追加临时目录里的module.json

                copy(chA,folderB,folderA,0,function(){
                    var chB =util.walk(folderB);
                    var pattern=folderB;

                    for (var i = 0; i < chB.length; i++) {
                        archive.append(fs.createReadStream(chB[i]), {name: chB[i].replace(pattern, "")});
                    }

                    archive.finalize();
                });
            });
        });

    };

    var updateAll= function(distPath,filename) {
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        var appendFileName="module.json";
        var tempFolder=distPath+path.sep+"temp";

        var output = fs.createWriteStream(distPath+path.sep+"new_"+path.parse(filename).name+".zip");

        output.on('close', function () {
            // fs.unlinkSync(distPath+path.sep+filename);
            util.deleteAll(tempFolder);
            console.log("完成");
        });

        archive.on('error', function (err) {
            console.info(err);
        });

        archive.pipe(output);

        util.deleteAll(tempFolder);
        fs.mkdirSync(tempFolder);
        decompress(distPath+path.sep+filename, tempFolder).then(function (files) {
            console.log('done!');
            //遍历解压后的目录结构
            var ch = util.walk(tempFolder);
            var pattern;
            archive.append(fs.createReadStream(distPath + path.sep + appendFileName), {name: appendFileName});
            pattern=tempFolder;
            for (var i = 0; i < ch.length; i++) {
                archive.append(fs.createReadStream(ch[i]), {name: ch[i].replace(pattern, "")});
            }
            archive.finalize();
        });
    };

    var rename = function(){

    };

    var move = function(){

    };

    var copy =function(allFiles,distPath,sourcePath,i,callback){
        var sourceFile=allFiles[i];
        var destPath=distPath+path.sep+path.parse(sourceFile).base;

        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        readStream.on("close",function(){
            i++;
            if(i<allFiles.length){
                copy(allFiles,distPath,sourcePath,i,callback);
            }else{
                callback();
            }
        });
    };

    return {
        update:update,
        rename:rename,
        move:move,
        copy:copy
    };
})();

module.exports=UpdateFile;