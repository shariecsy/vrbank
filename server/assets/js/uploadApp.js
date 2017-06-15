$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function(){
    $("#btn-reset").click(function(){
        $(".container .download-btn").attr("href","#").removeClass("active");
    });

    $("#btn").click(function(){
        $(".container .download-btn").attr("href","#").removeClass("active");

        try{
            var formData = new FormData($("#form")[0]);
            var data = $("#form").serializeArray();
            var file = $("#uploadFile").val();
            var maxSize=1024*1024*100;//文件最大为100M
            var fileSize=$("#uploadFile")[0].files[0].size;
            data.push({name:'file',value:file});
            // console.log(data);//输出表单内容
            // console.log(fileSize);
        }catch(e){
            console.info(e);
        }

        //检查必填项
        for(var i = 0; i < data.length;i++) {
            if (data[i].value == '' && data[i].name != 'description') {
                alert('请完善表格内容');
                return false;
            }
        }
        //限制文件上传类型
        var typeIndex=file.lastIndexOf('.');
        var fileType = file.substring(typeIndex+1);
        if(fileType!='zip'){
            alert('只能上传zip为后缀的文件哦');
            return false;
        }
        //限制文件上传大小
        if(fileSize>maxSize){
            alert('文件大小不能超过100M，请重新选择');
            $("#uploadFile").val('');
            return false;
        }
        var formObj=$("#form").serializeObject();

        vertifyVersion(formObj.identify,formObj.name,formObj.build,function(data){
            if(data.canUpload){
                $.ajax({
                    type:"post",
                    url:'/api/UpLoadFile/upload',
                    data:formData,
                    contentType: false,
                    processData: false,
                    success:function(dataBack){
                        if(dataBack.isExpired){
                            alert(dataBack.msg);
                            location.href=dataBack.url;
                        }else{
                            alert(dataBack.msg);
                            $("#btn-reset").trigger('click');
                            initDownload(formObj.identify,formObj.name,formObj.build);
                        }
                    }
                });
            }else{
                alert(data.msg+",当前服务器上的最新版本是:"+data.currentVersion);
            }
        });

    });

    $(".logout-btn").on("click","a",function(event){
        $.ajax({
            type:"post",
            url:'/api/Login/logout',
            data:{},
            success:function(data){
                if(data.code==1){
                    location.replace(data.url);
                }
            }
        })
    });
});

//上传文件时校验服务器端版本和要上传的版本
function vertifyVersion(id,name,build,callback){
    var data={
        "timeStamp":(new Date()).getTime(),		//时间戳：long类型
        "module":{
            "identify" : id,
            "name" : name,
            "build" : build
        }
    };
    $.ajax({
        url:window.location.origin+"/api/CheckUpdate/checkVersion",
        type:"post",
        dataType:"json",
        data:data,
        success:function(res){
            callback(res);
        }
    });
}

function initDownload(id,name,build){
    var data={
        "timeStamp":(new Date()).getTime(),		//时间戳：long类型
        "module":{
            "identify" : id,
            "name" : name,
            "build" : 0,
            "description" : ""
        }
    };
    $.ajax({
        url:window.location.origin+"/api/CheckUpdate/check",
        type:"post",
        dataType:"json",
        data:data,
        success:function(res){
            // console.info(res);
            $(".container .download-btn").attr("href",res.data.downloadUrl).addClass("active").show();
        }
    });
}
