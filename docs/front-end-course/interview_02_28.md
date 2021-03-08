# 2021年核心面试题详解

## 1、困难与亮点

问题：说一下工作中解决过的比较困难的问题（说一下自己项目中比较有亮点的地方） 

平时学习或者工作中, 最好有记笔记的习惯, 遇到了什么问题, 自己一步一步怎么解决的? 到时候 无论是写简历准备面试, 还是碰到类似的问题, 都可以快速查找。学习一定要包含输入和输出

## 2、事件循环

参考资料：

1、[浏览器与Node的事件循环(Event Loop)有何区别?]()

2、[深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser)

3、[深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)

4、[代码执行的可视化工具 ](http://latentflip.com/loupe )

### 1、什么是事件循环

javaScript执行事件的循环机制为事件循环。

JavaScript的执行机制主要是以下三步：

* 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
* 主线程之外，还存在一个‘任务队列’（task queue）。只要异步任务有了运行结果，就在”任务队列”之中放置一个事件。
* 一旦主线程的栈中的所有同步任务执行完毕，系统就会读取任务队列，选择需要首先执行的任务然后执行。

在此过程中，主线程要做的就是从任务队列中去实践，执行事件，执行完毕，再取事件，再执行事件…这样不断取事件，执行事件的循环机制就叫做事件循环机制。（需要注意的的是当任务队列为空时，就会等待直到任务队列变成非空。）

### 2、为什么有事件循环

javaScript是单线程的，JavaScript中的所有任务都需要排队依次完成，为了解决线程的阻塞问题，使用事件循环解决。

* JavaScript的主要用途是与用户互动，以及操作DOM。如果它是多线程的会有很多复杂的问题要处理，比如有两个线程同时操作DOM，一个线程删除了当前的DOM节点，一个线程是要操作当前的DOM阶段，最后以哪个线程的操作为准？为了避免这种，所以JS是单线程的。即使H5提出了web worker标准，它有很多限制，受主线程控制，是主线程的子线程。

* 非阻塞：通过 event loop 实现。

### 3、什么是宏任务和微任务

* 宏任务：整体代码、setTimeout、setInterval、I/O操作、UI渲染等

* 微任务：new Promise().then()、MutaionObserver

### 4、为什么有微任务

宏任务先进先出，针对优先级高的任务需尽快执行，无法满足。

页面渲染事件，各种IO的完成事件等随时被添加到任务队列中，一直会保持先进先出的原则执行，我们不能准确地控制这些事件被添加到任务队列中的位置。但是这个时候突然有高优先级的任务需要尽快执行，那么一种类型的任务就不合适了，所以引入了微任务队列。

### 5、浏览器的事件循环是怎么样的

关于微任务和宏任务在浏览器的执行顺序是这样的：

执行一只task（宏任务） 

执行完micro-task队列 （微任务） 

如此循环往复下去 

### 6、nodejs的事件循环是怎么样的

大体的task（宏任务）执行顺序是这样的： 

* timers定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。 

* Pending callbacks待定回调：执行延迟到下一个循环迭代的 I/O 回调。 

* idle, prepare：仅系统内部使用。 

* Poll 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。 

* check 检测：setImmediate() 回调函数在这里执行。 

* close callbacks 关闭的回调函数：一些准备关闭的回调函数，如：socket.on(‘close’, …)。 

微任务和宏任务在Node的执行顺序 

1、Node V10以前： 

执行完一个阶段的所有任务 

执行完nextTick队列里面的内容 

然后执行完微任务队列的内容 

2、Node v10以后： 

和浏览器的行为统一了，都是每执行一个宏任务就执行完微任务队列。

### 7、事件循环题目

1、题目1

```javascript
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2(){
    console.log('async2')
}

console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
}, 0)
async1()

new Promise(function (resolve){
    console.log('promise1')
    resolve()
}).then(function(){
    console.log('promise2')
})

console.log('script end')

/*
1、执行宏任务，放入宏任务栈、微任务队列
t：setTimeout  mt：async1 end | promise2
script start
async1 start
async2
promise1
script end
2、执行维任务队列
async1 end
promise2
3、执行宏任务栈
setTimeout
*/
```

2、题目2

```javascript
console.log('start')
setTimeout（（）=>{
    console.log('children2')
    Promise.resolve().then(()=>{
        console.log('children3')
    })
}, 0）

new Promise(function (resolve, reject){
    console.log('children4')
    setTimeout(function(){
        console.log('children5')
        resolve('children6')
    }, 0)
}).then((res) => {
    console.log('children7')
    setTimeout(()=>{
        console.log(res);
    }, 0)
})

/*
1、执行宏任务
t： children2|children5(每个宏任务会放入一个宏任务队列，分布执行)  mt:
start
children4
2、执行微任务
3、执行宏任务
t：children5   mt: children3
children2
4、执行微任务
t：children5   mt: 
children3
5、执行宏任务
t：children6   mt: children7
children5
6、执行微任务
t：children6   mt: 
children7
7、执行宏任务
children6
```

3、题目3

```javascript
const p= function(){
    return new Promise((resolve, reject)=>{
        const p1 = new Promise(()=>{
            setTimeout(()=>{
                resolve(1)
            }, 0)
            resolve(2)
        })
        p1.then(res => {
            console.log(res)
        })
        console.log(3)
        resolve(4)
    })
}
p().then(res => {
    console.log(res)
})
console.log('end')

/*
1、执行宏任务
t：   mt: 2 | 4
3
end
2、执行微任务
t：   mt:
2
4
*/
/* 注释resolve(2)
1、执行宏任务
t：   mt: 4
3
end
2、执行微任务
t：resolve（1）   mt: 
4
3、执行宏任务
t：   mt: 1
4、执行微任务
1
*/
```

## 3、事件冒泡和捕获机制

### 1、基本概念

* 捕获：自顶向下

* 冒泡：自底向上

### 2、window.addEventListener事件

```javascript
//冒泡，默认
window.addEventListener('click', function(){})
//捕获
window.addEventListener('click', function(){}, true)
```

### 3、平时工作有哪些场景用到了这个机制?

事件委托，减少事件绑定

```html
<html>
    <head>事件委托</head>
    <body>
        <ul id="ul">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul>
    </body>
    <script type="text/javascript">
        //非事件委托
        const liList = document.getElementsByTagName('li')
        for(let i=0; i<liList.length; i++){
            liList[i].addEventListerner('click', function(e){
                alert(`内容为${e.target.innerHTML}，索引为${i}`)
            })
        }
        //事件委托
        const ul = document.querySelector('ul')
        ul.addEventListener('click', function(e){
            const target = e.target
            if(target.tagName.toLowerCase() === 'li'){
                const liList = this.querySelectorAll('li')
                const index = Array.prototype.indexOf.call(liList, target)
                alert(`内容为${target.innerHTML}，索引为${index}`)
            }
        })
    </script>
</html>
```

### 6、场景应用

一个历史页面, 上面有若干按钮等点击逻辑, 每个按钮都有自己的click事 件。现在新需求来了, 突然给每一个访问用户添加了banned这个属性, 如果为true, 则代表此用 户被封禁了。被封禁用户不可操作页面上的任何内容, 点击页面内的任何一处, 都弹窗提示您已被封禁。

```javascript
window.addEventListener('click', function(e){
	if(banned === true){
		e.sropProgagtion();
	}
}, true)
```

### 5、事件流

事件流是网页元素接收事件的顺序，DOM2级事件规定的事件流包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。首先发生的事件捕获，为截获事件提供机会。然后是实际的目标接收事件。最后一个阶段是事件冒泡阶段，可以在这个阶段对事件做出响应。虽然捕获阶段在规范中规定不允许响应事件，但是实际上还是会执行，多有两次机会获取到目标对象。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>事件冒泡</title>
</head>
<body>
    <div>
        <p id="parEle">
            点击父元素
            <span id="sonEle">点击子元素
                <button>
                    点我
                </button>
            </span>
        </p>
    </div>
</body>
</html>
<script type="text/javascript">
var sonEle = document.getElementById('sonEle');
var parEle = document.getElementById('parEle');

parEle.addEventListener('click', function () {
    console.log('父级冒泡');
}, false);
sonEle.addEventListener('click', function () {
    console.log('子级冒泡');
}, false);
parEle.addEventListener('click', function () {
    console.log('父级捕获');
}, true);
sonEle.addEventListener('click', function () {
    console.log('子级捕获');
}, true);
</script>
```

* 点我

  父级捕获 -> 子级捕获 -> 子级冒泡 -> 父级冒泡

* 点击子元素

  父级捕获 -> 子级冒泡 -> 子级捕获 -> 父级冒泡

  解析：当容器元素及嵌套元素，即在`捕获阶段`又在`冒泡阶段`调用事件处理程序时：**事件按DOM事件流的顺序**执行事件处理程序；当事件处于目标阶段时，事件调用顺序决定于绑定事件的**书写顺序**，按上面的例子为，先调用冒泡阶段的事件处理程序，再调用捕获阶段的事件处理程序。依次打印出“子集冒泡”，“子集捕获”。

* 点击父元素

  父级冒泡 -> 父级捕获

## 4、防抖和节流

### 1、防抖和节流的基本概念? 

* 函数防抖（debounce）：当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。
* 函数节流（throttle）：当持续触发事件时，保证一定时间段内只调用一次事件处理函数。

### 2、应用场景？

* 节流（控制次数）：resize、scroll

* 防抖：input（模糊匹配）

### 3、手写节流和防抖

```javascript
//防抖
function debounce(func, time) {
    let timer = null
    return () => {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            func.apply(this, arguments) //保证内部this指向input对象
        }, time)
    }
}

//尾节流，时间戳写法首次立即执行
function throttle(func, time) {
    let activeTime = 0
    return () => {
        const current = Date.now()
        if(current - activeTime > time) {
            func.apply(this, arguments)
            activeTime = Date.now()
        }
    }
}
```

### 4、节流优化：首节流、尾节流

```javascript
//首节流，首次不执行
function throttle(func, time) {
    let timer = null;
    return ()=> {
        if(!timer){
            timer = setTimeout(() =>{
                func.apply(this, arguments)
                timer = null
            }, time)
        }
    }
}

//首节流 + 尾节流
function throttle(func, time) {
    var timer = null
    var startTime = Date.now()
    return function(){
        var curTime = Date.now()
        var remaining = time - (curTime - startTime)
        var context = this
        var args = arguments
        clearTimeout(timer)
        if(remaining <= 0){
            func.apply(context, args)
            startTime = Date.now()
        }else{
            timer = setTimeout(func, remaining)
        }
    }
}
```

## 5、Promise

### 1、你了解Promise吗，用的多吗？

promise为基础，promise相关知识介绍

### 2、Promise.all特性

promise.all([arg1, arg2])

所有promise执行完毕后输出

一个报错，输出报错，其他promise仍然会执行，promise在实例化时会执行

### 3、手写Promise.all

* 注意数组元素可能不全是promise 使用Promise.resolve或者判断是否是promise对象 
* 注意结果的顺序问题 
* 注意判断所有Promise已经执行完成

```javascript
function promiseAll(promiseArray){
	return new Promise(function(resolve, reject){
		if(!Array.isArray(promisArray))｛
        	return reject(new Error('传入必须为数组'))
        ｝
        const res = []
        const promiseNums = promiseArray.length
        let count = 0
        for (let i=0; i<promiseNums; i++){
            Promise.resolve(promiseArray[i]).then(result => {
                count++
                res[i] = value //保证顺序执行
                if(count === promiseNums){  //保证全部执行完毕才resolve
                    resolve(res);
                }
            }).catch(e => reject(e))
        }
	});
}
/* 不推荐写法 */
/*
const isPromise = Object.prototype.toString.call(promiseArray[i]) === '[object Promise]'
 if(isPromise){
     promiseArray[i].then(result => {
         res.res.(result)
      }) 
 }else{
     res.push(promiseArray[i])
 }*/
```

### 4、实现promise缓存

```javascript
//装饰器写法
const cacheMap = new Map()
function enableCache(target, name, descriptor){
    const val = descriptor.value;
    descriptor.value = async function(...args){
        const cacheKey = name + JSON.stringify(args)
        if(!cacheMap.get(cacheKey)){
            const cacheValue = Promise.resolve(val.apply(this, args)).catch(_ => {
                cacheMap.set(cacheKey, null)
            })
            cacheMap.set(cacheKey, cacheValue)
        }
        return cacheMap.get(cacheKey)
    }
    return descriptor
}

class PromiseClass{
    @enableCache
    static async getInfo(){
        
    }
}

PromiseClass.getInfo() //接口获取
PromiseClass.getInfo() //缓存获取
```

* 装饰器Decorator，ES2017引入，Babel转码器已支持。

* 可修饰类、修饰类的方法，不能修饰普通函数，存在函数提升。

## 6、算法题：接雨水

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。 

示例 1： 

输入：height = [0,1,0,2,1,0,1,3,2,1,2,1] 

输出：6 

解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接6个单位的雨水（蓝色部分表示雨水）。 

示例 2： 

输入：height = [4,2,0,3,2,5] 

输出：9 

```javascript
//暴力解法，时间复杂度o(n^2)，空间复杂度O(1)
function trap(height=[]){
    if(height.length === 0){
        return 0
    }
    const n = height.length
    let res = 0
    for(let i=0; i<n-1; i++){
        let l_max = 0
        let r_max = 0
        for(let j=i; j<n; j++){
            //右边最高柱子
            r_max = Math.max(r_max, height[j])
        }
        for(let j=i; j>=0; j--){
            //左边最高柱子
            l_max = Math.max(l_max, height[j])
        }
        res += Math.min(l_max, r_max)-height[i]
    }
    return res
}

//单循环解法


//双指针解法
```

