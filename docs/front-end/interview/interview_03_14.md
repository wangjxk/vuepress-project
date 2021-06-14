# 2021年核心面试题详解

## 1、有做过前端加载优化相关的工作吗? 都做过哪些努力？

### 1、有性能优化的目的是什么？

REF：页面性能检测： https://developers.google.com/speed/pagespeed/insights/

TIP：优化哪个指标完善了业务体验，解决了业务问题

* 首屏时间（白屏时间）

* 首次可交互时间

* 首次有意义内容渲染时间

### 2、常见优化手段

#### 1、只请求当前需要的资源

* 异步加载
* 懒加载
* polyfill（适配高版本语法）的优化

解析：不用使用webpack打包，使用cdn链接 https://polyfill.io/v3/url-builder/，进行浏览器检测，实现浏览器的polyfill按需加载

#### 2、缩减资源体积

* 打包压缩：webpack4已支持

* gzip：减小静态资源的压缩算法，服务器默认开启

* 图片格式优化

  * 对图片进行压缩：www.tinypng.com图片压缩网站

  * 根据屏幕分辨率展示不同分辨率的图片

  * webp图片使用

* 尽量控制cookie大小

  浏览器中request header中携带cookie，同域名请求会携带当前域名下的所有cookie

#### 3、时序优化

* js中promise.all：并发控制

* ssr：服务器端渲染，可使用缓存，方便seo

* prefetch、prerender、preload

  资料：[一站式理解 - prefetch preconnect prerender preload](https://www.jianshu.com/p/4a5f50addccb)

```html
<!-- 加载代码瞬间，预解析代码 -->
<link rel=“dns-prefetch” href=“xxxxxx” />
<!-- 加载代码瞬间，预链接 -->
<link rel=“preconnect” href=“xxxxxxx” />
<!-- 需申明类型，预加载 -->
<link rel=“preload” as=“image” href=“xxxxxxxxx” />
```

#### 4、合理利用缓存

* cdn 

  cdn预热（不通过用户访问，提前分发加载图片）、cdn刷新（强制回源）、一般cdn域名与实际域名不同，防止携带同源cookie

* http缓存 

* localStorage, sessionStorage

### 3、如果一端js执行时间长，怎么去分析

装饰器ref：

* [JS 装饰器，一篇就够](https://segmentfault.com/a/1190000014495089)

* [Vue中使用装饰器，我是认真的](https://segmentfault.com/a/1190000023471570)

用装饰器实现资源运行时间的计算

```javascript
export function meatrue(target, name, descriptor){
    const oldValue = descriptor.value
    descriptor.value = async function(){
        console.time(name)
        const ret = await oldValue.apply(this, arguments)
        console.timeEnd(name)
        return ret
    }
    return descriptor
}
```

### 4、场景分析1：webp转换

阿里云oss支持通过链接后面拼参数来做图片的格式转换，尝试写一下，把任意图片转换为webp格式，要注意什么问题？   解析：考虑浏览器适配和边界，是否全在oss（Object Storage Service，对象存储服务）上。

解析：oss与cdn

* oss的核心是存储，以及计算能力（图片处理）

* cdn的核心是分发，本身不会给用户提供直接操作存储的入口

```javascript
//检测浏览器是否支持webp格式
function checkWebp(){
    try{
        return (
         document
            .creatElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0
        )
    }catch(err){
        return false
    }
}

const supportWebp = checkWebp();

//另需咨询是否所有图片在oss上
export function getWebpImageUrl(url) {
    //判断url是否为空
    if(!url){
        return url
    }
    //判断url是否是base64字符串
    if (url.startsWith('data:')) {
        return url;
    }
    if (!supportWebp) {
        return url;
    }
    return url + '?x-oss-process=image/format,webp' 
}
```

### 5、场景分析2：并发加载图片

如果页面上有巨量图片需要展示，除了懒加载的方式，有没有其他方法限制一下同时加载的图片数量？

代码题，通过实现promise的并发控制。

数组常用方法

```JavaScript
push() //向数组的末尾添加一个或更多元素，并返回新的长度
pop()  //删除数组的最后一个元素并返回删除的元素。
shift() //删除并返回数组的第一个元素。
unshift() //向数组的开头添加一个或更多元素，并返回新的长度。
splice() //添加或删除原素 array.splice(index,howmany,item1,.....,itemX),然后返回被删除的项目
//可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
sort() //array.sort(sortfunction)
reverse() //颠倒顺序后的数组
filter()//过滤返回新数组
concat //array1.concat(array2,array3,...,arrayX),连接数组,返回连接副本
slice() //选取数组的一部分，并返回一个新数组。array.slice(start, end)
arr.includes(searchElement)//数组是否有该元素，include
arr.includes(searchElement, fromIndex)
array.map(function(currentValue,index, arr), thisValue)
//循环操作数据返回新值，map
/*
currentValue 必须。当前元素的值
index 可选。当前元素的索引值
arr 可选。当前元素属于的数组对象
thisValue 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。
如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象。
*/
arr.reduce(callback,[initialValue]) //求和、数据扁平化、数据去重
/* 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素
callback （执行数组中每个值的函数，包含四个参数）
1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
2、currentValue （数组中当前被处理的元素）
3、index （当前元素在数组中的索引）可选
4、array （调用 reduce 的数组）可选
initialValue （作为第一次调用 callback 的第一个参数。）
*/
Array.from(arrayLike, mapFn, thisArg) 
/* 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
1、arrayLike：想要转换成数组的伪数组对象或可迭代对象。
2、mapFn（可选）：如果指定了该参数，新数组中的每个元素会执行该回调函数。
3、thisArg（可选）：可选参数，执行回调函数 mapFn 时 this 对象。
Array.from(arrayLike) <=> [].slice.call(arrayLike)
*/
```

```javascript
function limitLoad(urls, handler, limit){
    const sequence = [].concat(urls) //copy array
    let promises = [] //promise池
    //splice取出前limit元素，并改变原数组
    promises = sequence.splice(0, limit).map((url, index)=>{
        //这里返回的 index 是任务在 promises 的脚标，
        //用于在 Promise.race 之后找到完成的任务脚标
        return handler(url).then(() => {
            return index
        });
    })
    let p = Promise.race(promises) //获取最快完成的任务脚标
    for(let i=0; i<sequence.length; i++){//sequence已去除前3元素
        //链式方法完成顺序推入
        /* 解析：p=Promise.race(0,1,2).then(return Promise.race(1,2,3)).then(return Promise.race(2,3,4)) for循环每次链式加入一个元素*/
         p = p.then((res) => {
            promises[res] = handler(sequence[i]).then(() => {
                return res
            })
            return Promise.race(promises)
        })
    }
}

const urls = [{
        info: 'link1',
        time: 3000
    },
    {
        info: 'link2',
        time: 2000
    },
    {
        info: 'link3',
        time: 5000
    },
    {
        info: 'link4',
        time: 1000
    },
    {
        info: 'link5',
        time: 1200
    },
    {
        info: 'link6',
        time: 2000
    },
    {
        info: 'link7',
        time: 800
    },
    {
        info: 'link8',
        time: 3000
    },
];

// 设置我们要执行的任务
function loadImg(url) {
    return new Promise((resolve, reject) => {
        console.log("----" + url.info + " start!")
        setTimeout(() => {
            console.log(url.info + " OK!!!")
            resolve()
        }, url.time)
    })
}

limitLoad(urls, loadImg, 3)
```

## 2、平时有关注过前端的内存处理吗？

### 1、内存的生命周期

* 内存分配：当我们申明变量、函数、对象的时候，js会自动为他们分配内存 

* 内存使用：即读写内存，也就是使用变量、函数等 

* 内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

### 2、js中的垃圾回收机制

​	垃圾回收算法主要依赖于引用的概念。在内存管理的环境中，一个对象如果有访问另一个对象的权限（隐式或者显式），叫做一个对象引用另一个对象。

* 引用计数垃圾回收

  引用计数算法定义“内存不再使用”的标准很简单，就是看一个对象是否有指向它的引用。 如果没有其他对象指向它了，说明该对象已经不再需了。存在一个致命的问题：循环引用。如果两个对象相互引用，尽管他们已不再使用，垃圾回收不会进行回收，导致内存泄露。

* 标记清除算法

  标记清除算法将“不再使用的对象”定义为“无法达到的对象”。 简单来说，就是从根部（在JS中就是全局对象）出发定时扫描内存中的对象。 凡是能从根部到达的对象，都是还需要使用的。 那些无法由根部出发触及到的对象被标记为不再使用，稍后进行回收。
  
  * 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记
  * 从根部出发将能触及到的对象的标记清除
  * 那些还存在标记的变量被视为准备删除的变量
  * 最后垃圾收集器会执行最后一步内存清除的工作，销毁那些带标记的值并回收它们所占用的内存空间

### 3、JS中有哪些常见的内存泄漏

* 全局变量

```js
function foo() {
    bar1 = 'some text'; // 没有声明变量 实际上是全局变量 => window.bar1
    this.bar2 = 'some text' // 全局变量 => window.bar2
}
foo();
```

* 未被清理的定时器和回调函数

如果后续 renderer 元素被移除，整个定时器实际上没有任何作用。 但如果你没有回收定时器，整个定时器依然有效, 不但定时器无法被内存回收， 定时器函数中的依赖也无法回收。在这个案例中的 serverData 也无法被回收。

```js
var serverData = loadData();
setInterval(function() {
    var renderer = document.getElementById('renderer');
    if(renderer) {
        renderer.innerHTML = JSON.stringify(serverData);
    }
}, 5000); // 每 5 秒调用一次
```

* 闭包

在 JS 开发中，我们会经常用到闭包，一个内部函数，有权访问包含其的外部函数中的变量。 下面这种情况下，闭包也会造成内存泄露

```js
var theThing = null;
var replaceThing = function () {
    var originalThing = theThing;
    var unused = function () {
        if (originalThing) // 对于 'originalThing'的引用
        console.log("hi");
    };
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
        	console.log("message");
        }
    };
};
setInterval(replaceThing, 1000);
```

这段代码，每次调用 replaceThing 时，theThing 获得了包含一个巨大的数组和一个对于新闭包 someMethod 的对象。 同时 unused 是一个引用了 originalThing 的闭包。
这个范例的关键在于，闭包之间是共享作用域的，尽管 unused 可能一直没有被调用，但是 someMethod 可能会被调用，就会导致无法对其内存进行回收。 当这段代码被反复执行时，内存会持续增长。

* DOM引用

很多时候, 我们对 Dom 的操作, 会把 Dom 的引用保存在一个数组或者 Map 中。

```js
var elements = {
    image: document.getElementById('image')
};
function doStuff() {
    elements.image.src = 'http://example.com/image_name.png';
}
function removeImage() {
    document.body.removeChild(document.getElementById('image'));
    // 这个时候我们对于 #image 仍然有一个引用, Image 元素, 仍然无法被内存回收.
}
```

上述案例中，即使我们对于 image 元素进行了移除，但是仍然有对 image 元素的引用，依然无法对齐进行内存回收。

### 4、如何避免内存泄漏

* 减少不必要的全局变量，使⽤严格模式避免意外创建全局变量。 

* 在你使用完数据后，及时解除引用（闭包中的变量，dom引用，定时器清除）。 

* 组织好你的逻辑，避免死循环等造成浏览器卡顿，崩溃的问题。

### 5、实现sizeOf函数，计算Object占用多少字节byte

#### 1、js数据类型（8种）

* 基本类型（5+2）
  * Number：64bit-8byte
  * Boolean：32bit-4byte
  * String：16bit-2byte
  * null
  * undefined
  * symbol(ES6)
  * BigInt(ES2020)
* 引用类型：object（Array，Function，Date）

#### 2、数据类型判断

参考资料：[彻底弄懂js数据类型判断](https://zhuanlan.zhihu.com/p/129642585)

* typeof：可判断**number**、**string**、**boolean**、**Symbol**、**undefined**及**function**，而对于**null**及**数组**、**对象**，typeof均检测出为object，不能进一步判断它们的类型。

```JavaScript
let obj = {
   name: 'zhangxiang'
};
function foo() {
    console.log('this is a function');
}
let arr = [1,2,3];
let s = Symbol();
console.log(typeof 1);  // number
console.log(typeof '1');  //string
console.log(typeof true);  //boolean
console.log(typeof s); //Symbol
console.log(typeof undefined); //undefined
console.log(typeof null); //object
console.log(typeof foo);  //function
console.log(typeof obj); //object
console.log(typeof arr);   //object
```

* instanceof：其实适合用于判断自定义的类实例对象, 而不是用来判断原生的数据类型
* Object.prototype.toString：在任何值上调用 Object 原生的 toString() 方法，都会返回一个 [object NativeConstructorName] 格式的字符串

```javascript
function foo(){};
Object.prototype.toString.call(1);  '[object Number]'
Object.prototype.toString.call(NaN); '[object Number]'
Object.prototype.toString.call('1'); '[object String]'
Object.prototype.toString.call(true); '[object Boolean]'
Object.prototype.toString.call(undefined); '[object Undefined]'
Object.prototype.toString.call(null); '[object Null]'
Object.prototype.toString.call(Symbol());'[object Symbol]'
Object.prototype.toString.call(foo);  '[object Function]'
Object.prototype.toString.call([1,2,3]); '[object Array]'
Object.prototype.toString.call({});'[object Object]'
```

* constructor：注意**undefined和null没有contructor属性**

```javascript
console.log(num.constructor === Number);// true
```

* 其他

  * 数组判断：**Array.isArray()**

  * NaN判断：**Number.isNaN**或者typeof n === "number" && window.isNaN( n )

  * DOM元素判断：!!(obj && obj.nodeType === 1)

  * 对象判断及argument对象判断


```javascript
isObject: function(obj){
  var type = typeof obj;
  return type === 'function' || typeof === 'object' && obj !== null;
}
isArguments: function(obj){
  return Object.prototype.toString.call(obj) === '[object Arguments]' || (obj != null && Object.hasOwnProperty.call(obj, 'callee'));
}
```

#### 3、sizeof函数实现

```javascript
const testData = {
    a: 111,
    b: 'cccc',
    2222: false,
}

function caculator(object){
    const objectType = typeof object
    switch(objectType){
        case 'boolean': 
            return 4;
        case 'string':
            return object.length * 2;
        case 'number':
            return 8;
        case 'object':
            if(Array.isArray(object)){
                return object.map(caculator).reduce(function(pre,cur){
                    return pre + cur
                })
            }else{
                return caculateObj(object);
            }
        default:
            return 0
    }
}

const seen = new WeakSet()

function caculateObj(object){
    if(object === null){
        return 0
    }
    let bytes = 0
    let keys = Object.keys(object)
    for(let i=0; i<keys.length; i++){
        let key = keys[i]
        bytes += caculator(key)
        if(typeof object[key] === 'object' &&  object[key] !== null){
            if(seen.has(object[key])){
                continue
            }
            seen.add(object[key])
        }
        bytes += caculator(object[key])
    }
    return bytes
}

console.log(caculator(testData))
```

解析：

1、Set

* 成员唯一、无序且不重复
* 只有键值，没有键名
* 可以遍历，方法有add、delete、has

2、WeakSet

* 成员都是对象
* 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存Dom节点，不容易造成内存泄漏
* 不能遍历，方法有add、delete、has

3、Map

* 键值对的集合
* 可以遍历，方法很多可以转换为其他数据格式

4、WeakMap

* 只接受对象作为键名（非null），不接受其他类型的值做键名
* 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键值无效
* 不能遍历，方法有get、set、has、delete

## 3、来聊一下前端HTTP请求相关

### 1、平时怎么解决跨域问题

1、浏览器同源策略（Same Origin Policy，SOP）:域名、协议、端口相同

2、跨域问题解决

* jsonp： JSON With Padding（填充式 JSON 或参数式 JSON）

原理：就是动态创建`<script>`标签，然后利用`<script>`的 src 属性不受同源策略约束来跨域获取数据

实现：JSONP 由两部分组成：**回调函数** 和 **数据**。回调函数是用来处理服务器端返回的数据，回调函数的名字一般是在请求中指定的。而数据就是我们需要获取的数据，也就是服务器端的数据。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JSONP实现跨域</title>
    <script type="text/javascript">
        function handleResponse(response){   //处理服务器返回的数据
            console.log(response);    //控制台输出
        }
        function foo() {
            var script = document.createElement("script");
            script.src = "http://192.168.31.122/1.txt"; 
            //设置请求的链接以及处理返回数据的回调函数
            document.body.insertBefore(script, document.body.firstChild);
        }
    </script>
</head>
<body>
<button id="btn" onclick="foo()">确定</button>
</body>
</html>

<!-- http://192.168.31.122/1.txt
handleResponse([ { "name":"xie",
    "sex" :"man",
    "id" : "66" },
  { "name":"xiao",
    "sex" :"woman",
    "id" : "88" },
  { "name":"hong",
    "sex" :"woman",
    "id" : "77" }]
-->
```

* cors：跨域资源共享（Cross-origin resource sharing）提供资源服务器添加Access-Control-Allow-Origin

* node正向代理：利用服务端不跨域的特性

  /api -> 同域node服务 -> /api ->  前端

* nginx反向代理：使用proxy_pass属性配置

  /api -> 通过代理转接至/same/api

* img标签

### 2、有做过全局的请求处理吗？统一处理登录态？统一处理全局错误？

* Axios库
* adaptar适配器
* interceptor拦截器：request、response

### 3、你能给xhr添加hook，实现在各个阶段打日志吗？

代码题, 实现页面上通过xhr发请求的时候, 在xhr的生命周期里, 能够实现自定义的行为触发。

解析：使用new XMLHttpRequest()进行请求发送时，例如open、onreadystatechange、onload、onerror时打印日志

```javascript
/* 重写xhr的属性和方法
1.class的使用，new对象
2.this的指向
3.apply,call的使用
4.Object.definePorperty使用
5.代码的设计能力
6.hook的理解
*/

class XhrHoor{
    /* 构造函数 */
    constructor(beforehook={}, afterhook={}){
        // 单例
        if (XhrHook.instance) {
            return XhrHook.instance;
        }
        this.Xhr = window.XMLHttpRequest
        this.beforehook = beforehook
        this.afterhook = afterhook
        this.init = init()
        XhrHook.instance = this
    }

    /* 初始化重写xhr对象 */
    init(){
        let _this = this
        window.XMLHttpRequest = function () {
            this._xhr = new _this.Xhr()
            _this.overwrite(this) //通过this获取_xhr属性
        }
    }

    /* 处理重写 */
    overwrite(proxyXhr){
        for(let key in proxyXhr._xhr){//对象遍历for in
            if(typeof proxyXhr._xhr[key] === 'function'){
                overwriteMethod(key, proxyXhr)
                continue
            }
            overwriteAttributes(key, proxyXhr)
        }

    }

    /* 重写方法 */
    overwriteMethod(key, proxyXhr){
        let beforehook = this.beforehook //可以拦截原有行为
        let afterhook = this.afterhook
        proxyXhr[key] = (...args)=>{ //
            if(beforehook[key]){
                const res = beforehook[key].call(proxyXhr, ...args)
                if(res === false){ //拦截行为
                    return
                }
            }
            const res = proxyXhr._xhr[key].apply(proxyXhr._xhr, args)
            afterhook[key] && afterhook[key].call(proxyXhr._xhr, res) //将res执行结果传入
            return res
        }
    }

    /* 重写属性 */
    overwriteAttributes(key, proxyXhr){
        Object.defineProperty(proxyXhr, key, this.setPropertyDescriptor(key, proxyXhr))
    }

    /* 设置属性的属性描述 */
    setPropertyDescriptor(key, proxyXhr){
        let obj = Object.create(null) //创建空对象
        let _this = this
        obj.set = function(val){
            if(!key.startsWith('on')){//只重写on开头的属性
                proxyXhr['__' + key] = val
                return
            }

            if(_this.beforehook[key]){
                this._xhr[key] = function(...args){
                    _this.beforehook.call(...args)
                    val.apply(proxyXhr, args)
                }
            }
            this._xhr[key] = val
        }

        obj.get = function(){
            return proxyXhr['__' + key] || this._xhr[key] //优先返回自定义属性
        }

        return obj
    }
}


/* 使用hook，建立XhrHoor时重写xhr */
new XhrHoor({
    open: function () {
        console.log('open');
        return false //返回false不执行原有函数，返回true继续执行原有函数
    },
    onload: function () {
        console.log('onload');
    },
    onreadystatechange: function () {
        console.log('onreadystatechange');
    },
    onerror: function () {
        console.log('hook error')
    }
})

/* 使用被重写的xhr，各阶段会使用hook进行打印 */
var xhr = new XMLHttpRequest();
//方法
xhr.open('GET', 'https://www.baidu.com', true);
xhr.send();
//属性
xhr.onreadystatechange = function (res) {
    console.log('statechange');
}
xhr.onerror = function () {
    console.log('error');
}
```

解析：

1、rest参数(...变量名)，rest参数搭配变量是一个数组

```javascript
function sortNumbers(){
    return Array.prototype.slice.call(arguments).sort();
}

const sortNumbers = (...numbers) => numbers.sort();
```

2、Object.defineProperty(obj, prop, desc)

ref资料：[深入浅出Object.defineProperty()](https://www.jianshu.com/p/8fe1382ba135)

3、数组和对象遍历

ref资料：[js中各种遍历方法](https://www.jianshu.com/p/58b72786ee19)

## 4、平时用过发布订阅模式吗？比如Vue的event bus，node的eventemitter3

```javascript
class EventEmitter {
    constructor(maxListeners) {
        this.events = {} //监听key-value
        this.maxListeners = maxListeners || Infinity;
    }
    
    on(event, cb) {
        if (!this.events[event]) {
            this.events[event] = []
        }

        if (this.maxListeners !== Infinity && this.events[event].length >= this.maxListeners) {
            console.warn(`${event} has reached max listeners.`)
            return this;
        }
        this.events[event].push(cb)
        return this
    }
    
    /* 无cb全部移除：事件名、callback */
    off(event, cb) {
        if (!cb) {
            this.events[event] = null
        } else {
            this.events[event] = this.events[event].filter(item => item !== cb);
        }

        return this  //链式调用
    }
    
    once(event, cb) {
        const func = (...args) => {
            this.off(event, func) //先移除
            cb.apply(this, args)
        }
        this.on(event, func)
        return this
    }

    emit(event, ...args) {
        const cbs = this.events[event]

        if (!cbs) {
            console.warn(`${event} event is not registered.`);
            return this;
        }

        cbs.forEach(cb => cb.apply(this, args))

        return this
    }
}

const add = (a, b) => console.log(a + b)
const log = (...args) => console.log(...args)
const event = new EventEmitter()

event.on('add', add)
event.on('log', log)
event.emit('add', 1, 2) // 3
event.emit('log', 'hi~') // 'hi~'
event.off('add')
event.emit('add', 1, 2) // Error: add event is not registered.
event.once('once', add)
event.emit('once', 1, 2) // 3
event.emit('once', 1, 2)
event.emit('once', 1, 2)
```

## 5、背包问题：动态规划

给你一个可装置重量为W的背包和N个物品，每个物品有重量和价值两个属性，其中第i个物品的重量为wt[i]，价值为val[i]，现在让你用这个背包装物品，最多能装的价值是多少？

举个例子，输入如下：N = 3, W=4, wt = [2,1,3], val = [4,2,3]，算法返回6，选择前两件物品装进背包，总重量3小于W，可以获得最大价值6。

一、明确【状态】和【选择】

1. 状态
   如何才能描述一个背包问题？
   只要给定几个可选物品和一个背包的容量限制，就形成了一个背包问题。
   所以状态有两个，就是「背包的容量」和「可选择的物品」。
2. 选择
   对于每件物品，你能选择什么？选择就是「装进背包」或者「不装进背包」。
3. 套用框架

```
for 状态1 in 状态1的所有取值：
    for 状态2 in 状态2的所有取值：
        dp[状态1][状态2] = 择优(选择1，选择2...)
```

二、明确dp数组的定义

dp数组是什么？其实就是描述问题局面的一个数组。换句话说，我们刚才明确问题有什么「状态」，现在需要用dp数组把状态表示出来。

首先看看刚才找到的「状态」，有两个，也就是说我们需要一个二维dp数组，一维表示可选择的物品，一维表示背包的容量。

```
dp[i][w]的定义如下：对于前i个物品，当前背包的容量为w，这种情况下可以装的最大价值是dp[i][w]。
比如说，如果 dp[3][5] = 6，其含义为：对于给定的一系列物品中，若只对前 3 个物品进行选择，当背包容量为 5 时，最多可以装下的价值为 6。
为什么要这么定义？便于状态转移。
根据这个定义，我们想求的最终答案就是dp[N][W]。
base case 就是dp[0][..] = dp[..][0] = 0，因为没有物品或者背包没有空间的时候，能装的最大价值就是 0。
```

那么细化上面的解题框架就是：

```
int dp[N+1][W+1]
dp[0][..] = 0
dp[..][0] = 0

for i in [1..N]:
    for w in [1..W]:
        dp[i][w] = max(
            把物品 i 装进背包,
            不把物品 i 装进背包
        )
return dp[N][W]
```

三、状态转移方程怎么写？

简单说就是，上面伪代码中「把物品i装进背包」和「不把物品i装进背包」怎么用代码体现出来呢？

这一步要结合对dp数组的定义和我们的算法逻辑来分析：

先重申一下刚才我们的dp数组的定义：

```
dp[i][w]表示：对于前i个物品，当前背包的容量为w时，这种情况下可以装下的最大价值是dp[i][w]。
如果你没有把这第i个物品装入背包，那么很显然，最大价值dp[i][w]应该等于dp[i-1][w]。你不装嘛，那就继承之前的结果。
如果你把这第i个物品装入了背包，那么dpi应该等于dp[i-1][w-wt[i-1]] + val[i-1]。
首先，由于i是从 1 开始的，所以对val和wt的取值是i-1。
而dp[i-1][w]也很好理解：你如果想装第i个物品，你怎么计算这时候的最大价值？换句话说，在装第i个物品的前提下，背包能装的最大价值是多少？
显然，你应该寻求剩余重量w-wt[i-1]限制下能装的最大价值，加上第i个物品的价值val[i-1]，这就是装第i个物品的前提下，背包可以装的最大价值。
```

综上就是两种选择，我们都已经分析完毕，也就是写出来了状态转移方程，可以进一步细化代码：

```
dp[i][w] = 对于前i个物品，当前背包的容量为w，这种情况下可以装的最大价值是dp[i][w]
1、如果没有把第i个物品装进背包
dp[i][w] = dp[i-1][w]
2、如果把第i个物品装进背包
第i个物品的价值是val[i-1]
第i个物品的重量是wt[i-1]
dp[i][w] = dp[i-1][w-wt[i-1]] + val[i-1]

for i in [1..N]:
    for w in [1..W]:
        dp[i][w] = max(
            dp[i-1][w],
            dp[i-1][w - wt[i-1]] + val[i-1]
        )
return dp[N][W]
```

四、把伪代码转换为代码

```javascript
/**
 * 0-1背包问题
 * @param {Number} W 背包容量
 * @param {Number} N 物品总数
 * @param {Array} wt 物品重量数组
 * @param {Array} val 物品价值数组
 * @returns Number 背包能装的最大价值
 */
function knapsack(W, N, wt = [], val = []) {
    // 初始化N+1行, M+1列的二维数组, base case 已初始化
    const dp = Array.from(new Array(N + 1), () => new Array(W + 1).fill(0));

    for (let i = 1; i <= N; i++) {
        for (let w = 1; w <= W; w++) {
            if (w - wt[i - 1] < 0) {
                // 当前背包容量装不下，只能选择不装入背包
                dp[i][w] = dp[i - 1][w];
            } else {
                // 装入或者不装入背包，择优
                dp[i][w] = Math.max(dp[i - 1][w - wt[i - 1]] + val[i - 1],
                    dp[i - 1][w]);
            }
        }
    }

    return dp[N][W];
}

const W = 4;
const N = 3;
const wt = [2, 1, 3];
const val = [4, 2, 3];

console.log(knapsack(W, N, wt, val))
```

