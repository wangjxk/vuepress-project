# this指向、作用域、闭包

## 1、this指向

参考资料：[MDN中this解析](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

1、对于直接调用的函数来说，不管函数被放在了什么地方，this都是window 

2、对于被别人调用的函数来说，被谁点出来的，this就是谁 

3、call、apply时，this是第一个参数。bind要优与call/apply哦，call参数多，apply参数少 

4、在构造函数中，类中(函数体中)出现的this.xxx=xxx中的this是当前类的一个实例 

5、箭头函数没有自己的this，需要看其外层的是否有函数，如果有，外层函数的this就是内部箭头函数的this，如果没有，则this是window 

### 1、默认绑定（函数直接调用）

非严格模式下，默认绑定指向全局（`node` 中式 `global`）

```js
//1、非严格模式
function myfunc() { 
    console.log(this) 
}
myfunc();  //window

//2、严格模式
function fn() {
    'use strict' //严格模式下，禁止this关键字指向全局对象
    console.log(this)
}
fn() //undefined

//面试题1
var a = 1
function fn() {
  var a = 2
  console.log(this.a) // console what ?
}
fn() //1

//面试题2
let a = 1 //let定义自己的作用域，不挂载至window
function fn() {
  var a = 2
  console.log(this.a)
}
fn() //undefined

//面试题3
var b = 1
function outer () {
  var b = 2
  function inner () { 
    console.log(this.b)
  }
  inner()
}
outer() //1

//面试题4
const obj = {
  a: 1,
  fn: function() {
    console.log(this.a)
  }
}

obj.fn() //1
const f = obj.fn
f() //undefined
```

### 2、隐式绑定（属性访问调用，函数被别人调用）

隐式绑定的 `this` 指的是调用堆栈的**上一级**（`.`前面**一**个）

```js
function fn () {
  console.log(this.a)
}
const obj = {
  a: 1
}
obj.fn = fn
obj.fn() //1

function fn () {
  console.log(this.a)
}
const obj1 = {
  a: 1,
  fn
}
const obj2 = {
  a: 2,
  obj1
}
obj2.obj1.fn() //1

//面试题：隐式绑定失败场景
//1、函数赋值
const obj1 = {
  a: 1,
  fn: function() {
    console.log(this.a)
  }
}
const fn1 = obj1.fn // 将引用给了fn1，等同于写了 function fn1() { console.log(this.a) }
fn1() //undefined
//2、setTimeout
setTimeout(obj1.fn, 1000) //undefined
//3、函数作为参数传递
function run(fn) {
  fn()
}
run(obj1.fn) //undefined，传进去的是一个引用
//4、一般匿名函数也是会指向全局的
var name = 'The Window';
var obj = {
    name: 'My obj',
    getName: function() {
        return function() { // 这是一个匿名函数
            console.log(this.name)
        };
    }
}
obj.getName()()
//5、IIFE
(function(){
   var a = 1
   console.log(this.a) 
})(); //undefined
```

### 3、显示绑定（apply\call\bind）

* apply

  * func.apply(thisArg, [argsArray])，thisArg为undefined或null时指向全局
  * 返回调用有指定this值和参数的函数的结果

* call

  * function.call(thisArg, arg1, arg2, ...)
  * 返回使用调用者提供的 `this` 值和参数调用该函数的返回值，若该方法没有返回值，则返回 `undefined`。

* bind

  * function.bind(thisArg[, arg1[, arg2[, ...]]])

    * thisArg：调用绑定函数时作为 `this` 参数传递给目标函数的值。 如果使用[`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符构造绑定函数，则忽略该值。当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object`。如果 `bind` 函数的参数列表为空，或者`thisArg`是`null`或`undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。
    * arg1, arg2, ...：当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

  * 返回：返回一个原函数的拷贝，并拥有指定的 **this** 值和初始参数。

  * MDN的bind实现

```js
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind) (function(){
  var ArrayPrototypeSlice = Array.prototype.slice; // 为了 this
  Function.prototype.bind = function(otherThis) {
    // 调用者必须是函数，这里的 this 指向调用者：fn.bind(ctx, ...args) / fn
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var baseArgs= ArrayPrototypeSlice.call(arguments, 1), // 取余下的参数
        baseArgsLength = baseArgs.length,
        fToBind = this, // 调用者
        fNOP    = function() {}, // 寄生组合集成需要一个中间函数，避免两次构造
        fBound  = function() {
          // const newFn = fn.bind(ctx, 1); newFn(2) -> arguments: [1, 2]
          baseArgs.length = baseArgsLength; // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments); // 参数收集
          return fToBind.apply( // apply 显示绑定 this
            // 判断是不是 new 调用的情况，这里也说明了后边要讲的优先级问题      
            fNOP.prototype.isPrototypeOf(this) ? this : otherThis, baseArgs
          );
        };
		// 下边是为了实现原型继承
    if (this.prototype) { // 函数的原型指向其构造函数，构造函数的原型指向函数
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; // 就是让中间函数的构造函数指向调用者的构造
    }
    fBound.prototype = new fNOP(); // 继承中间函数，其实这里也继承了调用者了

    return fBound; // new fn()
  };
})();
```

```js
function fn () {
  console.log(this.a)
}
const obj = {
  a: 100
}
fn.call(obj) //100

function fn() {
  console.log(this)
}
// 为啥可以绑定基本类型 ?
// boxing(装箱) -> (1 ----> Number(1))
// bind 只看第一个 bind（堆栈的上下文，上一个，写的顺序来看就是第一个）
fn.bind(1).bind(2)() //1
```

面试题资料：[手写bind\apply\call](https://blog.csdn.net/qq_37288477/article/details/87884518?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)

### 4、new创建对象

如果函数 `constructor` 里没有返回对象的话，`this` 指向的是 `new` 之后得到的实例

```js
function foo(a) {
  this.a = a
}
const f = new foo(2)
f.a // 2

function bar(a) {
  this.a = a
  return {
    a: 100
  }
}
const b = new bar(3)
b.a //100
```

### 5、箭头函数

编译期间确定的上下文，不会被改变，哪怕你 `new`，指向的就是**上一层**的上下文，箭头函数没有自己的this，需要看其外层的是否有函数，如果有，外层函数的this就是内部箭头函数的this，如果没有，则this是window

```js
var a = { 
    myfunc: function() { 
        setTimeout(function(){ 
            console.log(this); // this是window
        }, 0) 
    } 
};
a.myfunc(); //window

var a = { 
    myfunc: function() { 
        var that = this; 
        setTimeout(function(){ 
            console.log(that); // this是a 
        }, 0) 
    } 
};
a.myfunc(); //a对象：{myfunc: ƒ}

// 箭头函数 
var a = { 
    myfunc: function() { 
        setTimeout(() => { 
            console.log(this); // this是a 
        }, 0) 
    } 
};
a.myfunc(); //a对象：{myfunc: ƒ}

function fn() {
  return {
    b: () => {
      console.log(this)
    }
  }
}
fn().b() //window
fn().b.bind(1)() //window
fn.bind(2)().b.bind(3)() //Number(2)
```

### 6、优先级

「new 绑」 > 「显绑」 > 「隐绑」 > 「默认绑定」

```js
// 隐式 vs 默认 -> 结论：隐式 > 默认
function fn() {
  console.log(this)
}
const obj = {
  fn
}
obj.fn() //obj对象：{fn: ƒ}

// 显式 vs 隐式 -> 结论：显式 > 隐式
obj.fn.bind(5)() //5

// new vs 显式 -> 结论：new > 显式
function foo (a) {
    this.a = a
}
const obj1 = {}
var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) //2

// new
var baz = new bar(3)
console.log(obj1.a) //2
console.log(baz.a)  //3

// 箭头函数没有 this，比较没有意义
```

## 2、作用域

### 1、数据存储

* 栈（FIFO先进先出）放置静态内存，编译期分配：全局变量

* 堆（FILO先进后出）放置动态内存，执行期分配：函数执行上下文

### 2、执行上下文

当函数执行时，会创建一个执行上下文的环境，分为创建和执行两个阶段：

* 创建阶段：函数被调用未执行任何代码时，创建一个拥有3个属性的对象

```js
executionContext = { 
    scopeChain: {}, // 创建作用域链（scope chain） 
    variableObject: {}, // 初始化变量、函数、形参 
    this: {} // 指定this 
}// 初始化 VO -> 建立作用域链 -> 确定 This 上下文
```

* 执行阶段：分配变量（提升）、函数的引用，赋值；执行代码。

```js
function demo(num) { 
    var name = 'xiaowa'; 
    var getData = function getData() {}; 
    function c() {} 
}
demo(100); 

// 创建阶段大致这样，在这个阶段就出现了【变量提升(Hoisting)】 
executionContext = { 
    scopeChain: { ... }, 
    variableObject: { 
		arguments: { // 创建了参数对象 
            0: 100, 
            length: 1 
        },
        num: 100, // 创建形参名称，赋值/或创建引用拷贝
        c: pointer to function c() // 有内部函数声明的话，创建引用指向函数体 
        name: undefined, // 有内部声明变量a，初始化为undefined 
        getData: undefined // 有内部声明变量b，初始化为undefined 
    },
    this: { ... } 
}
    
// 代码执行阶段，在这个阶段主要是赋值并执行代码 
executionContext = { 
    scopeChain: { ... }, 
    variableObject: { 
        arguments: { 
            0: 100, 
            length: 1 
        },
        num: 100, 
        c: pointer to function c(),
        name: 'xiaowa', // 分配变量，赋值 
        getData: pointer to function getData() // 分配函数的引用，赋值 
    },
    this: { ... } 
}
```


### 3、执行上下文栈

* 浏览器中的js解释器是单线程的，相对于浏览器中同一时间只能做一个事情
* 代码中只有一个全局执行上下文和无数个函数执行上下文，这些组成了执行上下文栈（Execution Stack）
* 一个函数的执行上下文，在函数执行完毕后，会被移出执行上下文栈。

```js
function c(){ 
    console.log('ok'); 
}

function a(){ 
    function b(){ 
        c(); 
    }
    b(); 
}

a();
```

<img src="/img/chain.jpeg">

### 4、作用域与作用域链

* 作用域：全局作用域、函数作用域、ES6块级作用域。作用域的最大用途就是隔离变量或函数，并控制生命周期。作用域在函数执行上下文创建时定义好的，不是函数执行是定义
* 作用域链：当一个块或函数嵌套在另一个块或函数中时，发生了作用域嵌套。在当前函数中如果无法找到某个变量，就会往上一级嵌套的作用域中去寻找，直到找到该变量或抵达全局作用域，这样的链式关系称为作用域链（Scope Chain）
  * 代码执行流没进入一个新上下文（全局、函数、块级作用域），就会创建一个作用域链，用于搜索变量和函数
  * 函数或块的局部上下文可以访问自己作用域内的变量，也可以访问任何包含上下文及全局上下文中的变量。
  * 全局上下文只能访问全局作用域的变量和函数，无法访问局部上下文的任何数据

```js
function a () { 
    return function b() { 
        var myname = 'b'; 
        console.log(myname); // b 
    } 
}

function c() { 
    var myname = 'c'; 
    b(); 
} 

var b = a(); 
c(); //输出b

// 去掉函数b中的myname声明后 
function a () { 
    return function b() { 
        //var myname = 'b'; 
        console.log(myname); //Uncaught ReferenceError: myname is not defined
    } 
}

function c() { 
    var myname = 'c'; 
    b(); 
} 

var b = a(); 
c();
```

### 5、作用域链增强

某些语句会导致在作用域链前端临时添加一个上下文，这个上下文在代码执行后会被删除。

* try/catch语句中的catch块：会创建一个新的变量对象，包含要抛出的错误对象的申明
* with语句：向作用域链前端添加制定的对象

```js
//范例1
var a = 15, b = 15;
with( { a: 10 } ){
  var a = 30, b = 30;
  console.log(a); // 30
  console.log(b); // 30
}
console.log(a); // 15，原值
console.log(b); // 30，b被更新

//范例2
var a = 15, b = 15;
with( { a: 10 } ){
  b = 30;
  console.log(a); // 10，指定对象a的值
  console.log(b); // 30
}
console.log(a); // 15
console.log(b); // 30
```

## 3、闭包

高级程序设计：闭包指有权访问另一个函数作用域中的变量的函数，可以理解为那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。

使用场景：

* 封装私有变量（AMD的框架等都使用）

```js
//普通定义类
function Person（）｛
	this.attackVolume = 100
｝
Person.prototype = {
    attack(){
        this.attackVolume += 1
    }
}
var person = new Person()
console.log(person.attackVolume)

//工厂方法
function Person(){
    var attackVolume = 100
    return ｛
    	attack(){
            this.attackVolume += 1
        }
    ｝
}
var person = new Person()
console.log(person.attackVolume)
```

* 存储变量

```js
function getList(){
    let localData = null
    return {
        getData(){
            if(localData){
                return Promise.resolve(localData)
            }
            return fetch('xxx').then(res =>{
                localData = res.json()
            })
        }
    }
}
const listDataManager = getList()
window.onscroll = () => {
    text.innerHTML = listDataManager.getData() //可能获取缓存数据
}
```

## 4、面试题

### 1、this指向

```js
function foo() {
  console.log( this.a )
}
var a = 2;
(function(){
  "use strict"
  foo();
})();//2,类似函数直接执行，"use strict"为迷惑，放在foo函数中为undefined


function foo() {
  "use strict"
  console.log( this.a)
}
var a = 2;
(function(){
  foo();
})();//Uncaught TypeError: Cannot read property 'a' of undefined

var name="the window"
var a={
  name:"My Object", 
  getName: function(){ 
    return this.name
  } 
}
a.getName()   // My Object
(a.getName)() // My Object
(a.getName = a.getName)() //the window，函数赋值后，this指向全局
(a.getName, a.getName)() //the window，函数操作后，this指向全局

var x = 3
var obj3 = {
  x: 1,
  getX: function() {
    var x = 5
    return function() {
      return this.x
    }(); 
  }
}
console.log(obj3.getX()) //3，立即执行函数this指向全局

function a(x){
  this.x = x
  return this
}
var x = a(5) 
var y = a(6) 
console.log(x.x) // undefined
console.log(y.x) // 6

/* 解析
window.x = 5;
window.x = window;
window.x = 6;
window.y = window;
console.log(x.x) // void 0 其实执行的是 Number(6).x
console.log(y.x) // 6
*/
```

```js
//隐式绑定
function show () { 
    console.log('this:', this);  //this指向obj
}
var obj = { 
    show: show 
};
obj.show();//this: { show: [Function: show] }

//隐式绑定失败场景
function show () { 
    console.log('this:', this);  //this指向obj
}
var obj = { 
   show: function () { 
       show(); //类似于函数直接调用
   } 
};
obj.show();//this: window

var obj = { 
    show: function () { 
        console.log('this:', this); 
    } 
};
(0, obj.show)(); //this: window，逗号表达式返回函数，函数再执行，let f = (0, obj.show), f()

//隐式绑定失败场景
var obj = { 
    sub: {
        show: function () { 
            console.log('this:', this); 
        } 
    }
};
obj.sub.show() //this: {show: ƒ}，sub对象，sub.出来的

//优先级与显示绑定
var obj = { 
    show: function () { 
        console.log('this:', this); 
    } 
};
var newobj = new obj.show(); //this为newobj，输出this: show {}，类似new function(){console.log('this:', this); }

var obj = { 
    show: function () { 
        console.log('this:', this); 
    } 
};
var newobj = new (obj.show.bind(obj))(); //new优先级强，this为newobj，输出this: show {}

//事件触发
var obj = { 
    show: function () { 
        console.log('this:', this); 
    } 
};
var elem = document.getElementById('book-search-results'); 
elem.addEventListener('click', obj.show);  //this为elem对象
elem.addEventListener('click', obj.show.bind(obj));  //this为obj，显示绑定
elem.addEventListener('click', function () { obj.show(); }); //this为obj，执行时为obj
```

### 2、作用域链

```js
var person = 1
function showPerson(){
	var person = 2;
	console.log(person);
}
showPerson(); //2

var person = 1
function showPerson(){
    console.log(person);
	var person = 2;
}
showPerson(); //undefined

var person = 1
function showPerson(){
    console.log(person);
	var person = 2;
    function person(){} //函数声明也可提前
}
showPerson(); //ƒ person(){}

var person = 1
function showPerson(){
    console.log(person);
    function person(){} 
    var person = 2;
}
showPerson(); //ƒ person(){}，函数提升在变量提升之前

for(var i = 0; i < 10; i++) { 
    console.log(i); 
}//0~9

for(var i = 0; i < 10; i++) { 
    setTimeout(function(){ 
        console.log(i); 
    }, 0); 
}//10~10,注意for循环结束后，i还会++

for(var i = 0; i < 10; i++) { 
    (function(i){ 
        setTimeout(function(){ 
            console.log(i);
        }, 0)
    })(i); 
}//0~9

for(let i = 0; i < 10; i++) { 
    console.log(i); 
}//0~9
```

### 3、面向对象

```js
function Person() { 
    this.name = 1; 
	return {}; 
}
var person = new Person(); 
console.log('name:', person.name); //name: undefined

function Person() { 
    this.name = 1; 
}
Person.prototype = { 
    show: function () { 
        console.log('name is:', this.name); 
    } 
};
var person = new Person(); 
person.show(); //name is: 1，可执行原型链的方法，作用域链从当前开始

function Person() { 
    this.name = 1; 
}
Person.prototype = { 
    name: 2, 
    show: function () { 
        console.log('name is:', this.name); 
    } 
};
var person = new Person(); 
Person.prototype.show = function () { //覆盖原型链上的show方法
    console.log('new show'); 
};
person.show(); //new show

function Person() { 
    this.name = 1; 
}
Person.prototype = { 
    name: 2, 
    show: function () { 
        console.log('name is:', this.name); 
    } 
};
var person = new Person(); 
var person2 = new Person(); 
person.show = function () { //这里是person
    console.log('new show'); 
};
person2.show();  //name is: 1
person.show();   //new show
```

### 4、综合题

```js
function Person() { 
    this.name = 1; 
}
Person.prototype = { 
    name: 2, 
    show: function () { 
        console.log('name is:', this.name); 
    } 
};
Person.prototype.show(); //name is: 2
(new Person()).show();  //name is: 1
```



