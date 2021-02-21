# 相关工具

## 1、git

参考：[git菜鸟教程](https://www.runoob.com/git/git-tutorial.html)

```
ssh-keygen -t rsa -C "youremail@example.com"
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:wangjxk/wangjxk.github.io.git master
git push -f git@github.com:wangjxk/vuepress-project.git master
```

## 2、npm

参考：[npm菜鸟教程](https://www.runoob.com/nodejs/nodejs-npm.html)

```
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

//发布模块
npm init
npm adduser
npm publish
```

