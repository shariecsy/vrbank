var UpdateFile=(function(){
    //UpdateFile.append("/GRC/2","vtour.zip","grcbank.json");
    var append= function(distPath,filename,appendFileName) {
        var config = require("../../config/system");

        var oldFileName=distPath+"/"+filename;
        var newFileName=distPath+"/"+"new_"+filename.split(".")[0]+".zip";
        var dist=distPath+"/"+"temp";

        var archiver = require('archiver');
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        var fs = require("fs");
        var output = fs.createWriteStream(newFileName);

        output.on('close', function () {
            deleteall(dist);
            console.log("完成");
        });

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);

        var decompress = require('decompress');
        deleteall(dist);
        fs.mkdirSync(dist);
        decompress(oldFileName, dist).then(function (files) {
            console.log('done!');

            //遍历解压后的目录结构
            var ch = walk(dist);
            var pattern;
            archive.append(fs.createReadStream(distPath + "/" + appendFileName), {name: appendFileName});
            for (var i = 0; i < ch.length; i++) {
                pattern=dist.split("\/"+oldFileName+"\/")[0]+"/";
                archive.append(fs.createReadStream(ch[i]), {name: ch[i].replace(pattern, "")});
            }
            archive.finalize();
        });
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

    //删除文件夹
    var deleteall=function(path) {
        var fs = require('fs');
        var files = [];
        if(fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function(file, index) {
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteall(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    var rename = function(){

    };

    var move = function(){

    };

    var copy =function(){

    };

    return {
        append:append,
        rename:rename,
        move:move,
        copy:copy
    };
})();

module.exports=UpdateFile;