# 前端工程化详解

## 1、工程化概要

1. 系统级体系建设：编码、测试、构建、发布、运行、维护一整套体系

2. 使用工具处理与业务无关的内容：js编译、打包、压缩、图片合并优化等各方面的工程性代码

## 2、具体类目

### 1、包管理工具

package manager：bower(不常用)、npm、yarn

#### 1、npm

全称node package manager，安装在node_modules目录下，必须拥有package.json文件，所有下载的模块，最终都会记录在 package-lock.json 完全锁定版本，下次我们再 npm install 时，就会先下载 package-lock ⾥⾯的版本：

* name：包或者模块的名称
* version：版本，大版本.次要版本.小版本
  * ～：以大版本和次要版本为主，eg：～1.3.2，安装1.3.x的最新版本
  * ^：以大版本为主，eg：^1.3.2，安装1.x.x的最新版本
* main：默认加载的入口文件
* dependencies：运行时需要的模块
* devDependencies：本地开发需要运行的模块
* optionalDependencies：可选的模块，即使安装失败安装进程也会正常退出
* peerDependencies：必须依赖的版本模块

面试题1：devDependencies、dependencies、optionalDependencies和 peerDependencies 区别

解析：

1. devDependencies 是指使⽤本地开发时需要使⽤的模块，⽽真正的业务运⾏时不⽤的内容

2. dependencies 是指业务运⾏时需要的模块

3. optionalDependencies 是可选模块，安不安装均可，即使安装失败，包的安装过程也不会报错

4. peerDependencies 必须依赖的版本模块，⼀般⽤在⼤型框架和库的插件上，例如我们写 webpack--xx-plugin 的时候，对于

   使⽤者⽽⾔，他⼀定会先有 webpack 再安装我们的这个模块，这⾥的 peerDependencies 就是约束了包中 webpack 的版本。

面试题2：npm 中 --save-dev 和 --save 之间的区别

1. save-dev 和 save 都会把模块安装到 node_modules ⽬录下。
2. save-dev 会将依赖名称和版本写到devDependencies 下，⽽ save 会将依赖名称和版本写到 dependencies 下。

#### 2、yarn

并发和快，常用命令可参考官网：[yarn参考](https://yarnpkg.com/)，具体为：

* 全部安装：yarn install
* 添加：yarn add xx@xx ｜ yarn add xx --dev
* 更新：yarn up  xx@xx
* 移除：yarn remove xx
* 运行： yarn xx

### 2、静态检查和格式化工具

#### 1、eslint

* 安装： npm install eslint --save-dev，本地运行依赖
* 配置：.eslintrc(全局配置)、文件配置/* no-unused-vars：off */
* 配置脚本
  * eslint index.js，可配置在package.json脚本中
  * eslint --fix *.js （--fix默认修复）

* 丰富的插件，可参考： [eslint官网](https://eslint.org/)

#### 2、prettier

格式化工具，配置文件.prettierrc，参考：[prettier 官⽹](https://prettier.io/)

### 3、es的编译

将es语法编译成支持的版本语法，常见工具为babel

#### 1、安装

* @babel/core：内部核心的编译和生成代码的方法

* @babel/cli：babel命令行工具内部解析相关方法

* @babel/preset-env：babel编译结果预设值，使用can i use网站作为基设。

* @babel/polyfill：es6语法的补丁，安装了所有符合规范的 polyfifill 之后，我们需要在⼊⼝⽂件引

  ⼊这个模块，就能正常的使⽤规范中定义的⽅法了。

注意：polyfill通常需要--save，其他使用--save-dev即可

#### 2、使用

* 安装@babel/core和@babel/cli即可使用命令行解析工具
* 输出编译代码compile: babel index.js -o output.js
* 使用preset预设，配置.babelrc中presets属性
* 使用polyfill，需要在代码中引入polyfill模块，给所有方法打补丁，保证运行正常

```json
//.babelrc配置
{
  "presets":{
    
  }
}
```

