# 浏览器对象详解

## 1、浏览器对象模型

参考资料：[知识整理——浏览器对象模型](https://segmentfault.com/a/1190000014212576)

BOM ：Browser Object Model（浏览器对象模型），浏览器模型提供了独立于内容的、可以与浏览器窗口进行滑动的对象结构，就是浏览器提供的 API。其主要对象有：

* window对象：BOM 的核心，是 js 访问浏览器的接口，也是 ES 规定的 Global 对象
* location对象：提供当前窗口中的加载的文档有关的信息和一些导航功能。既是 window 对象属性，也是document的对象属性
* navigation 对象：获取浏览器的系统信息
* screen对象：用来表示浏览器窗口外部的显示器的信息等
* history对象：保存用户上网的历史信息

### 1、window对象

windows 对象是整个浏览器对象模型的核心，其扮演着既是接口又是全局对象的角色

- window 对象的属性和方法

```js
alert(<msg>)/confirm(<msg>)/prompt(<msg>,<val>)
open(url,[target,string,boolean])
/*
url: 要加载的URL，
target: 窗口目标
string: 特定的字符串，以逗号分隔的字符串表示新窗口显示的特性
boolean: 表示新页面是否取代浏览器历史记录中当前加载页面的布尔值
*/
onerror() //多用于前端日志和错误采集
/* 事件处理程序，当未捕获的异常传播到调用栈上时就会调用它，并把错误消息输出到浏览器的 JavaScript 控制上。window.onerror(描述错误的一条消息, 字符串--存放引发错误的JavaScript代码所在的文档url, 文档中发生错误的行数) */
setTimeout(function(){}, val) //超时调用——在指定的时间过后执行代码
setInterval(function(){}, val)//间歇调用——每隔指定的时间就执行一次
/* 使用 `setInterval()` 方法的时候，再不加干涉的情况下，该方法会一直执行到页面的卸载，所以一般情况下`serInterval()`比较消耗性能。然后`setTimeout()`方法可以通过调用自身完成间歇调用的功能。所以说，在一般情况下使用`setTimeout()`来完成超时与间歇调用。*/
/* bug:app里嵌入H5时候，setInterval做的倒计时，10次递归 */
```

- 窗口位置
```js
screenLeft //窗口相对于屏幕左边的位置,适用于IE、Safari、Chrome
screenTop
screenX //窗口相对于屏幕左边的位置,适用于IE、Safari、Chrome,适用于Firefox
screenY	
moveBy(x,y) //全兼容
moveTo(x,y)

//跨浏览器获取窗口左边和上边位置
var leftPos = (typeof window.screenLeft == 'number') ? window.screenLeft : window.screenX
var topPos = (typeof window.screenTop == 'number') ? window.screenTop : window.screenY  
```

- 窗口大小
```js
innerWidth //可见视窗的大小
innerHeight	
outerWidth //浏览器窗口本身的尺寸
outerHeight	
resizeTo(width, height)
resizeBy(width, height)
/* 移动IE浏览器： 不支持该属性,当移动IE浏览器将布局视口的信息保存至document.body.clientWidth与document.body.clientHeight中*/
//获取浏览器视窗大小，可使用can i use网站查询
window.innerWidth || document.body.clientWidth
window.innerHeight || document.body.clientHeight
```

### 2、location对象

提供当前窗口中的加载的文档有关的信息和一些导航功能。既是 window 对象属性，也是 document 的对象属性

```js
window.location === document.location //true
/* location 对象的主要属性
hash  #host  返回url中的 hash（#后字符>=0）
host  juejin.im:80  服务器名称+端口
hostname juejin.im  服务器名称
href   当前加载页面的完整的 url
pathname  返回url的的目录和（或）文件名 /book/5a7bfe595188257a7349b52a
port 
protocol 
search  返回url的查询字符串，以问号开头 ?name=aha&age=20
*/
```

location 的应用场景：
1、解析 url 查询字符串参数，并将其返回一个对象，可通过循环、正则来实现，方法有很多,实现的大体思路是：
通过`location`的`search`属性来获取当前 url 传递的参数，如果 url 中有查询字符串的话就将其问号截取掉，然后再遍历里面的字符串并以等号为断点，使用`decodeURIComponent()`方法来解析其参数的具体数值，并将其放在对象容器中，并将其返回
2、载入新的文档，也可以说是刷新页面，主要有三个方法：

- **assign()：** location.assign("http://www.xxx.com")就可立即打开新 url 并在浏览器是我历史中生成一条新的记录, 在一个生成了 5 条浏览记录的页面中，然后使用 assign()跳转 url 后，history 记录只剩两条，一条是通过 assign 跳转的页面，另一条则是上一个页面（使用 assign()跳转方法的页面），其余的所有页面都被清除掉了
- **replace():** location.replace("http://www.bbb.com")只接受 url 一个参数，通过跳转到的 url 界面不会在浏览器中生成历史记录，就是 history 的 length 不会+1，但是会替代掉当前的页面
- **reload():** 其作用是重新加载当前显示的页面，当不传递参数的时候，如果页面自上次请求以来并没有改变过，页面就会从浏览器中重新加载，如果传递`true`，则会强制从服务器重新加载

### 3、navigation 对象

navigation 接口表示用户代理的状态和标识，允许脚本查询它和注册自己进行一些活动，navigation 应用场景：

- 检测插件
- 注册处理程序

navigator.onLine：浏览器是否链接了因特网

### 4、history对象

```js
go()
back()
forword()
length //保存历史记录的数量，可用于检测当前页面是否是用户历史记录的第一页（history.length === 0）
```

### 5、screen对象

其提供有关窗口显示的大小和可用的颜色输入信息

window.screen.deviceXDPI/deviceYDPI 屏幕实际的水平DPI、垂直DPI

## 2、浏览器事件捕获和冒泡

浏览器事件模型中的过程主要分为三个阶段：捕获阶段、目标阶段、冒泡阶段。

捕获->目标->冒泡

### 1、第三个参数

```js
window.addEventListener('click', function(e){
    console.log(e.target.nodeName) //指当前点击的元素
    console.log(e.currentTarget.nodeName) //绑定监听事件的元素
}, false) //false为默认为冒泡，true为捕获
```

### 2、阻止事件传播

- e.stopPropagation()

  阻止冒泡和捕获阶段的传播。

- stopImmediatePropagation() 
  如果有多个相同类型事件的事件监听函数绑定到同一个元素，当该类型的事件触发时，它们会按照被添加的顺序执行。如果其中某个监听函数执行了 event.stopImmediatePropagation() 方法，则当前元素剩下的监听函数将不会被执行

### 3、阻止默认行为

e.preventDefault()：可以阻止事件的默认行为发生，默认行为是指：点击a标签就转跳到其他页面、拖拽一个图片到浏览器会自动打开、点击表单的提交按钮会提交表单等等，因为有的时候我们并不希望发生这些事情，所以需要阻止默认行为。

### 4、兼容性

* attachEvent——兼容：IE7、IE8； 不支持第三个参数来控制在哪个阶段发生，默认是绑定在冒泡阶段
* addEventListener——兼容：firefox、chrome、IE、safari、opera；

### 5、面试题

1、页面为ul + li结构，点击每个li alert对应的索引

解析：浏览器获取元素方法

* document.getElementById()

* document.getElementsByTagName()

* document.querySelector()    //css选择符的模式匹配DOM元素，返回单个元素
* document.querySelectorAll() //返回nodeList列表

```js
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <ul id="ul">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
    </ul>
</body>
<script type="text/javascript">
//第一种：给每个li绑定事件
const liList = document.getElementsByTagName("li");
for(let i = 0; i<liList.length; i++){
    liList[i].addEventListener('click', function(e){
        alert(`内容为${e.target.innerHTML}, 索引为${i}`);
　　 })
}
//第二种：使用捕获绑定事件
const ul = document.querySelector("ul");
ul.addEventListener('click', function (e) {
     const target = e.target;
 　　 if (target.tagName.toLowerCase() === "li") {
 　　　　const liList = this.querySelectorAll("li");
 　　　　index = Array.prototype.indexOf.call(liList, target)； //数组和字符串位置函数indexOf
 　　　　alert(`内容为${target.innerHTML}, 索引为${index}`);
 　　}
})
</script>
</html>
```

2、封装一个多浏览器兼容的绑定事件函数

```js
class BomEvent {
    constructor(element) {
        this.element = element;
    }

    addEvent(type, handler) {
        if (this.element.addEventListener) {
            //事件类型、需要执行的函数、是否捕捉
            this.element.addEventListener(type, handler, false);
        } else if (this.element.attachEvent) {
            this.element.attachEvent('on' + type, function () {
                handler.call(element);
            });
        } else {
            this.element['on' + type] = handler;
        }
    }

    removeEvent(type, handler) {
        if (this.element.removeEnentListener) {
            this.element.removeEnentListener(type, handler, false);
        } else if (element.datachEvent) {
            this.element.detachEvent('on' + type, handler);
        } else {
            this.element['on' + type] = null;
        }
    }
}
// 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
function stopPropagation(ev) {
    if (ev.stopPropagation) {
        ev.stopPropagation(); // 标准w3c
    } else {
        ev.cancelBubble = true; // IE
    }
}
// 取消事件的默认行为
function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault(); // 标准w3c
    } else {
        event.returnValue = false; // IE
    }
}
```

## 3、网络请求

### 1、XMLHTTPRequest对象

* 方法
  * open（请求方法：“get/post”, 请求url,   是否异步（默认true））
  * send（请求体发送数据，无则传入null）
  * abort()：收到响应之前取消异步请求
  * setRequestHeader('MyHeader', 'MyValue')
  * getResponseHeader('MyHeader')|getAllResponseHeader()
* 属性
  * responseText
  * responseXML
  * status（响应HTTP状态）
  * statusText（响应HTTP状态描述）
  * readyState（响应状态，请求/响应过程的哪个阶段）：0未初始化|1已打开|2已发送|3接收中|4完成，从一个值变为一个值，会触发readystatechange事件，readystatechange事件处理程序应该在调用open()之前赋值
  * timeout超时时间，对应超时事件ontimeout
  * 进度事件：loadstart、progress事件：接收数据时反复触发、error、abort、load、loadend

```js
let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://domain/service');

// request state change event
xhr.onreadystatechange = function () {
    // request completed?
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
        // request successful - show response
        console.log(xhr.responseText);
    } else {
        // request error
        console.log('HTTP error', xhr.status, xhr.statusText);
    }
};

xhr.timeout = 3000; // 3 seconds
xhr.ontimeout = () => console.log('timeout', xhr.responseURL);

// progress事件可以报告长时间运行的文件上传
xhr.upload.onprogress = p => {
     console.log(Math.round((p.loaded / p.total) * 100) + '%');
}

// start request
xhr.send(null);
```

### 2、fetch

* 方法：fetch(url，{}init对象)，返回Promise对象，只支持异步

* 响应通过response对象获取：fetch().then((response)=>{}).catch(()=>{})，response对象混入了body，提供了5个方法，将ReadableStream转存到缓冲区的内存里，将缓冲区转换为js对象，通过Promise返回。

  * response.text() //转为text

  * response.json() //转为json

  * response.formData()

  * response.arrayBuffer()

  * response.blob()

* 默认不带cookie 
* 错误不会reject 
* 不支持超时设置 
* 需要借用AbortController终止fetch   

```js
fetch(
        'http://domain/service', {
            method: 'GET'
        }
    )
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error('error:', error));

// 默认不带cookie
//credentials：omit不发送cookie（默认）|same-origin同源发送cookie|include都发送cookie
fetch(
    'http://domain/service', {
        method: 'GET',
        credentials: 'same-origin'
    }
)

// 错误不会reject
// HTTP错误（例如404 Page Not Found 或 500 Internal Server Error）不会导致Fetch返回的Promise标记为reject；.catch()也不会被执行。
// 想要精确的判断 fetch是否成功，需要包含 promise resolved 的情况，此时再判断 response.ok是不是为 true
fetch(
        'http://domain/service', {
            method: 'GET'
        }
    )
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(json => console.log(json))
    .catch(error => console.error('error:', error));

// 不支持直接设置超时, 可以用promise
function fetchTimeout(url, init, timeout = 3000) {
    return new Promise((resolve, reject) => {
        fetch(url, init)
            .then(resolve)
            .catch(reject);
        setTimeout(reject, timeout);
    })
}

// 中止fetch
// signal用于支持AbortController中断请求
const controller = new AbortController(); 
//AbortController接口表示一个控制器对象，允许你根据需要中止一个或多个 Web请求。
fetch(
        'http://domain/service', {
            method: 'GET',
            signal: controller.signal
        })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error('Error:', error));
controller.abort();
```

### 3、HTTP状态码和首部

#### 1、HTTP状态码

100信息性|200成功|300重定向|400客户端错误|500服务器错误

- 200 get 成功 

- 201 post 成功 

- 301 永久重定向 

- 302 临时重定向 

- 304 协商缓存 服务器文件未修改 

- 400 客户端请求有语法错误，不能被服务器识别 

- 403 服务器受到请求，但是拒绝提供服务，可能是跨域 

- 404 请求的资源不存在 

- 405 请求的method不允许 

- 500 服务器发生不可预期的错误 

#### 2、HTTP首部

* 通用首部：Connection、Date、MIME-Version、Cache-Control
* 请求首部：User-Agent、Accept（MIME类型）、Accept-Encoding、Cookie
* 响应首部：Set-Cookie
* 实体首部：Content-Length、Content-Type、ETag、Expires、Last-Modified

### 4、封装Ajax请求

```tsx
interface IOptions {
    url: string;
    type?: string;
    data: any;
    timeout?: number;
}

function formatUrl(json) {
    let dataArr = [];
    json.t = Math.random();
    for (let key in json) {
        dataArr.push(`${key}=${encodeURIComponent(json[key])}`)
    }
    return dataArr.join('&');
}

export function ajax(options: IOptions) {
    return new Promise((resolve, reject) => {
        if (!options.url) return;

        options.type = options.type || 'GET';
        options.data = options.data || {};
        options.timeout = options.timeout || 10000;
    
        let dataToUrlstr = formatUrl(options.data);
        let timer;
    
        // 1.创建
        let xhr;
        if ((window as any).XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
    
        if (options.type.toUpperCase() === 'GET') {
            // 2.连接
            xhr.open('get', `${options.url}?${dataToUrlstr}`, true);
            // 3.发送
            xhr.send();
        } else if (options.type.toUpperCase() === 'POST') {
            // 2.连接
            xhr.open('post', options.url, true);
            xhr.setRequestHeader('ContentType', 'application/x-www-form-urlencoded');
            // 3.发送
            xhr.send(options.data);
        }
    
        // 4.接收
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                clearTimeout(timer);
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
    
        if (options.timeout) {
            timer = setTimeout(() => {
                xhr.abort();
                reject('超时');
            }, options.timeout)
        }

        // xhr.timeout = options.timeout;
        // xhr.ontimeout = () => {
        //     reject('超时');
        // }
    });
}
```

