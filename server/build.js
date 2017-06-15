var path=require("path");
var fs=require("fs");
var archiver = require('archiver');
var util=require("./util/index.js");

var distPath=__dirname+path.sep+".."+path.sep+".."+path.sep+"dist"+path.sep;
var sourcePath=__dirname+path.sep;
var filterExt=['.md','.sh','.log'];
var catrgory=['api','assets','config','routers','service','util'];
var directFiles=[
    'package.json','process.json','server.js'
];

function collectFiles(){
    var files=[];
    var temp;
    //将这些目录下的这些文件搬走
    for(var i=0;i<catrgory.length;i++){
        temp=util.walk(path.join(sourcePath,catrgory[i]));
        for(var j=0;j<temp.length;j++){
            files.push(temp[j]);
        }
    }

    for(var i=0;i<directFiles.length;i++){
        files.push(path.join(sourcePath,directFiles[i]));
    }
    return files;
}

function compressFile(files,zipFileName){
    //打包、压缩
    var filename=zipFileName+".zip";
    var archive = archiver('zip', {
        zlib: { level: 9 }
    });
    var output = fs.createWriteStream(distPath+filename);
    console.log("打包后存放的路径:\n"+distPath);
    archive.on('error', function (err) {
        console.info(err);
    });

    archive.on('end', function () {
        console.info("------------------------end-------------------------------------");
    });

    output.on('close', function () {
        console.log("生成的文件名是:"+filename);
        console.log(archive.pointer() + ' total bytes');
        console.info("------------------------close-------------------------------------");
    });

    archive.pipe(output);

    var pattern=sourcePath;
    for (var i = 0; i < files.length; i++) {
        if(path.extname(files[i])!=filterExt[0]||path.extname(files[i])!=filterExt[1]||path.extname(files[i])!=filterExt[2]){
            archive.append(fs.createReadStream(files[i]), {name: files[i].replace(pattern, "")});
        }
    }

    archive.finalize();
}

// module.exports=compressFile;
compressFile(collectFiles(),'vrbank20170613001');