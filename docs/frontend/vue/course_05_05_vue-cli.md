# vue-cli详解

> 参考资料：
>
> 1、[Vue CLI官方文档](https://cli.vuejs.org/zh/guide/)
>
> 2、[commander资料](https://github.com/tj/commander.js#commanderjs)
>
> 3、[Inquirer资料](https://github.com/SBoudrias/Inquirer.js)

## 1、CLI简介

cli（Command Line Interface）是一种通过命令行来交互的工具应用，常见的为：create-react-app，vue-cli等，能够将一段js脚本，通过封装为可执行代码的形式，进行一些操作。使用cli后可快速创建项目内容，配置公用的配置工具例如：eslint、webpack。

cli使用的常用工具库：

* commander：命令行中的参数获取
* inquirer：命令行的表单
* chalk：命令行的可变颜色效果
* clui：命令行中的loading效果
* child_process：node原生模块，提供可执行方法，例如：exec命令，开子进程执行任务，运行结束后调用回调。

## 2、cli demo

* 生成可执行命令行：使用package.json bin配置
* 获取配置内容：使用commander库解析输入、使用inquirer设置命令行表单、使用chalk改变命令行颜色
* 根据配置内容进行具体操作：使用child_process进行命令执行、使用clui进行loading操作等
* 发布cli，安装使用即可

```js
//package.json
{
  "name": "@scp/cli",
  "version": "1.0.0",
  "description": "cli for vue and react framework",
  "main": "index.js",
  "bin": {
    "scp": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jian",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.1",
    "clui": "^0.3.6",
    "commander": "^7.2.0",
    "inquirer": "^8.0.0"
  }
}

//index.js
#!/usr/bin/env node
const path = require("path")
const childProcess = require("child_process")
const chalk = require("chalk")
const {program} = require("commander")
const inquirer = require("inquirer")
const CLI = require('clui'), Spinner = CLI.Spinner;


program.arguments('<dir>') //<>必输、[]选输
    .description('input a creat path')
    .action((dir)=>{
        console.log(chalk.blue("your input dir is: ", dir))
        return inquirer
        .prompt([
          /* Pass your questions in here */
            {
                type: 'list',
                name: 'framework',
                message: 'which framework do you like?',
                default: 'vue',
                choices: [
                    'react',
                    'vue'
                ]
            }
        ])
        .then(answers => {
          // Use user feedback for... whatever!!
          const fullDir = path.resolve(process.cwd(), dir)
          let iCommand = 'npm install -g @vue/cli'
          let cCommand = 'vue create ' + fullDir
          if(answers.framework === 'react'){
            iCommand = 'npm install -g create-react-app'
            cCommand = 'create-react-app ' + fullDir
          }
          //install cli
          const countdown = new Spinner('install...', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
          console.log('install cli: ', chalk.blue(answers.framework))
          console.log(chalk.blue(iCommand))
          countdown.start()
          childProcess.execSync(iCommand)
          console.log('install end')
          countdown.stop()
          
          //create project
          console.log('create project: ', chalk.blue(answers.framework))
          const countdown1 = new Spinner('create...', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
          console.log('===> excute: ', chalk.blue(cCommand))
          countdown1.start()
          childProcess.exec(cCommand, ()=>{
            countdown1.stop()
            console.log('create end')
          })
        })
        .catch(error => {
          if(error.isTtyError) {
            chalk.red('sorry, Prompt couldn\'t be rendered in the current environment')
          } else {
            chalk.red('sorry, the cli couldn\'t be run in the current environment')
          }
        });
    })

program.parse(process.argv)
```

## 3、vue-cli

### 1、简介

Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统，提供：

- 通过 `@vue/cli` 实现的交互式的项目脚手架。
- 通过 `@vue/cli` + `@vue/cli-service-global` 实现的零配置原型开发。
- 一个运行时依赖 (`@vue/cli-service`)，该依赖：
  - 可升级；
  - 基于 webpack 构建，并带有合理的默认配置；
  - 可以通过项目内的配置文件进行配置；
  - 可以通过插件进行扩展。
- 一个丰富的官方插件集合，集成了前端生态中最好的工具。
- 一套完全图形化的创建和管理 Vue.js 项目的用户界面。

### 2、相关包

* `@vue/cli`：提供vue命令，
  * vue create：创建工程
  * vue ui：通过ui创建工程
  * vue serve：原型构造
  * vue upgrade：更新项目内插件
  * vue add：添加插件，eg：vue add vuex、vue add router 
  * vue inspect：与vue-cli-service inspect相同
* `@vue/cli-service`：开发环境服务依赖，构建于webpack和wabpack-dev-server之上
  * vue-cli-service serve：启动服务器
  * vue-cli-service build：构建
  * vue-cli-service inspect：查看webpack配置
* `@vue/cli-service-global`：快速原型开发时使用
* `@vue/cli-plugin-`内置插件和`vue-cli-plugin-`社区插件：Vue CLI 使⽤了⼀套基于插件的架构，package.json中依赖都是以 `@vue/cli-plugin- `开头的。插件可以修改内部的 webpack 配置，也可以向 `vue-cli-service` 注⼊命令。在项⽬创建的过程中列出的特性，绝⼤部分都是通过插件来实现的。

### 3、预设配置

本地~/home/.vuerc中保存预设preset

```json
{
  "useConfigFiles": true,
  "router": true,
  "vuex": true,
  "cssPreprocessor": "sass",
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      "config": "airbnb",
      "lintOn": ["save", "commit"] 
    }
   }
}
```

### 4、cli服务

* 使用：终端为`./node_modules/.bin/vue-cli-service` 或npm命令为`npm run serve`
* 参数配置：可选配置文件`vue.config.js`或命令行参数

### 5、浏览器兼容性

* browserslist

  * package.json中browerslist字段，或者单独`.browerslist`文件，指定浏览器范围
  * 被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer) 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀

* polyfill

  * 一个默认的 Vue CLI 项目会使用 `@vue/babel-preset-app`，它通过 `@babel/preset-env` 和 `browserslist` 配置来决定项目需要的 polyfill。默认情况下，它会把 `useBuiltIns: 'usage'` 传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill，确保了最终包里 polyfill 数量的最小化
  * 特殊场景支持
    * 依赖需要开启语法转换和根据使用情况检测 polyfill：添加到 `vue.config.js` 中的 `transpileDependencies`选项，默认情况下 `babel-loader` 会忽略所有 `node_modules` 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
    * 依赖需要配置polyfill：在 `@vue/babel-preset-app` 的 polyfills选项预包含所需要的 polyfill，babel.config.js中配置
    * 使用预设全量polyfill：请使用 `useBuiltIns: 'entry'` 然后在入口文件添加 `import 'core-js/stable'; import 'regenerator-runtime/runtime';`，这会根据 `browserslist` 目标导入所有polyfill。

  ```js
  // ------- 按需引入polyfill，手动配置添加部分polyfill -------
  //babel.config.js @vue/babel-preset-app配置文件
  module.exports = {
    presets: [
      ['@vue/app', {
        polyfills: [
          'es.promise',
          'es.symbol'
        ]
      }]
    ]
  }
  
  // ------- 全量引入polyfill -------
  //babel.config.js
  module.exports = {
    presets: [
      ['@vue/cli-plugin-babel/preset',{
        "useBuiltIns": "entry"
      }]
    ]
  }
  
  //入口文件中
  import Vue from 'vue'
  import App from './App.vue'
  import store from './store'
  import router from './router'
  import 'core-js/stable'; 
  import 'regenerator-runtime/runtime';
  Vue.config.productionTip = false
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
  
  ```

* 现代模式

  Vue CLI 会产⽣两个应⽤的版本：`vue-cli-service build --modern` 

  * ⼀个现代版的包，⾯向⽀持 ES modules 的现代浏览器

  * 另⼀个旧版的包，⾯向不⽀持的旧浏览器

### 6、HTML和静态资源

#### 1、html

* index.html
  * 使用 html-webpack-plugin插件处理，可使用插件暴露默认值，以及客户端环境变量
  * 使用lodash template语法
    * `<%= VALUE %>` 用来做不转义插值；
    * `<%- VALUE %>` 用来做 HTML 转义插值；
    * `<% expression %>` 用来描述 JavaScript 流程控制。

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- 客户端环境变量 -->
    <!--
		/* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- 插件暴露值：title -->
    <!--
		/* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: 'vue-information',
        templateParameters: function () { /* omitted long function */ },
        template: '/Users/jian/workspace/vue-information/public/index.html'
      }
    ),
    -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <!-- -->
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

* preload
  * 使⽤ preload 属性，可以让⽀持的浏览器提前加载资源，但加载时并不执⾏，等待需要时才进⾏执⾏。
  * 为所有初始化渲染需要的⽂件⾃动⽣成 preload 提示
  * `@vue/preload-webpack-plugin` 注⼊，可通过 vue.config.js中chainWebpack选项进行修改和删除。

* prefecth
  * ⽤来告诉浏览器在⻚⾯加载完成后，利⽤空闲时间提前获取⽤户未来可能会访问的内容
  * 为所有作为 **async chunk** ⽣成的 JavaScript ⽂件 (通过动态import() 按需 code splitting 的产物) ⾃动⽣成 prefetch 提示
  * 被 `@vue/preload-webpack-plugin` 注⼊，并且可以通过 **chainWebpack** 的config.plugin('prefetch') 进⾏修改和删除

```js
//vue.config.js
module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    // 修改它的选项：
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}

//内联注释手动选定要提前获取的代码区块，webpack 的运行时会在父级区块被加载之后注入 prefetch 链接
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

#### 2、静态资源

* 在 JavaScript 被导⼊或在 template/CSS 中通过相对路径被引⽤，这类引⽤会被 webpack 处理。

  当你在 JavaScript、CSS 或 **.vue** ⽂件中使⽤相对路径 (必须以 . 开头) 引⽤⼀个静态资源时，该资源将会被包含进⼊ webpack 的依赖图中。在其内部，我们通过 **file-loader** ⽤版本哈希值和正确的公共基础路径来决定最终的⽂件路径，再⽤ **url-loader** 将⼩于 4kb 的资源内联，以减少 HTTP 请求的数量。

* 放置在 public ⽬录下或通过绝对路径被引⽤。这类资源将会直接被拷⻉，⽽不会经过 webpack 的处理。

### 7、css相关

Vue CLI 项⽬天⽣⽀持 PostCSS、CSS Modules 和包含 Sass、Less、Stylus 在内的预处理器。

* 所有编译后的 CSS 都会通过 css-loader 来解析其中的 url() 引⽤，并将这些引⽤作为模块请求来处理。这意味着你可以根据本地的⽂件结构⽤相对路径来引⽤静态资源。

* 你可以在创建项⽬的时候选择预处理器 (Sass/Less/Stylus)。

* 如果当时没有选好，内置的 webpack 仍然会被预配置为可以完成所有的处理。

### 8、webpack相关

* 调整 webpack 配置最简单的⽅式就是在 vue.confifig.js 中的 confifigureWebpack 选项提供⼀个对象，该对象将会被 webpack-merge 合并⼊最终的 webpack 配置。
* Vue CLI 内部的 webpack 配置是通过 `webpack-chain`维护的，在 `vue.config.js` 中的 `chainWebpack` 修改。

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
}
```

### 9、环境变量

#### 1、环境变量定义

* 项目根目录中放置文件来指定环境变量
* 一个环境文件只包含环境变量的“键=值”对
* 只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到客户端侧的代码中。被载入的变量将会对 `vue-cli-service` 的所有命令、插件和依赖可用。

```js
//根目录放置环境变量
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

//环境变量示例
FOO=bar
VUE_APP_NOT_SECRET_CODE=some_value
```

#### 2、客户端侧使用环境变量

* 以 `VUE_APP_` 开头的变量、`NODE_ENV`、`BASE_URL`使用：`process.env.VUE_APP_SECRET`，在构建过程中会替代
* `NODE_ENV` ：`"development"`、`"production"` 或 `"test"` 中的一个，具体的值取决于应用运行的模式
* `BASE_URL`：会和 `vue.config.js` 中的 `publicPath` 选项相符，即你的应用会部署到的基础路径
* 以上环境变量都可以在 `public/index.html` 中以 HTML 插值中介绍的方式使用，被 `webpack.DefinePlugin` 静态嵌入到客户端侧的包中。

### 10、构建

当你运⾏` vue-cli-service build` 时，你可以通过 `--target`选项指定不同的构建⽬标。应⽤模式是默认的模式。在这个模式中:

* index.html 会带有注⼊的资源和 resource hint 

* 第三⽅库会被分到⼀个独⽴包以便更好的缓存 

* ⼩于 4kb的静态资源会被内联在 JavaScript 中 

* public 中的静态资源会被复制到输出⽬录中

### 11、部署

如果你独⽴于后端部署前端应⽤——也就是说后端暴露⼀个前端可访问的 API，然后前端实际上是纯静态应⽤。那么你可以将 dist ⽬录⾥构建的内容部署到任何静态⽂件服务器中，但要确保正确的publicPath。

## 4、vue-cli源码分析

1. @vue/cli vue 命令下的 create ⽅法
   1. 入口文件：/node_modules/@vue/cli/bin/vue.js，使用commander提示信息，调用具体的方法，create调用require('../lib/create')(name, options)，不同命令映射不同的方法
   2. /node_modules/@vue/cli/lib/create.js：参数校验、文件清空、调用creator
   3. /node_modules/@vue/cli/lib/Creator.js：判断预设，读取配置并调整，安装插件，调用generator.generate创建文件
   4. /cli/node_modules/@vue/cli/lib/Generator.js：写文件树writeFileTree(this.context, this.files, initialFiles）

2. @vue/cli-service 的 serve 命令
   1. 入口：/node_modules/@vue/cli-service/bin/vue-cli-service.js，执行serve模块
   2. /node_modules/@vue/cli-service/lib/Service.js：根据命令行执行serve
   3. /node_modules/@vue/cli-service/lib/commands/serve.js，读取webpack配置，通过调用webpack函数执行，对文件进行打包、代理等，启动WebpackDevServer服务。

3. @vue/cli-service 的 build 命令
   1. 入口：/node_modules/@vue/cli-service/bin/vue-cli-service.js，执行serve模块
   2. /node_modules/@vue/cli-service/lib/Service.js：根据命令行执行build
   3. /node_modules/@vue/cli-service/lib/commands/build/index.js：执行webpack(webpackConfig, (err, stats))进行打包处理
