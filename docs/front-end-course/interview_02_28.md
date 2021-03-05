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





### 2、为什么有事件循环



### 3、什么是宏任务和微任务



### 4、为什么有微任务



### 5、浏览器的事件循环是怎么样的



### 6、nodejs的事件循环是怎么样的



### 7、事件循环题目



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
    const 
}
```

## 6、算法题：接雨水

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。 

示例 1： 

输入：height = [0,1,0,2,1,0,1,3,2,1,2,1] 

输出：6 

解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接6个单位的雨水（蓝色部分表示雨水）。 

示例 2： 

输入：height = [4,2,0,3,2,5] 

输出：9 