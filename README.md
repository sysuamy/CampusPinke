# CampusPinke

《安装部署说明》

首先要安装meteor 

如果您的系统是OS X 或者 Linux 就使用下面的命令简单安装

curl https://install.meteor.com/ | sh

如果出现错误提示：没有安装 curl 的话可以到以下网站下载

http://curl.haxx.se/download/curl-7.43.0.tar.gz

如果您的系统是windows可以到以下链接下载

https://s3.amazonaws.com/meteor-windows/InstallMeteor.exe


之后可以从我们的github地址上下载我们的代码

git clone https://github.com/Nero-Lijianhua/CampusPinke.git

如果您没有安装git 可以从 http://git-scm.com/download/ 这个网站下载。

下载后 cd 到 CampusPinke 目录下 执行 meteor 命令就行。

默认是3000端口， 如果3000端口被占领了的话

可以自己设定一个端口运行， 用以下命令

meteor —port <port number>

打开浏览器 输入 localhost:<port number> 
默认是 localhost:3000