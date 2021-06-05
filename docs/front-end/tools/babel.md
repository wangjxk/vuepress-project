# babel使用及分析

>参考资料
>
>1、[ast查看链接](https://astexplorer.net/)
>
>2、[bable官网](https://www.babeljs.cn/)
>
>3、[AST详解与运用](https://zhuanlan.zhihu.com/p/266697614)
>
>4、[babel插件说明](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

babel是一个工具链，用于将es2015+版本的代码转换为向后兼容的js语法。提供了插件功能，一切功能都可以以插件来实现，方便使用和弃用。

## 1、安装

* @babel/core：内部核心的编译和生成代码的方法

* @babel/cli：babel命令行工具内部解析相关方法

* @babel/preset-env：babel编译结果预设值，使用can i use网站作为基设。

* @babel/polyfill：es6语法的补丁，安装了所有符合规范的 polyfifill 之后，我们需要在组件引

  用这个模块，就能正常的使用规范中定义的方法了。

注意：polyfill通常需要--save，其他使用--save-dev即可

## 2、使用

* 安装@babel/core和@babel/cli即可使用命令行解析工具
* 输出编译代码compile: babel index.js -o output.js
* 使用preset预设，配置.babelrc中presets属性，适用于语法层面范畴
* 使用polyfill，需要在代码中引入polyfill模块，给所有方法打补丁，保证运行正常，适用于方法层面

```json
//presets预设使用
//index.js
const func = () => console.log("hello es6");
const { a, b = 1 } = { a: "this is a" };

//.babelrc配置，presets预设1
｛
	"presets": [
      "@babel/preset-env"
    ]
｝

//输出
"use strict";
var func = function func() {
  return console.log("hello es6");
};

var _a = {
  a: "this is a"
},
a = _a.a,
_a$b = _a.b,
b = _a$b === void 0 ? 1 : _a$b;

//.babelrc配置，，presets预设2
｛
	"presets": [
      ["@babel/preset-env",{
  		 "targets": ">1.5%"
 	  }]
    ]
｝

//输出：箭头函数和解构未转换
"use strict";
const func = () => console.log("hello es6");
const {
  a,
  b = 1
} = {
  a: "this is a"
};
```

```js
//polyfill使用
import "@babel/polyfill";
const array = [1, 2, 3];
console.log(array.includes(2));

//输出
"use strict";
require("@babel/polyfill"); //加载了全部polyfill
const array = [1, 2, 3];
console.log(array.includes(2));

//按需加载
//.babelrc配置
｛
	"presets": [
      ["@babel/preset-env",{
  		 "targets": ">1.5%"，
          "useBuiltIns": "usage", //按需加载
          "corejs": 3 //指定corejs版本
 	  }]
    ]
｝
//index.js，去除import
const array = [1, 2, 3];
console.log(array.includes(2));
//输出
"use strict";
require("core-js/modules/es.array.includes.js");
var array = [1, 2, 3];
console.log(array.includes(2));
```

解析：@babel/preset-env中useBuiltIns 说明

* false：此时不对 `polyfill` 做操作。如果引入 `@babel/polyfill`，则无视配置的浏览器兼容，引入所有的 `polyfill`，默认选项
* entry：根据配置的浏览器兼容，引入浏览器不兼容的 `polyfill`。需要在入口文件手动添加 `import '@babel/polyfill'`，会自动根据 `browserslist` 替换成浏览器不兼容的所有 `polyfill`，这里需要指定 `core-js` 的版本
* usage：会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 `polyfill`，实现了按需添加

## 3、babel处理步骤：

* 解析：接收代码并输出AST（抽象语法树）
  * 词法分析：把字符串形式的代码转换为令牌（tokens）流，令牌看作是一个扁平的语法片段数组
  * 语法分析：把一个令牌流转换为AST，使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作
* 转换：接收AST并对其遍历，在此过程中对节点进行添加、更新和移除等操作。这是Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分
* 生成：把最终的AST转换成字符串形式的代码，同时创建源码映射（source maps）。代码生成过程：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串

具体模块功能：

* @babel/parser : 转化为 AST 抽象语法树； 

* @babel/traverse 对 AST 节点进行递归遍历； 

* @babel/types 对具体的 AST 节点进行进一修改； 

* @babel/generator : AST抽象语法树生成为新的代码

## 4、AST

抽象语法树，每一层为一个结点，ast由单一节点或成百上千个节点组成，可以描述用于静态分析的程序语。Babel是通过Babylon([https://github.com/babel/babylon](https://link.zhihu.com/?target=https%3A//github.com/babel/babylon))实现的ast解析器。

```js
//type为节点类型
//每一种类型的节点定义了一些附加属性来进一步描述该节点类型
//Babel还为每个节点额外生成了一些属性，用于描述该节点在原始代码中的位置，比如如start、end
{
 type: "FunctionDeclaration", 
 id: {...},
 params: [...],
 body: {...} }{
 type: "Identifier",
 name: ...
}
{
 type: "BinaryExpression",
 operator: ...,
 left: {...},
 right: {...} 
}
```

```js
function square(n) {
 return n * n; 
}
//对应的ast生成，json格式
{
  "type": "Program",
  "start": 0,
  "end": 38,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 38,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 15,
        "name": "square"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 16,
          "end": 17,
          "name": "n"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 38,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 22,
            "end": 35,
            "argument": {
              "type": "BinaryExpression",
              "start": 29,
              "end": 34,
              "left": {
                "type": "Identifier",
                "start": 29,
                "end": 30,
                "name": "n"
              },
              "operator": "*",
              "right": {
                "type": "Identifier",
                "start": 33,
                "end": 34,
                "name": "n"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

## 5、手写babel原理

(add 2 (subtract 40 2)) 编译成 add(2, subtract(40, 2)) 

静态编译：字符串 -> 字符串

思路：正则匹配、状态机、编译器处理流程（解析、转换、生成）

* 分词：将表达式分词，水平状态

```js
/*
[
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '40' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
]
*/
function generateToken(str){
    let current = 0  //下标
    let tokens = []  //记录分词列表
    
    while(current < str.length){
        let char = str[current]

        //括号分词：记录为词语
        if(char === '('){
            tokens.push({ //末尾添加对象返回长度，pop删除数组最后一项，返回元素，栈方法FILO
                type: 'paren',
                value:'('
            })
            current++
            continue;
        }

        //括号分词：记录为词语
        if(char === ')'){
            tokens.push({
                type: 'paren',
                value: ')'
            })
            current++
            continue;
        }

        //空格分词：直接跳过
        if(/\s/.test(char)){ 
            current++
            continue
        }

        //数字分词：二次遍历
        if(/[0-9]/.test(char)){
            let numberValue = ''
            while(/[0-9]/.test(char)){
                numberValue += char
                char = str[++current]
            }
            tokens.push({
                type: 'number',
                value: numberValue
            })
            continue
        }

        //字符串分词
        if(/[a-z]/.test(char)){
            let strValue = ''
            while(/[a-z]/.test(char)){
                strValue += char
                char = str[++current]
            }
            tokens.push({
                type: 'name',
                value: strValue
            })
            continue
        }

        throw new TypeError('type error')
    }

    return tokens
}
```

* 生成ast：垂直结构，estree规范

```js
/* json.cn可查看json信息
{
    "type":"Program",
    "body":[
        {
            "type":"CallExpression",
            "name":"add",
            "params":[
                {
                    "type":"NumberLiteral",
                    "value":"2"
                },
                {
                    "type":"CallExpression",
                    "name":"subtract",
                    "params":[
                        {
                            "type":"NumberLiteral",
                            "value":"40"
                        },
                        {
                            "type":"NumberLiteral",
                            "value":"2"
                        }
                    ]
                }
            ]
        }
    ]
}
*/
function generateAST(tokens){
    let current = 0
    let ast = {
        type: 'Program',
        body: []
    }
    //闭包处理
    function walk(){
        let token = tokens[current];
        if(token.type === 'number'){
            current++
            return {
                type: 'NumberLiteral',
                value: token.value
            }
        }
        //左括号为层级开始，为执行语句
        if(token.type === 'paren' && token.value === '('){
            token = tokens[++current]
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: []
            }
            token = tokens[++current]
            while(
                (token.type !== 'paren')||(token.type === 'paren' && token.value !== ')')
            ){
                node.params.push(walk())  //递归调用
                token = tokens[current]  //取当前值即可，walk()里完成指针移动
            }
            current++
            return node
        }
    }

    while(current < tokens.length){
        ast.body.push(walk())
    }

    return ast

}

```

* 遍历ast，转化为新的ast

```js
/*
{
    "type":"Program",
    "body":[
        {
            "type":"ExpressionStatement",
            "expression":{
                "type":"CallExpression",
                "callee":{
                    "type":"Identifier",
                    "name":"add"
                },
                "arguments":[
                    {
                        "type":"NumberLiteral",
                        "value":"2"
                    },
                    {
                        "type":"CallExpression",
                        "callee":{
                            "type":"Identifier",
                            "name":"subtract"
                        },
                        "arguments":[
                            {
                                "type":"NumberLiteral",
                                "value":"40"
                            },
                            {
                                "type":"NumberLiteral",
                                "value":"2"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}*/
function transformer(ast){
    let newAst = {
        type: 'Program',
        body: []
    }
    ast._context = newAst.body //ast子元素挂载
    //类似于babel插件功能
    DFS(ast, {//生命周期，enter、exit
        NumberLiteral: {
            enter(node, parent){
                //父元素记录子元素值，为父元素CallExpression做准备
                parent._context.push({ 
                    type: "NumberLiteral",
                    value: node.value
                })
            }
        },
        //NumberLiteral的父元素为CallExpression
        CallExpression: {
            enter(node, parent){
                let expression = {
                    type: 'CallExpression',
                    callee: {
                        type: "Identifier",
                        name: node.name
                    },
                    arguments:[]
                }
                //a.子元素值赋值到父亲元素的arguments去
                node._context = expression.arguments

                //b.二次操作
                if(parent.type !== "CallExpression"){
                    expression = {
                        type: "ExpressionStatement",
                        expression: expression
                    }
                }
                parent._context.push(expression)
            }
        }
    })
    return newAst

}

function DFS(ast, visitor){
    //遍历子元素数组
    function traverseArray(children, parent){
        children.forEach(child => tranverseNode(child, parent))
    }

    function tranverseNode(node, parent){
        let methods = visitor[node.type]
        if(methods && methods.enter){
            methods.enter(node, parent)
        }
        switch(node.type){
            case "Program"://子元素body，父元素node
                traverseArray(node.body, node)
                break
            case "CallExpression"://子元素params，父元素node
                traverseArray(node.params, node)
                break;
            case "NumberLiteral":
                break;
            default:
                break;
        }
        if(methods && methods.exit){
            methods.exit(node, parent)
        }
    }

    return tranverseNode(ast, null)

}
```

* 基于ast，生成代码

```js
//add(2, subtract(40, 2));
function generate(ast){
    switch(ast.type){
        case "Identifier": return ast.name;
        case "NumberLiteral": return ast.value;
        //每个子元素一行展示
        case "Program": return ast.body.map(subAst => generate(subAst)).join('\n') 
        case "ExpressionStatement": return generate(ast.expression) + ";"
        //函数调用形式 add (参数, 参数， 参数)
        case "CallExpression": return generate(ast.callee) + "(" + ast.arguments.map(arg => generate(arg)).join(', ') + ")"
        default: break
    }
}
```

## 6、插件添加及使用

babel插件为一个函数，入参对象使用types对象，返回一个对象，输出对象中有visitor属性。在ast转换阶段时，进行二次处理。

* types对象：拥有每个单一类型节点的定义，包括节点的属性、遍历等信息。
* visitor属性：插件的主要访问者，接收state和path参数，path是两个节点连接的对象

```js
//input.js
1 + 1;

//output.js
1 - 1;

//plugin.js
export default function({types: t}){
  return{
    visitor:{
       BinaryExpression(path){
          path.node.operator = "-"
       }
    }
  }
}

//.babelrc
{
    "plugins": [
       ["./plugin"]
    ]
}
```

