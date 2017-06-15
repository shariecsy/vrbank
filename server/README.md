# API说明文档
- **App端查看版本并获取下载信息**
http://tvrgrc.ucsmy.com:8090/api/CheckUpdate/check

参数:

```javascript

{
    "identify":"GRC", //标识
    "name":"vtour",     //名称
    "build":1,     //版本号
    "description":"说明文字"
}

```
- **PC端查看目前最新版本号**
http://tvrgrc.ucsmy.com:8090/api/CheckUpdate/checkVersion

参数:

```javascript

{
    "identify":"GRC", //标识
    "name":"vtour",     //名称
    "build":1,     //版本号
}

```

- **下载文件**

http://tvrgrc.ucsmy.com:8090/api/DownloadFile/download/grcbank/vtour/2

http://tvrgrc.ucsmy.com:8090 为主机段

/api/DownloadFile/download 为使用具体方法段

/grcbank/vtour/2 grcbank客户，项目名为vtour，版本为2


