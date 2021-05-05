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
            console.log(this); // this是a 
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

### 7、面试题

```js

```

