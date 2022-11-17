# firrtl2digitalJS_verNWJS

# 初始化
如果项目里没有node_modules文件夹的话，需要npm install

# 编译项目
每改一次代码就要用npm run build编译一次，因为digitaljs是es6模块，import es6语法在nodejs并不能运行，所以要用babel编译
和nodejs有关的语法放在src/index.html中，其他放在index.js中
使用npm run build把代码编译出来，dist资料夹就是编译出来的项目

然后在dist/index.html里把charset="UTF-8"放到script里面去
就是把<script defer src="bundle.js"></script>变成<script defer src="bundle.js" charset="UTF-8"></script>
每次使用npm run build编译完都要做一次这个操作，不然无法在nodejs里运行

# java环境问题
所需环境：java8以上，java8不能运行，会提示版本过低，我用的是jdk-19

## 使用自己电脑的java环境
调用的就是自己电脑的java环境，并把dist中jdk-19删除再压缩，这样打包出来的档案就会少了303MB

由于把java环境打包进去，出来的档案很大，可以用自己的java环境从而减少档案大小
在src/index.html的jar_path中改成java的话
var jar_path = 'java'

## 使用项目自已的java环境
如果改成var jar_path = dirname + '/jdk-19/bin/java.exe'的话，调用就是dist文件夹里的环境

# 如何打包
然后把dist打包成压缩档，用nwjs-sdk-v0.70.1-win-x64里面的nw.exe打开刚才的dist压缩档
我这里已经把压缩过的档案(dist)放在nwjs-sdk-v0.70.1-win-x64中并改名为firrtl2digitaljs.zip
用命令打开 nw.exe .\firrtl2digitaljs.zip
如果要打包出exe档，使用命令copy /b nw.exe+myapp.nw app.exe，以后还需要打开的话，要在nwjs-sdk-v0.70.1-win-x64的文件夹下才能打开
要完全打包的话就要把nwjs-sdk-v0.70.1-win-x64也要打包进去

# 完整的打包
http://static.kancloud.cn/mikkle/thinkphp5_study/467061