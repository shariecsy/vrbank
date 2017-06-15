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
    $('.btn').click(function(){
        goLogin();
        return false;
    })
    $('#username').keydown(function(event){
        event=document.all?window.event:event;
        if((event.keyCode || event.which)==13){
            goLogin();
        }
    })
    $('#password').keydown(function(event){
        event=document.all?window.event:event;
        if((event.keyCode || event.which)==13){
            goLogin();
        }
    })
})
function goLogin(){
    if($('#username').val()==''&&$('#password').val()==''){
        alert('请输入用户名和密码');
        return false;
    }
    if($('#username').val()==''){
        alert('请输入用户名');
        return false;
    }
    if($('#password').val()==''){
        alert('请输入密码');
        return false;
    }

    var data={
        username:$.trim($("#username").val()),
        password:$.trim($("#password").val())
    };
    $.post('/api/Login/login',data,function(data){
        console.log(data);
        if(data.url!=''){
            // alert(data.msg);
            layer.msg(data.msg,{time:1500},function(){
                location.replace(data.url);
            });
        }else{
            alert(data.msg);
        }
    })
}