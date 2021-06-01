# ES6及ESNext规范详解

## 1、ECMAScript规范发展

* ES6：指2015年6月发布的ES2015标准, 但是很多人在谈及ES6的时候, 都会把ES2016、ES2017等标准的内容也带进去
* ESNext：泛指, 它永远指向下一个版本，如当前最新版本是ES2020, 那么ESNext指的就是2021年6月将要发布的标准

## 2、ES6常用API

### 1、let和const

* 引入块级作用域
* 暂时性死区：不允许变量提升

```js
for(var i=0;i<=3;i++){
 setTimeout(function() { 
 console.log(i) 
 }, 10);
}//4~4

for(var i = 0; i <=3; i++) {
 (function (i) {
 setTimeout(function () {
 console.log(i);
 }, 10);
 })(i);
}//0~3

for(let i=0;i<=3;i++){
 setTimeout(function() { 
 console.log(i) 
 }, 10);
}//0~3，let为块级作用域
```

### 2、箭头函数

* 箭头函数里的this是定义的时候决定的, 普通函数里的this是使用的时候决定的
* 箭头函数不能用作构造函数

### 3、Class

* constructor：构造函数
* 可以使用set和get函数
* static为全局函数
* 直接使用变量即为类变量，无需声明

### 4、模板字符串

支持变量和对象解析和换行

```js
const b = 'lubai'
const a = `${b} - xxxx`;
const c = `我是换行
我换行了！
`;
```

面试题：编写render函数, 实现template render功能.

```js
//要求
const year = '2021';
const month = '10';
const day = '01';
let template = '${year}-${month}-${day}';
let context = { year, month, day };
const str = render(template)({year,month,day});
console.log(str) // 2021-10-01

//实现：高阶函数（函数返回函数）
function render(template) {
 	return function(context) {
 		return template.replace(/\$\{(.*?)\}/g, 
                   (match, key) => context[key]
        );
 	} 
}
//.*表示：任意值
//?表示：匹配前面的表达式0或1个，或制定非贪婪限定符
//表达式 .* 就是单个字符匹配任意次，即贪婪匹配。 
//表达式 .*? 是满足条件的情况只匹配一次，即最小匹配.
//match: ${year} ${month} ${day}
//key: year month day
```

参考资料：[replace的mdn资料](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

replace() 方法返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。

```js
str.replace(regexp|substr, newSubStr|function)
```

替换字符串可以插入下面的特殊变量名：

| 变量名    | 代表的值                                                     |
| --------- | ------------------------------------------------------------ |
| `$$`      | 插入一个 "$"。                                               |
| `$&`      | 插入匹配的子串。                                             |
| $`        | 插入当前匹配的子串左边的内容。                               |
| `$'`      | 插入当前匹配的子串右边的内容。                               |
| `$n`      | 假如第一个参数是 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。提示：索引是从1开始。如果不存在第 n个分组，那么将会把匹配到到内容替换为字面量。比如不存在第3个分组，就会用“$3”替换匹配到的内容。 |
| `$<Name>` | 这里*Name* 是一个分组名称。如果在正则表达式中并不存在分组（或者没有匹配），这个变量将被处理为空字符串。只有在支持命名分组捕获的浏览器中才能使用。 |

函数的参数：

| 变量名       | 代表的值                                                     |
| ------------ | ------------------------------------------------------------ |
| `match`      | 匹配的子串。（对应于上述的$&。）                             |
| `p1,p2, ...` | 假如replace()方法的第一个参数是一个[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。）例如，如果是用 `/(\a+)(\b+)/` 这个来匹配，`p1` 就是匹配的 `\a+`，`p2` 就是匹配的 `\b+`。 |

### 5、解构

#### 1、数组的解构

```js
// 基础类型解构
let [a, b, c] = [1, 2, 3]
console.log(a, b, c) // 1, 2, 3
// 对象数组解构
let [a, b, c] = [{name: '1'}, {name: '2'}, {name: '3'}]
console.log(a, b, c) // {name: '1'}, {name: '2'}, {name: '3'}
// ...解构
let [head, ...tail] = [1, 2, 3, 4]
console.log(head, tail) // 1, [2, 3, 4]
// 嵌套解构
let [a, [b], d] = [1, [2, 3], 4]
console.log(a, b, d) // 1, 2, 4
// 解构不成功为undefined
let [a, b, c] = [1]
console.log(a, b, c) // 1, undefined, undefined
// 解构默认赋值
let [a = 1, b = 2] = [3]
console.log(a, b) // 3, 2
```

#### 2、对象的解构

```js
// 对象属性解构
let { f1, f2 } = { f1: 'test1', f2: 'test2' }
console.log(f1, f2) // test1, test2
// 可以不按照顺序，这是数组解构和对象解构的区别之⼀
let { f2, f1 } = { f1: 'test1', f2: 'test2' }
console.log(f1, f2) // test1, test2
// 解构对象重命名
let { f1: rename, f2 } = { f1: 'test1', f2: 'test2' }
console.log(rename, f2) // test1, test2
// 嵌套解构
let { f1: {f11}} = { f1: { f11: 'test11', f12: 'test12' } }
console.log(f11) // test11
// 默认值
let { f1 = 'test1', f2: rename = 'test2' } = { f1: 'current1', f2: 'current2'}
console.log(f1, rename) // current1, current2
```

#### 3、解构的原理

针对可迭代对象的Iterator接口，通过遍历器按顺序获取对应的值进行赋值.

### 6、遍历

#### 1、Iterator接口

Iterator是一种接口，为各种不一样的数据解构提供统一的访问机制。任何数据解构只要有Iterator接口，就能通过遍历操作，依次按顺序处理数据结构内所有的成员。使用for of的语法遍历数据结构时，自动寻找Iterator接口。

可迭代对象是Iterator接口的实现，有两个协议：可迭代协议和迭代器协议。

* 可迭代协议：对象必须实现iterator方法，即对象或其原型链上必须有一个名叫Symbol.iterator的属性，该属性的值为无参函数，函数返回迭代器协议。
* 迭代器协议：产生一个有限或无限序列值，必须实现next()方法，方法返回对象有done和value属性。

```js
const obj = {
  count: 0,
  [Symbol.iterator]:()=>{
    return {
      next:()=>{
        obj.count++
        if(obj.count <= 10){
          return {
            value: obj.count,
            done: false
          }
        }else{
          return {
            value: undefined,
            done: true
          }
        }
      }
    }
  }
}

const iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
}

for(const item of iterable){
  console.log(item) //'a', 'b', 'c'
}
```

#### 2、for in

* 遍历当前对象，还包括原型链上的非Symbol的可枚举属性
* 不适合遍历数组，主要应用于遍历对象
* 可与break，continue，return配合

```js
let obj = {
  'a': 'test1',
  'b': 'test2'
}
for (const key in obj){
  console.log(key, obj[key]) //遍历数组时，key为数值下标字符串；遍历对象，key为对象字段名
}
```

#### 3、for of

* 遍历可迭代对象，包括Array，Map，Set，String，arguments对象，NodeList对象
* 仅遍历当前对象
* 可与break，continue，return配合

### 7、Object

#### 1、Object.keys

返回一个给定对象的自身可枚举属性组成的数值

#### 2、Object.values

返回一个给定对象的自身可枚举属性值数组

#### 3、Object.entries

返回一个给定对象的自身可枚举键值对数组

```js
const obj = {a: 1, b: 2}
const keys = Object.keys(obj) //[a, b]
const values = Object.values(obj) //[1, 2]
const entries = Object.entries(obj) //[['a', 1], ['b', 2]]
//手写getKeys
function getKeys(obj){
  const result = []
  for(const prop in obj){
    if(obj.hasOwnProperty(prop)){
      result.push(prop)
    }
  }
  return result
}
```

#### 4、Object.getOwnPropertyNames

返回一个给定对象拥有的可枚举或不可枚举属性名称字符串的数组

```js
Object.prototype.aa = '1111'
const testData = {
  a: 1,
  b: 2
}
for (const key in testData){
  console.log(key) //a b aa
}
console.log(Object.getOwnPropertyNames(testData)) //['a', 'b']
```

#### 5、Object.defineProperty和Object.defineProperties

object包括属性和方法，其中属性分为数据属性和访问器属性

* 数据属性
  * configurable：通过delete删除并重新定义属性，是否可修改属性的特性，已经是否可把它改为访问器属性，默认true。
  * enumerable：是否可通过for-in循环，默认true。
  * writable：属性值是否可修改，默认true。
  * value：属性实际的值，默认为undefined

* 访问器属性
  * configurable
  * enumerable
  * get：获取函数，在读取属性时调用，默认undefined
  * set：设置函数，在写入属性时调用，默认undefined

Object.defineProperty(obj, propertyName, descriptor) //对象，属性名称，描述符对象

Object.defineProperties(obj, descriptor)//对象，描述符对象（属性与添加或修改的属性一一对应）

```js
let book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 1
  },
  year: {
    get(){
      return this.year_
    },
    set(val){
      this.year_ = val
    }
  }
})
```

#### 6、Object.create

创建一个新对象，两个参数：

* 第一个参数作为新对象的[[proto]]属性的值，根据已有对象作为原型，创建新对象
* 第二个参数为可选对象，每个属性都会作为新对象的自身属性，对象的属性值以descriptor的形式出现，且enumerable默认为false

```js
const person = {
  isHuman: false,
  printIntroduction: function(){
    console.log(`My name is ${this.name}. ${this.isHuman}`)
  }
}
const me = Object.create(person)
me.name = 'scp'
me.isHuman = true
me.printIntroduction()   //My name is scp. true
console.log(person)      //{isHuman: false, printIntroduction: ƒ}

function Person(name, sex){
  this.name = name
  this.sex = sex
}
const b = Object.create(Person.prototype, {
  name: {
    value: 'coco',
    writable: true,
    configurable: true,
    enumerable: true
  },
  sex: {
    enumerable: true,
    get: function(){
      return 'hello sex'
    },
    set: function(val){
      console.log('set value:', val)
    }
  }
})
console.log(b.name) //coco
console.log(b.sex)  //hello sex
```

Object.create(null)创建一个对象，但这个对象的原型为null，即Fn.prototype=null

#### 7、Object.getOwnPropertyDescriptor和Object.getOwnPropertyDescriptors

返回指定对象的属性描述符对象

```js
const obj1 = {}
Object.defineProperty(obj1, 'p', {
  value: 'good',
  writable: false
})
console.log(Object.getOwnPropertyDescriptor(obj1, 'p'))
console.log(Object.getOwnPropertyDescriptors(obj1))
/*
{
	value: 'good',
	writable: false,
	enumerable: false,
	configurable: false
}
{
	p: {
		value: 'good',
		writable: false,   //可写，修改属性值
		enumerable: false, //可被for in遍历
		configurable: false //删除属性或修改属性特性
	}
}
*/
```

#### 8、Object.assign

合并对象，接收一个目标对象和一个或多个源对象作为参数，将每个源对象中可枚举(Object.propertyIsEnumeralbe()返回true)和自有属性(Object.hasOwnProperty()返回true)复制到目标对象。

* 以字符串和符合为键的属性会被复制。

* 对每个符合条件的属性，使用源对象上的[[get]]取得属性的值，然后使用目标对象上的[[set]]设置属性的值
* 浅拷贝，类似于{...a, ...b}，不能在两个对象间转移获取函数和设置函数

```js
let dest = {}
let src = {id: 'src', a: {}}
let result = Object.assign(dest, src)
console.log(dest === result) //true
console.log(result) //{id: 'src'}
console.log(dest.a === src.a) //true

dest = {
  set a(val){
    console.log(`Invoked dest setter with param ${val}`)
  }
}
src = {
  get a(){
    console.log('Invoked src getter')
    return 'foo'
  }
}
Object.assign(dest, src) 
//Invoked src getter
//Invoked dest setter with param foo
console.log(dest)
//{set a(val){}}
```

### 8、数组Array

#### 1、Array.flat

按照一个可指定的深度递归遍历数组，将所有元素与遍历到的子数组中的元素合并为一个新数组返回

```js
const arr = [1,2,[3,4,[5,6]]]
arr.flat() //[1,2,3,4,[5,6]]
arr.flat(2) //[1,2,3,4,5,6]
arr.flat(Infinity) //[1,2,3,4,5,6]

//手写flat
Array.prototype.flat = function(d=1){
  if(d>0){
    return this.reduce((res,val)=>{
      if(Array.isArray(val)){
        res = res.concat(val.flat(d-1))
      }else{
        res = res.concat(val)
      }
      return res
    })
  }else{
    return this.slice()
  }
}

//全部打平
function flat(arr){
  let res = []
  let length = arr.length
  for(let i=0; i<length; i++){
    if(Object.prototype.toString.call(arr[i]) === '[object Array]'){
      res = res.concat(flat(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res
}
```

#### 2、Array.includes

是否包含一个指定的值，返回boolean

Array.includes(valueToFind, fromIndex) 

#### 3、Array.from

从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例

Array.from(arrayLike, mapFn)

#### 4、Array.find

返回数组中满足提供的测试函数的第一个元素的值，否则返回undefined

Array.find(callback(element, index, array(数组本身)))

### 9、反射Reflect和代理Proxy

* 反射Reflect
  * 将Object对象上的明显属于语言内部的方法，放在Reflect对象上
  * 让Object操作变为函数行为，eg：name in obj和delete，变为Reflect.has(obj,name)和Reflect.deleteProperty(obj,name)
  * Reflect对象的方法与Proxy对象的方法一一对应。让Proxy对象可以方便的调用对应的Reflect方法，完成默认行为。
  * 通过defineProperty设置writable为false的对象，不能使用Proxy

* 代理Proxy
  * 定义： const proxy = new Proxy(target, handler)，target代理对象，handle捕获器
  * handle参数get：trapTarget(目标对象)，property(代理属性)，receiver(代理对象)
  * handle参数set：trapTarget(目标对象)，property(代理属性)，value(赋给属性的值)，receiver(代理对象)

```js
const target = {
  foo: 'bar',
  baz: 'qux'
}
const handler = {
  get(trapTarget, property, receiver){
    let decoration = ''
    if(property === 'foo'){
      decoration = '!!!'
    }
    return Reflect.get(...arguments) + decoration
  },
  set(trapTarget, property, value, receiver){
    return Reflect.set(...arguments) + 'set'
  }
}

const proxy = new Proxy(target, handler)
proxy.foo = 'good'
console.log(proxy.foo) //good!!!
console.log(target.foo)//good
```

## 3、babel工具链使用

>参考资料：
>
>1、[ast查看链接](https://astexplorer.net/)
>
>2、[bable官网](https://www.babeljs.cn/)

babel是一个工具链，用于将es2015+版本的代码转换为向后兼容的js语法。提供了插件功能，一切功能都可以以插件来实现，方便使用和弃用。babel处理步骤：

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

### 1、AST

资料：[AST详解与运用](https://zhuanlan.zhihu.com/p/266697614)

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

### 2、手写babel原理

```js

```

### 3、插件添加及使用

```js

```

