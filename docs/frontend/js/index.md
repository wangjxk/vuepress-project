# JavaScript常见问题梳理

## 1、this指向

### 1、全局函数

this指向全局对象window，注意严格模式下，this为undefined

```javascript
//[object Window]
alert(this); 			
function f(){
  alert(this)
}
f(); 

// undefined
function demo() {
  'use strict';
   alert(this); 
}
demo();
```

### 2、对象方法

this指向调用该方法的对象

```javascript
let name = 'finget'
let obj = {
 name: 'FinGet',
 getName: function() {
   alert(this.name);
 }
}
obj.getName(); // FinGet

let fn = obj.getName;
fn(); //finget this -> window
```

### 3、构造函数

this指向创建出的实例

```javascript
function demo() {
  this.testStr = 'this is a test';
}
let a = new demo();
alert(a.testStr);  // 'this is a test'
```

### 4、定时器、回调函数

定时器setTimeout或setInterval，以及回调函数或匿名函数自调用，this指向全局对象window

```javascript
//定时器
setTimeout(function() {
   alert(this); // this -> window ，严格模式 也是指向window
},500)

var name = 'my name is window';
var obj = {
     name: 'my name is obj',
     fn: function () {
          var timer = null;
          clearInterval(timer);
          timer = setInterval(function () {
              console.log(this.name);  //my name is window, this指向window
          }, 1000)
     }
}

//回调函数
var o = {
    age : 12,
    say : function() {
        function callback() {
            return this.age;
        }
        func(callback);
    }
};
function func(callback) {
    var name = "Xiao Ming";
    console.log(name + " is " + callback() + " years old.");
}
o.say(); //Xiao Ming is undefined years old.
/* 解析：函数内部的【this】指向于此函数的调用者（拥有者）。
在上面这个例子中，虽然【callback】函数定义于对象【o】的【say】方法中，但实际上由于【callback】是在【func】函数中进行的普通调用，那么【func】中的【callback】的调用者我们便可以理解为是【window】对象 */
//当使用一个对象的未定义的属性时不会报错，并返回“undefined”，而直接使用一个未定义的变量时便会报错

//优化
console.log(name + " is " + callback.call(o) + " years old.");
console.log(name + " is " + callback.apply(o) + " years old.");
console.log(name + " is " + callback.bind(o)() + " years old.");
var callback = () => this.age;
```

### 5、事件函数

元素绑定事件，事件触发后执行函数中，this指向的是当前元素

```javascript
window.onload = function() {
 let $btn = document.getElementById('btn');
 $btn.onclick = function(){
 		alert(this); // this -> 当前触发元素
 }
}
```

### 6、箭头函数

this指向箭头函数定义时所处的对象

```javascript
 var name = 'my name is window';
 var obj = {
      name: 'my name is obj',
      fn: function () {
          var timer = null;
          clearInterval(timer);
          timer = setInterval(() => {
              console.log(this.name);  //my name is obj
          }, 1000)
     }
}
```

### 7、call、apply、bind

* call和apply：改变this指向后执行函数。
  * call(thisScope, arg1, arg2, arg3...);         //多个参数
  * apply(thisScope, [arg1, arg2, arg3...]);   //两个参数

* bind：改变this指向后，返回函数。

  bind(thisScope, arg1, arg2, arg3...)

```javascript
var person = {
  name: 'pig',
  say: function(a){
    alert(this.name + " say " + a)
  }
};
person.say('hello'); //pig say hello

var name = 'duck';
person.say.call(window, 'hello'); //duck say hello

var arr = [1, 2, 3, 4];
Math.max.apply(null, arr); //4, null表示不改变this指向

function multiply (x, y, z) {
    return x * y * z;
}
var double = multiply.bind(null, 2);
//Outputs: 24
console.log(double(3, 4));

var person1 = {
  name: 'dog',
  sayHello: function(){
    setTimeout(function(){
      alert(this.name + ' say hello');
    }.bind(this), 1000)
  }
}
person1.sayHello(); //dog say hello
```

```javascript
//面试题解析
var x = 20;
var a = {
   x: 15,
   fn: function() {
     var x = 30;
     return function() {
      return this.x
     }
   }
}
console.log(a.fn());   //ƒ(){return this.x}
console.log((a.fn())()); //20 a.fn()返回的是一个函数，()()这是自执行表达式。this -> window
console.log(a.fn()());//20 a.fn()相当于在全局定义了一个函数，然后再自己调用执行。this -> window
console.log(a.fn()() == (a.fn())()); //true
console.log(a.fn().call(this)); //20, 这段代码在全局环境中执行，this -> window
console.log(a.fn().call(a)); //15
```

## 2、Promise

### 1、参考资料

1. [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)
2. [深入理解 Promise (上)](https://juejin.im/entry/5844c8e461ff4b006b9e2ebd)
3. [从手写一个符合Promise/A+规范Promise来深入学习Promise](https://juejin.im/post/5b854f22e51d4538e567b7de)
4. [Promise深度学习---我のPromise/A+实现](https://juejin.im/post/5a59e78ff265da3e3e33ba6e)
5. [【第1738期】100 行代码实现 Promises/A+ 规范](https://mp.weixin.qq.com/s/Yrwe2x6HukfqJZM6HkmRcw)
6. [从零开始手写promise](https://zhuanlan.zhihu.com/p/144058361)

###  2、构造函数和状态

#### 1. 构造函数

```JavaScript
var promise = new Promise(function(resolve, reject) {
    // 异步处理
    // 处理结束后、调用resolve 或 reject
});
```

#### 2. 状态

<img src="/img/promise-status.png">

* 初始状态为pending

* 执行resolve事件，状态变为fulfilled，执行onFulfilled函数。

* 执行reject事件，状态变为rejected，执行onRejected函数。

<img src="/img/promise-then-catch.png">

* then方法为promise对象注册onFulfilled和onRejected函数

* catch方法为promise对象注册onRejected函数

### 3、六大方法

#### 1. Promise.resolve

静态方法`Promise.resolve(value)`可以认为是`new Promise()`方法的快捷方式，比如`Promise.resolve(42)`可以认为是以下代码的语法糖:

```javascript
new Promise(function(resolve){
  resolve(42)
})
```

这个静态方法会让`Promise`对象立即进入确定（即resolved）状态，并将42传递给后面`then`里所指定的`onFulfilled`函数。作为`new Promise()`的快捷方式，在进行`Promise`对象的初始化或者编写测试代码的时候都非常方便。

简单总结一下`Promise.resolve`方法的话，它的作用就是将传递给它的参数填充（Fulfilled）到promise对象后并返回这个promise对象。

#### 2. Promise.reject

`Promise.reject(error)`是和`Promise.resolve(value)`类似的静态方法，是`new Promise()`方法的快捷方式。比如`Promise.reject(new Error("出错了"))`就是下面代码的语法糖形式:

```javascript
new Promise(function(resolve,reject){
    reject(new Error("出错了"));
});
```

简单总结一下`Promise.reject`方法的话：它的功能是调用该promise对象通过then指定的onRejected函数，并将错误（Error）对象传递给这个onRejected函数

#### 3. Promise.then

promise.then(onFulfilled, onRejected)

**① 回调函数异步执行**

```javascript
var promise = new Promise(function (resolve){
    console.log("inner promise"); // 1
    resolve(42);
});
promise.then(function(value){
    console.log(value); // 3
});
console.log("outer promise"); // 2
```

`Promise/A+`统一规定：Promise只能使用异步调用方式

**② 返回值**

不管你在回调函数`onFulfilled`中会返回一个什么样的值,或者不返回值，该值都会由`Promise.resolve(return的返回值)`进行相应的包装处理，因此，最终then的结果都是返回一个新创建的promise对象

也就是说，Promise.then不仅仅是注册一个回调函数那么简单，它还会将回调函数的返回值进行变换，创建并返回一个promise对象。正是`then`函数中有了这样返回值的机制，才能使得在整个`Promise`链式结构当中，每个`then`方法都能给下一个`then`方法传递参数。现在我们怎么知道返回的`Promise`是之前的还是新的？另外该`Promise`的状态又是如何？

```javascript
var aPromise = new Promise(function (resolve) {
  resolve(100);
});
var thenPromise = aPromise.then(function (value) {
  console.log(value);
});
var catchPromise = thenPromise.catch(function (error) {
  console.error(error);
});
console.log(aPromise !== thenPromise); // => true
console.log(thenPromise !== catchPromise);// => true
console.log(aPromise, thenPromise, catchPromise) // Promise { 100 } Promise { <pending> } Promise { <pending> }
```

从上面的结果来看，实际上不管是then还是catch方法调用，都返回了一个新的promise对象。

**③ promise穿透**

我们先来举个例子：

```javascript
Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
  console.log(result);
});
```

如果你认为输出的是 bar，那么你就错了。实际上它输出的是 foo！

产生这样的输出是因为你给`then`方法传递了一个非函数（比如`promise`对象）的值，代码会这样理解：`then(null)`，因此导致前一个`promise`的结果产生了坠落的效果,也就是和下面的代码是一样的，代码直接穿透了`then(null)`进入了下一层链：

```javascript
Promise.resolve('foo').then(null).then(function (result) {
  console.log(result);
});
```

随便添加任意多个`then(null)`，结果都是不变的

#### 4. Promise.catch

**① 语法糖的本质**

这里我们再说一遍，实际上`Promise.catch`只是`promise.then(undefined, onRejected)`方法的一个别名而已。 也就是说，这个方法用来注册当`Promise`对象状态变为`Rejected`时的回调函数。可以看下面代码，两者写法是等价的，但是很明显`Promise.catch`会让人第一眼看上去不会眼花缭乱：

```javascript
// 第一种写法
Promise.resolve()
.then( (data) => console.log( data ) )
.then( undefined, (err) => console.log( err ))

// 第二种写法
Promise.resolve()
.then( (data) => console.log( data ) )
.catch( (err) => console.log( err ) ) 
```

那么现在我们来说说为啥推荐使用第二种写法而不是第一种：

- 使用`promise.then(onFulfilled, onRejected)`的话,在`onFulfilled`中发生异常的话，`onRejected`中是捕获不到这个异常的。而且如果链很长的情况，每一条链上都要这样写。
- 在`promise.then(onFulfilled).catch(onRejected)`的情况下`then`中产生的异常能在`.catch`中捕获。`.then`和`.catch`在本质上是没有区别的，需要分场合使用。

**② 只有一个主人**

我们上面已经说过了，在书写很长的`Promise`链式，从代码清晰度和简易程度来讲，在最后添加`catch`是远远比在每一层链上写`onRejected`回调函数是要好的，因为`catch`函数可以捕获`Promise`链中每一层节点中的错误，这句话本身没有错，但从这句话延伸出一种错误的理解：`catch`同时监控着所有节点。实际上catch函数在同一个时间点只属于某一个Promise，因为它的主人是随着程序的执行而不断变化的，我们来举个例子：

```javascript
let p1 = new Promise((resolve,reject)=> {
  // 第一层具体执行逻辑
  resolve(1)           // Promise(1)
}).then(res=>{
  // 第二层具体执行逻辑
  return 2             // Promise(2)
}).then(res =>{
  // 第三层具体执行逻辑
  return 3             // Promise(3)
}).catch(err=>{
  console.log(err)
})
```

在上述例子中，如果整个程序是每一步都正确执行，那么会顺序产生3个`Promise`对象，分别是`Promise(1)`，`Promise(2)`，`Promise(3)`：

- 可是如果在第一层具体执行逻辑出错了后，那实际上后面的两个`then`中的回调函数压根不会被异步触发执行，所以直接会异步触发`catch`中的回调函数执行，所以这种情况下`catch`是`Promise(1)`对象的`catch`。
- 如果第一层具体执行逻辑正确执行，就会异步触发第二个`then`中的回调函数执行，那么同理，在第二层具体执行逻辑抛错，会导致`Promise(2)`的状态变化，异步触发`catch`中的回调函数执行，所以这种情况下`catch`是`Promise(2)`对象的`catch`。
- 同理`Promise(3)`也是如此。

总结下来就是： 整个Promise链中，catch只属于异步触发它当中回调函数执行的那个Promise，并不属于所有Promise

#### 5. Promise.all

`Promise.all`接收一个`promise`对象的数组作为参数，当这个数组里的所有`promise`对象全部变为`resolve`或`reject`状态的时候，它才会去调用`.then`方法。

传递给`Promise.all`的`promise`并不是一个个的顺序执行的，而是同时开始、并行执行的,我们可以举个例子:

```javascript
let arr = [1000, 3000, 5000, 7000]
let promiseArr = []

for(let i = 0; i < arr.length; i++ ) {
  let newPromise = new Promise((resolve, reject) => {
    setTimeout(()=> {
      console.log(arr[i])
      resolve(arr[i])
    }, arr[i])
  })
  promiseArr.push(newPromise)
}

Promise.all(promiseArr).then(res => {
  console.log(res)
}).catch(err =>{
  console.log(err)
})
```

为什么从这个例子能看出数组当中的`Promise`是并行的？因为所有`Promise`执行完只用了7秒，如果4个`Promise`是按顺序执行的，那么应该是16秒，或者在7-16之间，因为4个`Promise`并不是同时执行的，同时执行的话总时间就是那个花费时间最长的`Promise`

当然还有一个很重要的点，就是如果所有的`Promise`中只有一个执行错误，那么整个`Promise.all`不会走`Promise.all().then()`这个流程了，而是走`Promise.all().catch()`这个流程，但是要注意的是虽然走到了`Promise.all().then()`这个流程，但是不影响其他Promise的正常执行

#### 6. Promise.race

`Promise.race`的使用方法和`Promise.all`一样，接收一个`promise`对象数组为参数。`Promise.race` 只要有一个promise对象进入`FulFilled`或者`Rejected`状态的话，就会继续进行后面的处理。这里依旧有两个点要注意：

- 和`Promise.all`一样是所有数组当中的`Promise`是同时并行的
- `Promise.race`在第一个`promise`对象变为`Fulfilled`之后，并不会取消其他`promise`对象的执行 下面我们来举个例子：

```javascript
let arr = [1000, 3000, 5000, 7000]
let promiseArr = []

for(let i = 0; i < arr.length; i++ ) {
  let newPromise = new Promise((resolve, reject) => {
    if(i === 0) { 
      reject(new Error('第二个错误')) 
    } else {
      setTimeout(()=> {
        console.log(arr[i])
        resolve(arr[i])
      }, arr[i])
    }
  })
  promiseArr.push(newPromise)
}

Promise.race(promiseArr).then(res => {
  console.log(res)
}).catch(err =>{
  console.log(err)
})
// 控制台报错
// 3000
// 5000
// 7000
```

这里我们再复习一下`Node`当中事件循环的知识：

- 第一层循环：i为0的时候异步触发了`Promise.race().catch()`，这里面的回调代码被放在了微队列当中，后面的3个`setTimeout`宏任务的回调函数代码被放在了`timer`阶段中的队列当中（其实并不是这样，因为3个定时器都有延迟，都是在后面的事件循环中添加进来的）
- 第二层循环：清空微任务队列，所以控制台打印出了错误，然后清空宏任务，分别打印出3000，5000，7000

### 4、错误捕获

#### 1. 使用reject而不是throw

在最开始我们先来一句比较重要的话：Promise的构造函数，以及被then调用执行的函数基本上都可以认为是在 try...catch 代码块中执行的，所以在这些代码中即使使用throw ，程序本身也不会因为异常而终止。

所以其实如果在`Promise`中使用`throw`语句的话，会被`try...catch`住，最终`promise`对象也变为`Rejected`状态。但是我们为什么还是推荐使用`Promise.reject`呢？有下面俩个原因：

- 我们很难区分throw 是我们主动抛出来的，还是因为真正的其它异常导致的
- Promise构造函数当中通过throw抛出的错误未必会被Promise.catch捕获到

我们下面就说说什么时候通过throw抛出的错误未必会被Promise.catch捕获到：

```javascript
var p1 = new Promise(function(resolve, reject) {
  setTimeout(() => {
      throw Error('async error')   
  })
})
.then(res => {
  console.log(res)
  console.log('程序正常执行了')
})
.catch(err => {
  console.log(err)
  console.log('捕获到错误了')
})
// 直接报错
```

这个例子非常典型，想知道为什么错误没有被catch住，我们要倒推出原因：

- 首先我们要明确的是，不论是then还是catch中注册的回调函数，都是由Promise状态的变化触发的，现在也就说`Promise`状态始终在`pending`状态
- 其次，前面不是说`reject`和`throw`都能最终让`Promise`进入`onReject`状态么，这里的`throw`为什么没有改变`Promise`的状态
- 原因还是要从事件循环来说，我们好好想想，这段代码在第一轮的事件循环当中`setTimeout`的回调函数被放在了`timer`阶段的队列当中，但是它没有执行啊，所以第一轮`Promise`状态一直处于`pending`，所以`then`和`catch`部分的代码全部没有被触发，也就在第一轮事件循环当中跳过了。然后在第二轮循环当中才执行了`throw`语句，把错误直接抛到了全局，就直接报错。所以上面的代码和下面的效果一样，`catch`怎么可能捕获到在它后面执行的代码呢？

```javascript
var p1 = new Promise(function(resolve, reject) {
})
.then(res => {
})
.catch(err => {
})
throw Error('async error')   
```

#### 2. 在then中进行reject

如果我们想在`then`当中使用`reject`,首先我们要懂两个知识点：

- `then`中的回调函数中，`return`的返回值类型不光是简单的字面值，还可以是复杂的对象类型，比如`promise`对象等
- 只要修改这个返回的`Promise`的状态，在下一个`then`中注册的回调函数中的`onFulfilled`和`onRejected`的哪一个会被调用也是能确定的

所以我们可以这样写代码就能在`then`当中使用`reject`：

```javascript
var onRejected = console.error.bind(console);
var promise = Promise.resolve();
promise.then(function () {
    var retPromise = new Promise(function (resolve, reject) {
       reject(new Error("this promise is rejected"));
    });
    return retPromise;
}).catch(onRejected);
```

当然还能更简洁一些：

```javascript
promise.then(function () {
    return Promise.reject(new Error("this promise is rejected"));
}).catch(err=>{
  console.log(err)
});
```

### 5、返回值

关于返回值的知识其实我们在前面都已经讲过，这里总结一下并举个例子巩固一下：

- Promise会将最后的值存储起来，如果在下次使用promise方法的时候回直接返回该值的promise。
- Promise能够链式调用的原因是它的每一个方法都返回新的promise，哪怕是finally方法，特殊的是finlly会返回上一个promise的值包装成的新promise，并且finally也不接收参数，因为无论Promise是reject还是fulfill它都会被调用。

下面我们举个例子：

```javascript
var p1 = new Promise(function(resolve, reject) {
  reject(1)
}).catch(err => {
  console.log(err)
  return 2
})

setTimeout(() => {
  p1.then(res => console.log(res))
}, 1000)
// 先打印出1
// 一秒之后打印出2
```

这个例子也很经典，即使你已经搞清楚了上面的知识点，面对这个例子也还是会蒙掉，我们来说一下：

- 首先通过构造函数创建了一个`Promise`,我们这里称之为`Promise_1`,通过`reject`进入`catch`函数，然后注意，`catch`的回调函数返回了一个2，实际上这里是返回了一个新的`Promise`,我们这里称`Promise_2`，它的状态是`fulfilled`。
- 所以这里很迷惑人的一点就是`p1`最开始是指向`Promise_1`的，当`Promise_2`返回的时候，它又指向了`Promise_2`
- 最后定时器经过一秒打印出2，因为`Promise_2`在被返回的时候就是`fulfilled`状态，`then`函数当中的回调函数自然而然的被异步触发。

### 6、async和await

co模块的语法糖（用于generator函数的自动执行）

```javascript
(function* (){
	var f1 = yield readFile('/etc/fstab')
    var f2 = yield readFile('/etc/shells')
    console.log(f1.toString())
})()
```

资料：

1、[深入理解 ES7 的 async/await](https://juejin.cn/post/6844903457170653198)

2、[async/await 优雅的错误处理方法](https://juejin.cn/post/6844903767129718791)

3、[如何在 JS 循环中正确使用 async 与 await](https://juejin.cn/post/6844903860079738887)

参考总结：

- 如果一个函数通过`async`来声明，则一定可以通过`await`关键字来取到该函数的返回值。
- 如果一个函数通过`async`来声明，则一定也可以通过`.then()`方法来取到该函数返回的`promise`中的值(因为`return`出来的结果一定是`promise`对象)
- 如果一个函数没有通过`async`来声明，但只要`return`出现的是`promise`对象 ，则也可以通过`await`来拿到`promise`里面的取值。
- 如果一个函数没有通过`async`来声明，但只要`return`出来一个`promise`，也可以通过`.then()`拿到`promise`里面值（在没有`async/await`的年代就是这样做的）
- 如果一个函数通过`async`声明，则在该函数内部可以使用`await`，也可以使用`.then()`
- 如何一个函数没有通过`async`声明，则在该函数内部不可以使用`await`，但是可以使用`.then()`

#### 1、async

**① 语法糖**

`async`关键词是添加在函数定义之前的，一个`async`函数是定义会返回`promise`的函数的简便写法。比如，以下两个定义是等效的：

```javascript
function f() {
    return Promise.resolve('TEST');
}

// asyncF is equivalent to f!
async function asyncF() {
    return 'TEST';
}
```

相似地，会抛出错误的`async`函数等效于返回将失败的`promise`的函数：

```javascript
function f() {
    return Promise.reject('Error');
}
// asyncF is equivalent to f!
async function asyncF() {
    throw 'Error';
}
```

**② async函数的返回值**

其实`async`返回值有下面这4种情况：

- 返回值是Promise对象

  这种情况是最常见的，也是符合`async`定义的

  ```javascript
  const request = require('request');
  async function f1() {
      return new Promise(function(resolve, reject) {
          request('http://www.baidu.com',function(err, res, body) {
              resolve(body)
          })
      })
  }
  (async function() {
      console.log(f1());
  })()
  ```

- 返回值是普通值

  如果`return`出来一个普通值，会被包装成一个`promise`对象。该`promise`状态为`fullfilled`, 该`promise`的值为该简单值。可以使用`.then()`方法取到该`promise`对象的值（该值就是`async`声明的函数返回来的简单值）

  ```javascript
  async function f1 () {
      return 10;
  }
  
  console.log(f1());     // Promise {<resolved>: 10}
  fn1().then(function (x) {
    console.log(x);      // 10
  })
  ```

- 返回值是Error类型

  如果`return`出来是一个`Error`类型，则同样会被包装成一个`promise`对象，该`promise`对象的状态是`reject`, 值是`Error`的信息，想取出来该`promise`的报错信息，可以通过`.then`的第二个参数，或者通过`.catch`方法

  ```javascript
  async function f1() {
    throw new Error('ssss');
  }
  f1().catch(function(e){
    console.log(e)
  })
  ```

- 没有返回值

  如果没有`return`任何东西，则同样会返回一个`promise`对象。该`promise`对象的状态为`fullfilled`，该`promsie`的值为`undefined`.

  ```javascript
  const rp = require('request-promise');
  async function f1() {
      await rp('http://www.beibei.com');
  }
  
  (async () => {
      console.log(await f1());          // undefined
  })()
  ```

#### 2、Await

`await`关键字，它只能在`async`函数内使用，让我们可以等待一个`promise`。

如果在`async`函数外使用`promise`，我们依然需要使用`then`和回调函数，例如普通函数和全局函数。

所以，目前取出`promise`对象中的值的方法有两种：.then 和 await

**① 最大的作用**

await最大的作用就是代替.then方法,让整个代码成为同步的写法，更容易理解

- 串行异步

  当串联异步的操作时，`await`要比`.then`方法更加简洁

  ```javascript
  // 使用 .then 进行串联操作
  function asyncFunc() {
    otherAsyncFunc1()
    .then(function(x){
      return otherAsyncFunc2();
    })
    .then(function(x) {
      console.log(x)
    })
  }
  
  // 使用await关键字
  async function asyncFunc() {
      const result1 = await otherAsyncFunc1();
      const result2 = await otherAsyncFunc2();
  }
  ```

- 并行异步

  虽然并行异步的代码还是离不开`Promise.all`或者`Promise.race`方法，但是用来处理最终的并行结果的代码也是很简洁的

  ```javascript
  // 使用 .then 方法
  function fn1() {
      let p1 = rp('http://www.baidu.com');
      let p2 = rp('http://www.baidu.com');
      Promise.all([p1, p2]).then(function([res1, res2]) {
          console.log(res1,res2)
      })
  }
  
  // 使用await 关键字
  async function fn1() {
      let p1 = rp('http://www.baidu.com');
      let p2 = rp('http://www.baidu.com');
      let [res1, res2] = await Promise.all([p1, p2]);
      console.log(res1,res2)
  }
  ```

**② await本质**

从上面我们列出的这么多代码来看，`await`的本质就是`.then`方法的语法糖，事实上，`async/await`其实会翻译成`promise`与`then`回调。每次我们使用`await`，解释器会创建一个`promise`然后把`async`函数中的后续代码（也就是书写在`await`后面的代码）放到`then`回调里，并被计划在`promise`完成之后执行。所以下面两段代码是等价的：

```javascript
// await写法
await foo();         
console.log("hello");

// .then写法
foo().then(() => {
    console.log("hello");
});
```

所以`await`关键字给我们的感觉是会让代码执行到`await`这一行的时候，“暂停执行”，等到异步的操作有了结果，再继续往下执行。那么，问题来了，`await`关键字会阻塞线程吗？不会，因为还是我们上面说的那句话：await本质是.then的语法糖, `await`并没有改变js的单线程的本质，没有改变`event_loop`的模型，只是方便我们写代码，更快捷，更清晰,如下所示：

```javascript
let p1 = new Promise((resolve,reject)=> {
  console.log(1)
  setTimeout(()=> {
    resolve(6)
  },1000)
})

async function multipleRequestAsync() {
  console.log(3)
  let result = await p1
  console.log(result)
  console.log(7)
}

console.log(2)
multipleRequestAsync()
console.log(4)
console.log(5)
// 1 2 3 4 5 6 7
```

所以，通过上面这一段代码我们就能明白：

await关键字不会阻塞js的event_loop的线程。当代码执行到async函数遇到await关键词时，不会继续往下执行,而是会发起异步调用，推入异步任务队列，等待异步的结果，但是此时node线程并不会闲到无所事事，而是继续执行async函数被调用的那一行下面的代码。等到异步操作的结果发生了变化时，将异步结果推入任务队列，event_loop从队列中取出事件，推入到执行栈中。

#### 3、错误处理

##### 1. try-catch

因为当我们使用`async-await`的时候我们的代码是同步的写法，同步的错误处理理所应当会先想到的就是`try-catch`，所以对于`async-await`的处理我们可以采用`try-catch`:

```javascript
(async () => {
  const fetchData = () => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              reject('fetch data is me')
          }, 1000)
      })
  }

  try {
    let result = await fetchData()
    console.log(result)
  } catch (error) {
    console.log(error) //fetch data is me
  }
})()
```

实际通过上述的代码可以看到：try-catch的方法在对于错误类型单一的情况是简洁又明了的，但是如果是不同的类型错误类型如果我们还采用`try-catch`的方法也不是不行，只能在错误处理的代码上就要分类处理，还不一定能准确知道到底是哪部分出了问题，所以使用`try-catch`在多类型错误的分类和定位上是吃亏的：

```javascript
  try {
    let result = await fsData()        // 读取文件
    let result = await requestData()   // 网络请求
    let result = await readDb()        // 读取数据库
  } catch (error) {
    // 不同的错误进行分类
  }
```

##### 2. .then和catch方法输出值

针对`try-catch`的问题我们希望就是在有不同类型错误可能出现的情况下我们还是能准确并分别对不同的类型做处理。而`async/await`本质就是`promise`的语法糖，既然是`promise`那么就可以使用`then`函数和catch函数，通过then和catch输出值。

```javascript
(async () => {
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          reject('fetch data is me')
      }, 1000)
    })
  }

  const data = await fetchData().then(data => data ).catch(err => console.log(err))
})()
```

当存在不同类型的错误的时候，我们就能分别在对应的不同的`Promise`的链的末尾的`catch`当中书写不同的处理函数

```javascript
const data = await fsData().then(data => data ).catch(err => // 文件读取错误的处理)
const data = await requestData().then(data => data ).catch(err => // 网络请求错误的处理)
const data = await readDb().then(data => data ).catch(err => // 数据库读写错误的处理)
```

##### 3. 更优雅的方式

使用then和catch函数及数组解构区分正常和异常结果，封装公共处理函数。

```javascript
function handleError(err) {
  if(err !== null)
  // 具体处理错误
}
function handleData(data) {
  if(data !== null)
  // 具体处理结果
}
const [err, data] = await fetchData().then(data => [null, data] ).catch(err => [err, null])
handleError(err)
handleData(data)
    
// 抽离成公共方法
const awaitWrap = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null])
}

const [err1, data1] = await awaitWrap(fsData())
handleFsError(err1)
handleFsData(data1)
```

####  4、循环中的使用

参考资料：[如何在 JS 循环中正确使用 async 与 await](https://juejin.cn/post/6844903860079738887)

* 如果你想连续执行`await`调用，请使用`for`循环(或任何没有回调的循环)。

* 永远不要和`forEach`一起使用`await`，而是使用`for`循环(或任何没有回调的循环)。

* 不要在 `filter` 和 `reduce` 中使用 `await`，如果需要，先用 `map` 进一步骤处理，然后在使用 `filter` 和 `reduce` 进行处理。

## 3、generator

### 1、迭代器 Iterator

迭代器Iterator 是 ES6 引入的一种新的遍历机制，一种接口，本质是一个指针对象，供for...of消费。

* 迭代器有next()方法，返回对象{value:'', done: false}，第一次调用时返回第一个值
* 迭代器部署在Symbol.iterator属性上
* Array、Map、Set、String、函数的arguments对象等具有原生Iterator接口

```js
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]();
iter.next() //{value: 'a', done: false}
iter.next() //{value: 'b', done: false}
iter.next() //{value: 'c', done: false}
iter.next() //{value: undefined, done: true}

for(let a in arr){
    console.log(a)  //0 1 2, 取键名
}
for(let a of arr){
    console.log(a)  //a b c, 取键值
}
```

### 2、generator

生成遍历器对象的函数，使用*表示函数（星号可以紧挨着function关键字，也可以在中间添加一个空格），内部使用yield定义内部状态。

* 每当执行完一条yield语句后函数就会自动停止执行, 直到再次调用next();

* yield关键字只可在生成器内部使用，在其他地方使用会导致程序抛出错误

* 可以通过函数表达式来创建生成器, 但是不能使用箭头函数
* 可以在generator函数运行的不同阶段从外部内部注入不同的值，从而改变函数的行为
  * yield语句无返回值，总是返回undefined
  * next方法可以带一个参数，参数被当做上一条yield的返回值。

```js
function* generator() {
 const list = [1, 2, 3];
 for (let i of list) {
 yield i;
 } }
let g = generator();
console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true}

function* foo(x){
    var y = 2 * (yield(x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}

var a = foo(5);
a.next() //{value: 6, done: false}
a.next() //{value: NaN, done: false}， 2* undefined / 3 = NaN
a.next() //{value: NaN, done: true}， 5 + NaN + undefined = NaN

var b = foo(5)
b.next() //｛value: 6, done: false｝
b.next(12) //{value: 8, done: false}  2 * 12 / 3 = 8
b.next(13) //{value: , done: true} 5 + 2 * 12 + 13 = 42
```

#### 1、throw方法

generatorh函数返回的遍历器对象都有一个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。

* 若Generator函数体内部署了try...catch代码块，那么遍历器的throw方法抛出的错误不会影响下一次遍历，否则遍历终止
* 一旦Generator执行过程中抛出错误，就不会再执行下去，如果后续调用next方法，返回｛value:undefined, done=true｝对象

```js
var gen = function* gen(){
    try{
        yield console.log('a')
    }catch(e){
        console.log(e)
    }
    yield console.log('b')
    yield console.log('c')
}
var g = gen()
console.log(g.next())  //a { value: undefined, done: false }
console.log(g.throw()) //undefined b { value: undefined, done: false }
/* g.throw方法被捕获后会自动执行一次next方法，内部部署了try...catch，遍历器的throw方法抛出的异常不会影响下次遍历 */
console.log(g.next()) //c { value: undefined, done: false }
console.log(g.next()) //  { value: undefined, done: true }


var gen = function* gen(){
    yield console.log('a')
    yield console.log('b')
    yield console.log('c')
}
var g = gen()
console.log(g.next())  // a { value: undefined, done: false }
console.log(g.throw()) // undefined 报错无法执行
console.log(g.next())

var gen = function* gen(){
    yield console.log('a')
    yield console.log('b')
    throw new Error('generator break')
    yield console.log('c')
}
var g = gen()
console.log(g.next()) // a { value: undefined, done: false }
console.log(g.next()) // b { value: undefined, done: false }
console.log(g.next()) //报错无法执行
```

#### 2、return方法

Generator.prototype.return()，返回给的的值，并终结Generator函数的遍历

```js
var gen = function* gen(){
    yield console.log('a')
    yield console.log('b')
    throw new Error('generator break')
    yield console.log('c')
}
var g = gen()
console.log(g.next())   //a { value: undefined, done: false }
console.log(g.return('byebye')) //{ value: 'byebye', done: true }
console.log(g.next()) //{ value: undefined, done: true }
```

### 3、generator自动执行

```js
function longTimeFn(time) {
 	return new Promise(resolve => {
 		setTimeout(() => {
 			resolve(time);
 		}, time);
 	})
};

//自动执行封装，递归回调
function asyncFunc(generator) {
 	const iterator = generator(); // 接下来要执行next
 	// data为第一次执行之后的返回结果，用于传给第二次执行
 	const next = (data) => {
        	// 第一次执行next时，yield返回的promise实例赋值给了value
 			const {value, done} = iterator.next(data);
            if (done) return;
 			value.then((data) => {
 				next(data); 
 			});
 	}
 	next();
};

//生成器函数内自动执行，无需显示的next()
asyncFunc(function* () {
 	let data = yield longTimeFn(1000);
 	console.log(data);
 	data = yield longTimeFn(2000);
 	console.log(data);
 	return data;
})
```

