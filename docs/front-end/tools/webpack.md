# webpack

## 1、ref资料

[webpack官网资料](https://webpack.docschina.org/)

[深入浅出webpack](https://xbhub.gitee.io/wiki/webpack/)

[阮一峰webpack-demo](https://github.com/ruanyf/webpack-demos)

## 2、总体简介

### 1、常用配置

* context：配置基础目录
* Entry：配置模块的入口；
* Output：配置如何输出最终需要的代码；
* Module：配置处理模块的规则；
* Resolve：配置寻找模块的规则；
* Plugins：配置扩展插件；
* DevServer：配置DevServer开发服务器;
* target：配置构建目标；
* Optimization：配置优化内容；
* devtools：配置sourcemap；
* watch和watchOptions：配置监听文件；
* externals：配置排除依赖，打包排除文件；

``` js
const path = require('path');

module.exports = {
  // entry 表示 入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
  // 类型可以是 string | object | array   
  entry: './app/entry', // 只有1个入口，入口只有1个文件
  entry: ['./app/entry1', './app/entry2'], // 只有1个入口，入口有2个文件
  entry: { // 有2个入口
    a: './app/entry-a',
    b: ['./app/entry-b1', './app/entry-b2']
  },

  // 如何输出结果：在 Webpack 经过一系列处理后，如何输出最终想要的代码。
  output: {
    // 输出文件存放的目录，必须是 string 类型的绝对路径。
    path: path.resolve(__dirname, 'dist'),

    // 输出文件的名称
    filename: 'bundle.js', // 完整的名称
    filename: '[name].js', // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: '[chunkhash].js', // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: '/assets/', // 放到指定目录下
    publicPath: '', // 放到根目录下
    publicPath: 'https://cdn.example.com/', // 放到 CDN 上去

    // 导出库的名称，string 类型
    // 不填它时，默认输出格式是匿名的立即执行函数
    library: 'MyLibrary',

    // 导出库的类型，枚举类型，默认是 var
    // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
    libraryTarget: 'umd', 

    // 是否包含有用的文件路径信息到生成的代码里去，boolean 类型
    pathinfo: true, 

    // 附加 Chunk 的文件名称
    chunkFilename: '[id].js',
    chunkFilename: '[chunkhash].js',

    // JSONP 异步加载资源时的回调函数名称，需要和服务端搭配使用
    jsonpFunction: 'myWebpackJsonp',

    // 生成的 Source Map 文件名称
    sourceMapFilename: '[file].map',

    // 浏览器开发者工具里显示的源码模块名称
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',

    // 异步加载跨域的资源时使用的方式
    crossOriginLoading: 'use-credentials',
    crossOriginLoading: 'anonymous',
    crossOriginLoading: false,
  },

  // 配置模块相关
  module: {
    rules: [ // 配置 Loader
      {  
        test: /\.jsx?$/, // 正则匹配命中要使用 Loader 的文件
        include: [ // 只会命中这里面的文件
          path.resolve(__dirname, 'app')
        ],
        exclude: [ // 忽略这里面的文件
          path.resolve(__dirname, 'app/demo-files')
        ],
        use: [ // 使用那些 Loader，有先后次序，从后往前执行
          'style-loader', // 直接使用 Loader 的名称
          {
            loader: 'css-loader',      
            options: { // 给 html-loader 传一些参数
            }
          }
        ]
      },
    ],
    noParse: [ // 不用解析和处理的模块
      /special-library\.js$/  // 用正则匹配
    ],
  },

  // 配置插件
  plugins: [
  ],

  // 配置寻找模块的规则
  resolve: { 
    modules: [ // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.json', '.jsx', '.css'], // 模块的后缀名
    alias: { // 模块别名配置，用于映射模块
       // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      'module': 'new-module',
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      'only-module$': 'new-module', 
    },
    alias: [ // alias 还支持使用数组来更详细的配置
      {
        name: 'module', // 老的模块
        alias: 'new-module', // 新的模块
        // 是否是只映射模块，如果是 true 只有 'module' 会被映射，如果是 false 'module/inner/path' 也会被映射
        onlyModule: true, 
      }
    ],
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ['package.json'], // 模块的描述文件
    mainFields: ['main'], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀
  },

  // 输出文件性能检查配置
  performance: { 
    hints: 'warning', // 有性能问题时输出警告
    hints: 'error', // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function(assetFilename) { // 过滤要检查的文件
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: 'source-map', // 配置 source-map 类型，默认值为false

  context: __dirname, // Webpack 使用的根目录，string 类型必须是绝对路径

  // 配置输出代码的运行环境
  target: 'web', // 浏览器，默认
  target: 'webworker', // WebWorker
  target: 'node', // Node.js，使用 `require` 语句加载 Chunk 代码
  target: 'async-node', // Node.js，异步加载 Chunk 代码
  target: 'node-webkit', // nw.js
  target: 'electron-main', // electron, 主线程
  target: 'electron-renderer', // electron, 渲染线程

  externals: { // 使用来自 JavaScript 运行环境提供的全局变量
    jquery: 'jQuery'
  },

  stats: { // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },

  devServer: { // DevServer 相关的配置
    proxy: { // 代理到后端服务接口
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // 配置 DevServer HTTP 服务器的文件根目录
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    hot: true, // 是否开启模块热替换功能
    https: false, // 是否开启 HTTPS 模式
    open: false, //第一次构建完成，是否启动浏览器
    host: 0.0.0.0, //支持任何地址访问DevServer的Http服务
    allowedHosts: ['baidu.com', 'sub.host.com'], //允许访问域名列表
  	disableHostCheck: false, //host检查关闭，可直接使用ip访问服务器
    inline: false, //关闭inline使用iframe方式
  },

  profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳
  cache: false, // 是否启用缓存提升构建速度
  watch: true, // 是否开始
  watchOptions: { // 监听模式选项
    // 不监听的文件或文件夹，支持正则匹配。默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms 
    aggregateTimeout: 300,
    // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每秒问 1000 次
    poll: 1000
  },
}
```

### 2、output输出

``` js
module.exports = {
	output: {
		filename: '[name]_[chunkhash:8].js', //chunk属性：id\name\hash\chunkhash（内容的hash值）
		chunkFilename: '',   //chunk文件输出
		path: path.resolve(__dirname, 'dist_[hash]'), //输出路径
		crossOriginLoading: 'anonymous（默认，不带cookies）|use-credentials（带cookies）'
    //配置script标签的crossorigin属性
	}
};
```

### 3、Module模块

#### 1、配置Loader

use：应用规则

test、include、exclude：条件匹配

#### 2、noParse

忽略没采用模块化的文件的递归解析和处理，提高构建性能。

#### 3、parser

因为 Webpack 是以模块化的 JavaScript 文件为入口，所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。 `parser` 属性可以更细粒度的配置哪些模块语法要解析哪些不解析，和 `noParse` 配置项的区别在于 `parser` 可以精确到语法层面， 而 `noParse` 只能控制哪些文件不被解析。

### 4、Resolve

#### 1、alias

别名路径映射

#### 2、mainFields

默认：mainFields: ['browser', 'main']

webpack根据mainFields配置遍历，查找优先使用哪个代码。

#### 3、extensions

处理文件的后缀列表，默认['.js', '.json']

#### 4、modules

配置查询模块的目录，默认只会去node_modules目录下查找。

## 3、loader

### 1、babel-loader

``` js
module: {
  rules: [
    {
      test: /\.js$/,
      include: [resolve('src'), resolve('test')],
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: { 
          presets: ['env'], //对应babel-preset-env
          plugins: ['@babel/plugin-proposal-object-rest-spread'],
          cacheDirectory: true 
          /* 默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。*/
        }
      }
    }
  ]
}
```

```
//package.json文件，babel-core和babel-loader是核心插件，babel-preset-env处理代码的预设
"devDependencies": {
    "babel-core": "^6.26.0",   // 核心包
    "babel-loader": "^7.1.2",   // 基础包
    "babel-preset-env": "^1.6.1",  // 根据配置转换成浏览器支持的 es5  
    "babel-plugin-transform-runtime": "^6.23.0",  //promise的转换
    "babel-preset-react": "^6.24.1", //react语法的转换
    "babel-plugin-import": "^1.6.3",  // import的转换 
    "babel-preset-stage-0": "^6.24.1", //babel-preset-stage-0 打包处于 strawman 阶段的语法）
}
```

* 配置文件.babelrc

增加了.babelrc文件后，options项即可省略，在执行babel-loader的时候默认会去读.babelrc中的配置，webpack和babel.rc文件里的配置都会生效,比如transform-remove-console插件在任意一处配置,都会生效。在.babelrc配置文件中，主要是对预设(presets) 和 插件(plugins) 进行配置。

参考：[babel配置文件解析](https://www.cnblogs.com/wb336035888/p/10449985.html)

### 2、thread-loader

Runs the following loaders in a worker pool.

把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。

``` js
use: [
  {
    loader: "thread-loader",
    // 有同样配置的 loader 会共享一个 worker 池(worker pool)
    options: {
      // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)
      // 或者，在 require('os').cpus() 是 undefined 时回退至 1
      workers: 2,

      // 一个 worker 进程中并行执行工作的数量
      // 默认为 20
      workerParallelJobs: 50,

      // 额外的 Node.js 参数
      workerNodeArgs: ['--max-old-space-size=1024'],

      // Allow to respawn a dead worker pool
      // respawning slows down the entire compilation
      // and should be set to false for development
      poolRespawn: false,

      // 闲置时定时删除 worker 进程
      // 默认为 500ms
      // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
      poolTimeout: 2000,

      // 池(pool)分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池(pool)的名称
      // 可以修改名称来创建其余选项都一样的池(pool)
      name: "my-pool"
    }
  },
  // your expensive loader (e.g babel-loader)
]
```

### 3、url-loader

A loader for webpack which transforms files into base64 URIs.

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'responsive-loader', //Default: 'file-loader'
              quality: 85,
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  }
}
```

### 4、eslint-loader

``` js
module.exports = {
  // ...
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          eslintPath: path.join(__dirname, "reusable-eslint")
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
  // ...
};
```



## 4、Plugins

### 1、CopyWebpackPlugin

Copies individual files or entire directories to the build directory.

``` js
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/**/*',
        to: 'dest/',
        ignore: ['*.js'],
      },
    ]),
  ],
};
```

### 2、HtmlWebpackPlugin

简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。

``` js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin(
  	filename: path.resolve(__dirname, '../dist/index.html'),
    template: 'index.html',
    inject: true, //true || 'head' || 'body' || false 
    /* Inject all assets into the given template or templateContent. When passing 'body' all javascript resources will be placed at the bottom of the body element. 'head' will place the scripts in the head element. Passing true will add it to the head/body depending on the scriptLoading option. Passing false will disable automatic injections. */
    chunksSortMode: 'dependency',
    minify: {
  		collapseWhitespace: true,
  		keepClosingSlash: true,
  		removeComments: true,
  		removeRedundantAttributes: true,
  		removeScriptTypeAttributes: true,
  		removeStyleLinkTypeAttributes: true,
  		useShortDoctype: true
		}
  )]
};
```

### 3、MiniCssExtractPlugin

This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.

``` js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  }
}
```

### 4、HotModuleReplacementPlugin

启用[热替换模块(Hot Module Replacement)](https://v4.webpack.docschina.org/concepts/hot-module-replacement)，也被称为 HMR。

``` js
new webpack.HotModuleReplacementPlugin({
  // Options...
  /* multiStep (boolean)：设置为 true 时，插件会分成两步构建文件。首先编译热加载 chunks，之后再编译剩余的通常的资源。
		 fullBuildTimeout (number)：当 multiStep 启用时，表示两步构建之间的延时。
		 requestTimeout (number)：下载 manifest 的延时（webpack 3.0.0 后的版本支持）。*/
});
```

## 5、面试题

### 1、webpack中的module

module指模块化规范，webpack支持esmodule、commonjs、amd、assests（image，font，video，audio，json）

1. esm

* 关键字export，允许讲esm中内容暴露给其他模块，`export {bb}`

* 关键字import，导入模块:`import {aa} from './a.js'`

2. commonjs

* module.exports，允许将commonjs中的内容暴露给其他模块
* require，导入模块

### 2、webpack modules如何表达自己的各种依赖

* esm import语句
* commonjs require引入语句
* AMD define require
* css/sass/less @import

### 3、chunk和bundle的区别

1. chunk

chunk是webpack打包过程中modules的集合，是打包过程中的概念

* webpack的打包是从一个入口模块开始，入口模块引用其他模块，其他模块引用其他模块

* webpack通过引用关系逐个打包模块，这些module就形成了一个chunk。

* 如果有多个入口模块，可能会产生多条打包路径，每条路径会形成一个chunk。

2. bundle

是我们最终输出的一个或者多个打包好的文件

3. chunk和bundle的关系是什么

* 大多数情况下，一个chunk会产生一个bundle，但是如果加sourcemap，一个entry，一个chunk对应两个bundle。

* chunk是过程中的代码块，bundle是打包结果输出的代码块，chunk在构建完成就呈现为bundle。

### 4、chunk产生判断

```js
//webpack.config.js
/* 1个chunk，2个bundle(sourse-map) entry一个key */
module.exports = {
  mode: 'production',
  entry: {
    index: ['./src/index.js', './src/common.js']
  },
  output: {
    filename: "[name].js"
  },
  devtool: "source-map"
}

/* 2个chunk，4个bundle entry两个key */
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js', 
    common: './src/common.js'
  },
  output: {
    filename: "[name].js"
  },
  devtool: "source-map"
}

/* split chunk 文件分割 */
/* 5个chunks，5个bundle文件 */
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js', 
    other: './src/multiply.js'
  },
  output: {
    filename: "[name].js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks:{
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2, //至少两个chunk使用
          minSize: 0    //公用最小的值
        },
        vendor: {
          test: /node_module/, //正则匹配
          chunks: "initial",
          name: "vendor",
          enforce: true
        }
      }
      
		}
  }
}
/* 解析：5个chunks产生
1. entry index
2. entry other
3. runtimeChunk: "single", runtime指在浏览器运行时，webpack用来连接模块化的应用程序的所有代码。runtime包含在模块交互时，连接模块的加载和解析逻辑，包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。
引入模块，导入模块的逻辑单独拆分为一个chunk
4. splitChunk commons 公用chunk
5. splitChunk vendor 第三方包打包，匹配路径node_module文件夹下
*/
```

### 5、plugin和loader分别做什么？怎么工作？

1. Loader

模块转换器，将非js模块转换为webpack能识别的js模块。

本质上，webpack loader将所有类型的文件，转换为应用程序的依赖图可以直接引用的模块。

2. Plugin

扩展插件，webpack运行各个阶段，都会广播出对应的事件，插件去监听事件

3. Compiler

对象，包含了webpack环境的所有配置信息，包括options、loader、plugins。

webpack启动的时候实例化，它在全局中唯一，可以把它理解为webpack的实例。

4. Compliation

包含了当前的模块资源，编译生成的资源等。

webpack在开发模式下运行的时候，每当检测到一个文件变化时，就会创建一次新的Compliation。

### 6、webpack打包流程

1. 初始化参数：shell、webpack.config.js
2. 开始编译：初始化一个compiler对象，加载所有配置，开始执行编译
3. 确定入口：根据entry中的配置，找出所有的入口文件
4. 编译模块：从入口文件开始，调用所有的loader，再去递归的找依赖
5. 完成模块的编译：得到每个模块被翻译后的最终内容以及他们之间的依赖关系（依赖图）
6. 输出资源：根据得到的依赖关系，组装成一个个包含多个module的chunk
7. 输出完成：根据配置，确定要输出的文件名以及文件路径

## 6、webpack简单实现

官方定义：webpack是一个现代js应用程序的静态模块打包器。当webpack处理应用程序时，它会递归的构建一个依赖图，其中包含应用程序所需的每个模块，然后将所有这些模块打包成一个或多个bundle。

1. 找到一个入口文件
2. 解析这个入口文件，提起他的依赖

3. 解析入口文件依赖的依赖，递归的去创建一个依赖图，描述所有文件的依赖关系
4. 把所有文件打包成一个文件

**代码步骤**

1. 新建js文件
entry.js
message.js
name.js

2. 依赖关系解析
entry.js -> message.js -> name.js

3. 编写自己的webpack
```js
const fs = require('fs')
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    console.log(content)
}
createAsset("./source/entry.js")
```

4. 分析ast，思考如何能解析出entry.js的依赖
4.1 File -> programe
4.2 program -> body 里面是我们各种语法的描述
4.3 ImportDeclaration 引入的声明
4.4 ImportDeclaration source属性，source.value就是引入文件的地址`./message`
使用ast工具：https://astexplorer.net/

```js
import message from './message'
{
  "type": "File",
  "start": 0,
  "end": 31,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 31
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 31,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 31
      }
    },
    "sourceType": "module",
    "interpreter": null,
    "body": [
      {
        "type": "ImportDeclaration",
        "start": 0,
        "end": 31,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 31
          }
        },
        "specifiers": [
          {
            "type": "ImportDefaultSpecifier",
            "start": 7,
            "end": 14,
            "loc": {
              "start": {
                "line": 1,
                "column": 7
              },
              "end": {
                "line": 1,
                "column": 14
              }
            },
            "local": {
              "type": "Identifier",
              "start": 7,
              "end": 14,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 7
                },
                "end": {
                  "line": 1,
                  "column": 14
                },
                "identifierName": "message"
              },
              "name": "message"
            }
          }
        ],
        "importKind": "value",
        "source": {
          "type": "StringLiteral",
          "start": 20,
          "end": 31,
          "loc": {
            "start": {
              "line": 1,
              "column": 20
            },
            "end": {
              "line": 1,
              "column": 31
            }
          },
          "extra": {
            "rawValue": "./message",
            "raw": "'./message'"
          },
          "value": "./message"
        },
        "assertions": []
      }
    ],
    "directives": []
  },
  "comments": []
}
```

5. 生成entry.js的ast，使用babylon，一个基于babel的js解析工具
```js
const babylon = require('babylon')
const ast = babylon.parse(content, { //ast描述
    sourceType: "module"
})
```

6. 基于AST找到，entry.js里的ImportDeclaration Node，使用babel-traverse库，遍历ast
```js
 const traverse = require('babel-traverse').default
 traverse(ast, {  // 对每个节点进行的操作
        ImportDeclaration: ({node})=>{
            console.log(node)
        }
    })
}
```

7. 获取entry.js的依赖
```js
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8') //import message from './mywebpack.js' console.log(message)
    const ast = babylon.parse(content, { //ast描述
        sourceType: "module"
    })
    const dependences = [] //依赖数组
    traverse(ast, {  // 对每个节点进行遍历的操作
        ImportDeclaration: ({node})=>{
            dependences.push(node.source.value)
        }
    })
    console.log(dependences)
}
```

8. 优化createAsset函数，使其能区分不同的文件
8.1 获取文件的依赖，需给每个文件标注唯一的标识，可使用number自增。
8.2 获取到entry.js的id filename以及dependencies。
```js
let ID = 0
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8') //import message from './mywebpack.js' console.log(message)
    const ast = babylon.parse(content, { //ast描述
        sourceType: "module"
    })
    const dependences = [] //依赖数组
    traverse(ast, {  // 对每个节点进行遍历的操作
        ImportDeclaration: ({node})=>{
            dependences.push(node.source.value)
        }
    })
    const id = ID++
    return {
        id,
        filename,
        dependences
    }
}
const mainAsset = createAsset("./source/entry.js")
```

9. 已经获取到单个文件的依赖，需建立依赖图
9.1 新增createGraph，把createAsset引入createGraph
9.2 上面存储的是相对路径，需转变为绝对路径

10. 上面存储的是相对路径，需转变为绝对路径

11. 需要一个map，记录depend中的相对路径和childAsset的对应关系，用于后续做依赖引入

12. 遍历所有文件，生成依赖树
```js
function createGraph(entry){
    const asset = createAsset(entry)
    const allAsset = [asset] //使用数组储存 {id, filename, dependences}
    for(let asset of allAsset){
        asset.mapping = {}
        const dirname = path.dirname(asset.filename) //path文件夹
        console.log(dirname)
        asset.dependences.forEach(reletivePath => {  //['./message.js']
            const absolutePath = path.join(dirname, reletivePath) //获取绝对路径
            const childAsset = createAsset(absolutePath)
            asset.mapping[reletivePath] = childAsset.id 
            //记录depend中的相对路径和childAsset的对应关系，用于后续做依赖引入
            allAsset.push(childAsset) //推入数组，进行循环遍历
        })
    }
    return allAsset
}
/* 输出：
[
  {
    id: 1,
    filename: './source/entry.js',
    dependences: [ './message.js' ],
    mapping: { './message.js': 2 }
  },
  {
    id: 2,
    filename: 'source/message.js',
    dependences: [ './name.js' ],
    mapping: { './name.js': 3 }
  },
  { id: 3, filename: 'source/name.js', dependences: [], mapping: {} }
]*/
```
13. 新增一个bundle方法
14. 创建整体结构代码，需要接收参数立即执行，使用立即执行函数处理，参数为module
15. 编译源代码，使用babel-core、babel-preset-env
```js
const {code} = babel.transformFromAst(ast, null, {
   presets: ['env']
})
return {
    id,
    filename,
    dependences,
    code
}
```
16. 编译后的代码，加入result，commonjs的规范要求：
* module变量代表当前模块，是一个对象，它的exports属性是对外的接口。加载某个模块，其实就是加载该模块的module.exports的属性。
* require用于加载模块
```js
function bundle(graph){
    let modules = ''
    graph.forEach(module => {
        modules += `${module.id}:[
            function(require, module, exports){
                ${module.code}
            },
            ${JSON.stringify(module.mapping)} //依赖存储
        ],`
    })

    //实现require方法：modules[id]
    /**
    {
        0: [
            function(require, module, exports) {
                "use strict";
                var _message = require("./message.js");
                var _message2 = _interopRequireDefault(_message);
                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : {
                        default: obj
                    };
                }
                console.log(_message2.default);
            },
            {
                "./message.js": 1
            } //依赖存储
        ]
    }
     */
    const result = `
        (function(modules){ //立即执行函数
            function require(id){
                const [fn, mapping] = modules[id] 
                function localRequire(relativePath){
                    return require(mapping[relativePath])  //拿到id
                }
                const module = {exports:{}}
                fn(localRequire, module, module.exports) //fn为function(require, module, exports)
                return module.exports
            }
            require(0) //入口调用
        })({${modules}})
    `
    return result
}
```

