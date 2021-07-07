# 前端工程化详解

## 1、工程化概要

系统级体系建设：编码、测试、构建、发布、运行、维护一整套体系

* 编码（可学习umi）
  * 技术选型：React\vue，KOA\Nestjs
  * 开发模式：前后端分离、同构直出
  * 组件库：antd、elementui
  * mock方案：PWA mock、node server mock、mockjs
  * 全家桶：路由、状态管理、调试工具
  * 脚手架：手写、CRA、vuecli
  * 目录划分、领域模型设计、分支管理方案、微前端
* 测试：TDD、自动化测试
* 构建
  * 打包
  * 文件压缩
  * code splitting
  * cache
  * 更新：增量更新、热更新
  * css预处理或后处理
  * build bundle or chunk
* 部署
  * 持续集成/持续交付（CI/CD）
  * NGINX
  * Docker、K8S
  * 灰度
  * 监控
  * Jenkins

前端工程化主要聚焦构建流程：使用工具处理与业务无关的内容：js编译、打包、压缩、图片合并优化等各方面的工程性代码

## 2、具体类目

### 1、包管理工具

package manager：bower(不常用)、npm、yarn

#### 1、npm

全称node package manager，安装在node_modules目录下，必须拥有package.json文件，所有下载的模块，最终都会记录在 package-lock.json 完全锁定版本，下次我们再 npm install 时，就会先下载 package-lock.json里面的版本：

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

1. devDependencies 是指使用本地开发时需要使用的模块，而真正的业务运行时不用的内容

2. dependencies 是指业务运行时需要的模块

3. optionalDependencies 是可选模块，安不安装均可，即使安装失败，包的安装过程也不会报错

4. peerDependencies 必须依赖的版本模块，一般用在大型框架和库的插件上，例如我们写 webpack--xx-plugin 的时候，对于

   使用者而言，他一定会先有 webpack 再安装我们的这个模块，这里的 peerDependencies 就是约束了包中 webpack 的版本。

面试题2：npm 中 --save-dev 和 --save 之间的区别

1. save-dev 和 save 都会把模块安装到 node_modules 目录下。
2. save-dev 会将依赖名称和版本写到devDependencies 下，⽽ save 会将依赖名称和版本写到 dependencies 下。

#### 2、yarn

并发和快，常用命令可参考官网：[yarn参考](https://yarnpkg.com/)，具体为：

* 全部安装：yarn install
* 添加：yarn add xx@xx ｜ yarn add xx --dev | yarn golbal add xx
* 更新：yarn up xx@xx
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

格式化工具，配置文件.prettierrc，参考：[prettier 官网](https://prettier.io/)

### 3、es的编译

将es语法编译成支持的版本语法，常见工具为babel

### 4、打包工具

模块化规范：commonjs、amd、cmd、esmodule，打包抹平模块化差异。

#### 1、browserify

将commonjs模块转换为可在浏览器运行的模块

```js
npm install --save-dev browserify //安装
browserify index.js -o output.js  //执行

//index.js
const moduleA = require('./moduleA');
console.log(moduleA);

//moduleA.js
module.exports = "hello world";

//output.js
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const moduleA = require('./moduleA');
console.log(moduleA);
},{"./moduleA":2}],2:[function(require,module,exports){
module.exports = "hello world";
},{}]},{},[1]);
```

#### 2、rollup

tree shaking概念：对esmodule模块进行静态分析和处理，以及删除无用代码

```js
npm install --save-dev rollup   //安装
rollup index.js --file output.js  //输出

//index.js
import { add } from './module';
const result = add(1, 2);
console.log(result);

//module.js
export function add(a, b) {
  return a + b;
}
export function log() {
  return true;
}

//output.js，tree shaking去除了log()函数
function add(a, b) {
  return a + b;
}
const result = add(1, 2);
console.log(result);
```

**编译和打包**

对于模块化相关的 import 和 export 关键字， babel 最终会将它编译为包含require 和 exports 的 CommonJS 规范。 这就造成了另一个问题，这样带有模块化关键词的模块，编译之后还是没办法直接运行在浏览器中，因为浏览器端并不能运行 CommonJS 的模块。为了能在 WEB 端直接使用CommonJS 规范的模块，除了编译之外，我们还需要一个步骤叫做打包(bundle)。 

所以打包工具例如如 webpack / rollup ，编译工具 babel 它们之间的区别和作用就很清楚了 

* 打包工具主要处理的是 JS 不同版本间模块化的区别 

* 编译工具主要处理的是 JS 版本间语义的问题

### 5、JS压缩工具

```js
uglifyjs index.js -o output.js
```

添加 **--source-map** 在运行时生成 sitemap 文件，方便我们进行debug

### 6、流程化工具

#### 1、grunt

流程式处理工具

* 安装：npm install --save-dev grunt 
* 安装相关工具及grunt插件：npm --save-dev @babel/core @babel/preset-env grunt-babel grunt-contrib-uglify
* 配置gruntfile.js脚本，执行grunt进行编译和压缩等流程

问题：容易出现配置兼容等问题

#### 2、gulp

流程式处理工具，安装gulp，新建 gulpfifile.js 配置，执行gulp任务。相比grunt来说，配置更加清晰，是一个链式调用的写法。

#### 3、fis3

通用处理工具：fifis 是国内百度公司在早期发布的一款前端通用处理工具，fifis3 是它的第三代，使用node.js 重写，不再是一个普通工具，而是一个具有插件化的系统，有着丰富和完善的社区环境，属于前端解决方案。

#### 4、webpack

通用处理工具：

webpack 实际上和 gulp grunt 这类的任务处理工具有些类似，但是它本身具有打包的功能，同时也支持通过中间件和插件实现其他领域的功能，最终通过一个命令就能处理完成所有操作。

webpack 通过 webpack.confifig.js 配置，配置 loader 中间件来对不同文件进行操作，同时通过插件化的配置，支持例如压缩等操作。

## 3、工程化典范

node的server的架构工程说明

* 持续集成CI：gitlab、gerrit做分支管理
* 开发技术选型：express、koa
* 开发dev：中间件sso权限管理、安全控制、ORM数据库映射、CAT监控（接口等）
* 部署deploy：机器申请（dev/prod）、数据库申请（dev/prod）、网关域名DNS映射、编译构建打包(compile.sh编译、run.sh执行、check.sh心跳检测、manifest.yml构建文件(target: os、version、maven，runscript))
* 部署平台：deploy server/client，配置文件放置，通过点击操作即可实现部署配置

## 4、工程化技巧

### 1、模块解耦

将全局的store、router、mock、i18n剥离在各组件中，实现解耦。

#### 1、require.context

使用webpack的api实现代码自动导入，初始化时自动解析导入，实现route、store等解耦拆分

require.context在webpack解析打包时自动执行。

```js
//入参解析
require.context(
  directory,    							 //读取文件的路径
  (useSubdirectories = true),  //是否遍历文件的子目录
  (regExp = /^\.\/.*$/),       //要匹配文件的正则 
  (mode = 'sync')
);

//输出解析
/* 
1、输出为函数 webpackContext(req)
1.1、webpackContext函数，入参为路径，出参为模块，可取出defalut模块
1.2、函数也是对象，可有属性
2、输出的函数有三个属性，keys、id、resolve
2.1、resolve{Function} -接受一个参数request,request为test文件夹下面匹配文件的相对路径,返回这个匹配文件相对于整个工程的相对路径
2.2、keys {Function} -返回匹配成功模块的名字组成的数组
2.3、id {String} -执行环境的id,返回的是一个字符串,主要用在module.hot.accept
*/

//示例：index.js  ./modules/home.js
const modulesFiles = require.context('./modules', true, /\.js$/)

console.log(modulesFiles)
/*
ƒ webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
*/

console.dir(modulesFiles)
/*
ƒ webpackContext(req)
id: "./src/store/modules sync recursive \\.js$"
keys: ƒ webpackContextKeys()
resolve: ƒ webpackContextResolve(req)
*/

console.log(modulesFiles.keys())
//["./home.js"]

console.log(modulesFiles.id)
//./src/store/modules sync recursive \.js$

console.log(modulesFiles.resolve('./home.js'))
//./src/store/modules/home.js

console.log(modulesFiles('./home.js'))
/*
Module
default: {namespaced: true, state: {…}, getters: {…}, mutations: {…}}
*/
```

* store解耦合

```js
import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions.js"
import state from "./state.js"
import mutations from "./mutations.js"

Vue.use(Vuex);

let store = {
  state,
  actions,
  mutations
}
const modulesFiles = require.context('./modules', true, /\.js$/
const modules = modulesFiles.keys().reduce((modules, modulePath)=>{
  		//['./home.js']  ./home.js -> home
      const moduleName = modulePath.replace(/^\.\/(.*)\.js$/, '$1')
      const module = modulesFiles(modulePath).default
      modules[moduleName] = module
      return modules
}, {})
store = {...store, modules}
export default new Vuex.Store(store);

/*
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
1、total 必需，初始值, 或者计算结束后的返回值
2、currentValue	必需，当前元素
3、currentIndex	可选，当前元素的索引
4、arr	可选，当前元素所属的数组对象
5、initialValue 可选，传递给函数的初始值
*/
```

#### 2、使用register方法

重写vue类，子组件使用重写类，重写beforeCreate和destoryed方法，store、i18n、router通过参数传入后在beforeCreate注入，在destoryed中销毁，实现模块的解耦。

```js
//方法调用

```

### 2、mock方案

参考资料1：[vue中mock使用](https://www.cnblogs.com/l-y-h/archive/2019/10/17/11691110.html)

参考资料2：[axios和mock封装使用](https://www.cnblogs.com/l-y-h/p/12955001.html#_label2)

#### 1、mock.js

开发环境使用mock.js库，对请求进行拦截，无实际请求内容。

```js
Mock.mock( rurl?, rtype?, template ) )
Mock.mock( rurl, rtype, function( options ) )

/* 参数解析
1、rurl 可选
表示要拦截的url，可以使字符串，也可以是正则

2、rtype 可选
表示要拦截的ajax请求方式，如get、post

3、template 可选
数据模板，可以是对象也可以是字符串

4、function(option) 可选
表示用于生成响应数据的函数
*/
```

```js
//main.js
if(process.env.NODE_ENV === 'development'){
  require("../mock/mock.js")
}

//mock.js
import Mock from "mockjs"

const mocks = require.context("@/views", true, /.+\/mock\/.*\.js/);
mocks.keys().map((mockPath)=>{
    const mock = mocks(mockPath).default
    Mock.mock(mock.url, mock.method, mock.result);
})

// @/views/../mock/index.js
const listData = [
    {
        date: "2016-05-02",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1518 弄",
    },
    {
        date: "2016-05-04",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1517 弄",
    },
    {
        date: "2016-05-01",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1519 弄",
    },
    {
        date: "2016-05-03",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1516 弄号",
    },
]

export default {
    url: '/user/info',
    method: 'get',
    result: () => ({
        code: 0,
        info: listData
    })
}
```

#### 2、后端mock

* 可对接第三方mock服务
* 使用devserver的before进行数据mock：`before` 和 `after` 配置用于在 webpack-dev-server 定义额外的中间件
  * `before` 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock
  * `after` 在 webpack-dev-server 静态资源中间件处理之后，比较少用到，可以用于打印日志或者做一些额外处理
  * before和after参数：`function (app, server, compiler)`

思路：

1. webpack-dev-server本质是一个express服务器，使用原生before勾子注册路径实现数据mock，使用chokidar进行数据检测实现热更新加载。
2. before勾子中使用webpack-api-mocker中间件实现数据mock和热更新。

```js
/*
apiMocker(app, mockerFilePath[, options])
apiMocker(app, Mocker[, options])
*/

//vue.config.js
before: (app) => {
  apiMocker(app, path.resolve('./mock/mock-server.js'))
}

//mock-server.js
module.exports = {
		'GET /api/login': {
        success: appData.login.success,
        message: appData.login.message
    },
    'GET /api/list': [{
            id: 1,
            username: 'kenny',
            sex: 6
        },
        {
            id: 2,
            username: 'kenny',
            sex: 6
        }
    ],
    'POST /api/post': (req, res) => {
        res.send({
            status: 'error',
            code: 403
        });
    },
    'DELETE /api/remove': (req, res) => {
        res.send({
            status: 'ok',
            message: '删除成功！'
        });
    }
}
```

