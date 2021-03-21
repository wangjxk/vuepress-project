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
```

```javascript
function limitLoad(urls, handler, limit){
    const sequence = [].concat(urls) //copy array
    let promise = [] //promise池
    //splice取出前limit元素，并改变原数组
    promises = sequence.splice(0, limit).map((url, index)=>{
        //这里返回的 index 是任务在 promises 的脚标，
        //用于在 Promise.race 之后找到完成的任务脚标
        return handler(url).then(() => {
            return index
        });
    })
    let p = Promise.race(promises) //获取最快完成的任务脚标
    for(let i=0; i<sequence.length; i++){
        //链式方法完成顺序推入
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

1、内存的生命周期

* 内存分配：当我们申明变量、函数、对象的时候，js会自动为他们分配内存 

* 内存使用：即读写内存，也就是使用变量、函数等 

* 内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

2、js中的垃圾回收机制

* 引用计数垃圾回收

  a对象对b对象有访问权限，那么称为a引用b对象

  循环引用问题

* 标记清除算法

  无法达到的对象

标记清除算法将“不再使⽤的对象”定义为“⽆法达到的对象”。 简单来说，就是从根部（在JS 

中就是全局对象）出发定时扫描内存中的对象。 凡是能从根部到达的对象，都是还需要使用

的。 那些⽆法由根部出发触及到的对象被标记为不再使⽤，稍后进⾏回收。 

 4.2.1 垃圾收集器在运⾏的时候会给存储在内存中的所有变量都加上标记。 

 4.2.2 从根部出发将能触及到的对象的标记清除。 

 4.2.3 那些还存在标记的变量被视为准备删除的变量。 

 4.2.4 最后垃圾收集器会执⾏最后⼀步内存清除的⼯作，销毁那些带标记的值并回收它们所 

占⽤的内存空间。

3、JS中有哪些常见的内存泄漏

* 全局变量

* 未被清理的定时器和回调函数
* 闭包

* DOM引用

4、如何避免内存泄漏

* 减少不必要的全局变量，使⽤严格模式避免意外创建全局变量。 

* 在你使用完数据后，及时解除引用（闭包中的变量，dom引用，定时器清除）。 

* 组织好你的逻辑，避免死循环等造成浏览器卡顿，崩溃的问题。

5、实现sizeOf函数，计算Object占用多少字节bytes

git：object-sizeof

## 3、来聊一下前端HTTP请求相关

1、平时怎么解决跨域问题的？

jsonp、cors、node正向代理、nginx反向代理，proxy——pass属性配置、img标签

2、有做过全局的请求处理吗？统一处理登录态？统一处理全局错误？

Axios的request interceptor 和 response interceptor, 单例

adaptar适配器、interceptor拦截器

3、你能给xhr添加hook，实现在各个阶段打日志吗？