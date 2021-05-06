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



## 4、vue-cli源码分析

