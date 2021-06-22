# 相关工具

## 1、git

参考：[git菜鸟教程](https://www.runoob.com/git/git-tutorial.html)

```bash
git config --global user.name "lidu"
git config --global user.email "lidu@example.com"
ssh-keygen -t rsa -C "youremail@example.com"
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:wangjxk/wangjxk.github.io.git master
git push -f git@github.com:wangjxk/vuepress-project.git master
```

推送至github示例：

```js
第一步：在ginhub网站上创建一个repository；
第二步：点击需要上传的本地工程目录，右击-->>Git Bash，进入命令行；
第三步：$ git init        
       $ git add --all        //添加该文件夹下的所有文件
       $ git commit -m ‘xxx’   //引号内是对仓库的描述
       $ git remote add origin git@github.com:xxx/yyy.git  //添加远程仓库路径（ssh路径或者http路径）
       $ git push -u origin master
       或者 $ git push -f git@github.com:xxx/yyy.git master
       
1、create a new repository on the command line
echo "# my-webpack" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:wangjxk/my-webpack.git
git push -u origin main

2、push an existing repository from the command line
git remote add origin git@github.com:wangjxk/my-webpack.git
git branch -M main
git push -u origin main
```

## 2、npm

> 参考资料：
>
> 1、[npm菜鸟教程](https://www.runoob.com/nodejs/nodejs-npm.html)
>
> 2、[npm官网资料](https://docs.npmjs.com/cli/v7/using-npm/scope)

### 1、常见命令
```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
npm cache clean

//配置设置
npm config set registry https://registry.npm.taobao.org
npm config get registry
npm config list

//安装模块
npm install
npm uninstall express
npm update express
npm -g list --depth=1 //查看全局安装模块

//发布模块
npm init
npm adduser
npm publish

//scope：@somescope/somepackagename
npm install -g @vue/cli
```

### 2、package.json解析

bin：模块有一个或者多个需要配置到PATH路径下的可执行模块，npm通过bin属性实现。模块安装时，若全局安装，则npm会为bin中配置的文件在bin目录下创建一个软链接（对于windows系统，默认会在C:\User\username\AppData\Roaming\npm目录下），若是局部安装，则会在项目内的./node_modules/.bin/目录下创建一个软链接。

## 3、npx

npx是一个工具，npm v5.2.0引入的一条命令（npx），一个npm包执行器，指在提高从npm注册表使用软件包时的体验 ，npm使得它非常容易地安装和管理托管在注册表上的依赖项，npx使得使用CLI工具和其他托管在注册表。

当执行NPX xxx时候，先看xxx在$PATH里有没有，没有则查找当前目录node_modules里是否存在，若没有则安装并执行。

## 4、yarn

```
* 全部安装：yarn install
* 添加：yarn add xx@xx ｜ yarn add xx --dev | yarn golbal add xx
* 更新：yarn up xx@xx
* 移除：yarn remove xx
* 运行： yarn xx
```

