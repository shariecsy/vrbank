//监听端口
exports.port = '8090';
//地址
exports.host = '172.17.21.138';
//默认加载的页面
exports.default_page = '/index.html';
//静态资源根目录
exports.webroot = 'assets';
//静态资源扩展名
exports.res_ext = ['.html','.js','.css','.jpg','.png','.ttf','.woff'];
//业务逻辑扩展名
exports.bus_ext = ['.do'];
//上传文件存放路径
exports.storage_path='/storage';
//用户名和密码
// exports.user_list=[{username:'admin',password:'123'}];
exports.user_list=[
    {username:'admin',password:'123'},
    {username:'admin1',password:'1234'},
    {username:'admin12',password:'12345'}
];
//白名单不用登录
exports.white_name_list=[
    '/api/DownloadFile/download'
];
