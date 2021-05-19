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



### 7、Object



### 8、数组Array



### 9、Promise



### 10、反射和代理







## 3、babel工具链使用