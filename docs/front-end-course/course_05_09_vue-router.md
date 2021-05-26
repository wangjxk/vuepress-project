# vue-router详解

> 参考资料：
>
> 1、[Vue Router官方文档](https://router.vuejs.org/zh/)
>
<<<<<<< HEAD
> 2、[Vue Router总结资料](http://www.wangjxk.top/front-end/vue/#%E4%BA%94%E3%80%81vue-router)
=======
> 2、[Vue Router总结资料](/front-end/vue/)
>>>>>>> 0780ca05a9c287d148590c318a26fe1fde334864

## 1、路由发展简介

### 1、后端路由

路由全部都是由服务端控制的，前端代码和服务端代码过度融合在一起。客户端/前端发起 http 请求到服务端，服务端根据访问的url 路径去匹配不同的路由/返回不同的数据。

* 优点：直接返回一个 html，渲染了页面结构。SEO 的效果非常好，首屏时间特别快。首屏时间指：在浏览器输入一个 url 开始到页面任意元素加载出来/渲染出来的时间。
* 缺点：前端代码和服务端代码过度融合在一起，开发协同非常的乱。服务器压力大，因为把构建 html 的工作放在的服务端。

### 2、前端路由

路由由前端控制，访问不同链接时，返回单一的html页面，即单页应用（SPA，单页即指单一html文件），特点如下：

* 页面中的交互是不刷新的页面的，比如点击按钮，比如点击出现一个弹窗

* 多个页面间的交互，不需要刷新页面(a/b/c，a-> b -> c); 加载过的公共资源，无需再重复加载。

## 2、前端路由原理

改变url，但不刷新页面，不向服务器发送请求，包括：页面间的交互不刷新页面，不同 Url 会渲染不同的内容。主要为hash路由和history路由两种。

### 1、两路由区别（面试题）

* hash 有#,history 没有

* hash 的#部分内容不会给服务端， history 的所有内容都会给服务端

* hash 通过 hashchange 监听变化，history 通过 popstate 监听变化

### 2、hash路由

#### 1、特点

* url 中带有一个#符号，但是#只是浏览器端/客户端的状态，不会传递给服务端。
  * www.baidu.com/#/user -> http -> www.baidu.com/
  * www.baidu.com/#/list/detail/1 -> http -> www.baidu.com/

* hash 值的更改，不会导致页面的刷新

  eg：location.hash = '#aaa'; location.hash = '#bbb'; 从#aaa 到#bbb，页面是不会刷新的

* hash 值的更改，会在浏览器的访问历史中添加一条记录。所以我们才可以通过浏览器的返回、前进按钮来控制 hash 的切换

#### 2、更改方法

* location.hash = '#aaa'
* html标签跳转：\<a href="#user"> 点击跳转到 user \</a>

#### 3、监听方法

- hash 值的更改，会触发 hashchange 事件
- window.addEventLisenter('hashchange', () => {})

### 3、history路由

#### 1、特点

* url无#，美观，服务器可接收到路径和参数变化
* 基于浏览器的history对象实现，主要为history.pushState 和 history.replaceState来进行路由控制。通过这两个方法，可以实现改变 url 且不向服务器发送请求

```js
window.history.back(); // 后退
window.history.forward(); // 前进
window.history.go(-3); // 接收number参数，后退三个页面
window.history.pushState(null, null, path); //页面的浏览记录里添加一个历史记录
window.history.replaceState(null, null, path); //替换当前历史记录
//参数解析
/*
1. state, 是一个对象，是一个与指定网址相关的对象，当popstate事件触发的时候，该对象会传入回调函数
2. title, 新页面的标题，浏览器支持不一，null
3. url, 页面的新地址
*/
```

#### 2、更改和监听方法

history路由没有hash路由类似的`hashchange`事件，改变当前url有两种方式：

* 点击后退/前进触发 `popstate`事件，监听进行页面更新

* 调用history.pushState或history.replaceState触发相应的函数后，在后面手动添加回调更新页面

面试题：pushState 时，会触发 popstate 吗？

* pushState/replaceState 并不会触发 popstate 事件，这时我们需要手动触发页面的重新渲染。

* 我们可以使用 popstate 来监听 url 的变化

* popstate 到底什么时候才能触发：
  * 点击浏览器前进和后退按钮
  * js 调用 back|forward|go 方法

#### 3、服务器适配

避免刷新浏览器出现404，需要服务端配合

eg：http://a.com/web/order、http://a.com/web/goods：对于后端来说可能是两个页面，要做一个通配符识别，将/web/*后面的统一返回某个html中

* nodejs路由处理 /web -> /web*  

```js
app.get('/web*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
```

* Nginx配置

  * index.html存在服务器本地

  * index.html存在远程地址，oss/cdn

```nginx
# 1、存在服务器本地
# www.baidu.com/a/ 或 www.baidu.com/b/为同一路径
location / {
    try_files $uri $uri/ /home/dist/index.html
}

# 2、存在远程地址
# nginx配置在a服务器，index.html配置在cdn上
# www.baidu.com/main/a/ -> www.baidu_cdn.com/file/index.html
location /main/ {
    rewrite ^ /file/index.html break;
    proxy_pass http://www.baidu_cdn.com;
}
```

### 4、手写路由

#### 1、hash路由

```html
<!DOCTYPE html>
<html>
  <body>
    <div class="container">
      <a href="#gray">灰色</a>
      <a href="#green">绿色</a>
      <a href="#">白色</a>
      <button onclick="window.history.go(-1)">返回</button>
    </div>
  </body>
  <script type="text/javascript" src="index.js"></script>
</html>
```

```js
class HashRouter{
    constructor(){
        this.routers = {} //存储router和callback对应关系
        window.addEventListener('hashchange', this.refresh.bind(this)) //执行时this为触发事件对象，需bind至当前this
        window.addEventListener('load', this.refresh.bind(this)) //首次加载时执行，刷新时情况
    }
    
    route(path, callback){
        this.routers[path] = callback || function(){}
    }

    //刷新页面,slice() 方法可从已有的数组中返回选定的元素，hash首字母为#
    refresh(){
        const path = `/${location.hash.slice(1) || ''}` //获取hash值
        this.routers[path]() //执行回调
    }
}

const container = document.querySelector('body')
function changeBgColor(color){
    container.style.backgroundColor = color
}

const router = new HashRouter()
router.route('/gray', function(){
    changeBgColor('gray')
})
router.route('/green', function(){
    changeBgColor('green')
})
router.route('/', function(){
    changeBgColor('white')
})
```

#### 2、history路由

```html
<!DOCTYPE html>
<html>
  <body>
    <div class="container">
      <a href="/gray">灰色</a>
      <a href="/green">绿色</a>
      <a href="/">白色</a>
      <button onclick="window.history.go(-1)">返回</button>
    </div>
  </body>
  <script type="text/javascript" src="index.js"></script>
</html>
```

```js
class HistoryRouter{
    constructor(){
        this.routers = {} //存储router和callback对应关系
        this.init(location.pathname); //刷新初始化，需后端配合，否则报错
        window.addEventListener('popstate', (e) => { //浏览器前进后退，已经history.go改造
            const path = e.state && e.state.path
            this.routers[path] && this.routers[path]()
        })
    }
    
    init(path){
        window.history.replaceState({path}, null, path)
        this.routers[path] && this.routers[path]() //执行回调
    }

    route(path, callback){
        this.routers[path] = callback || function(){}
    }

    go(path){
        window.history.pushState({path}, null, path)
        this.routers[path] && this.routers[path]() //手动执行回调
    }
}

const body = document.querySelector('body')
function changeBgColor(color){
    body.style.backgroundColor = color
}
const container = document.querySelector(".container")


const router = new HistoryRouter()
router.route('/gray', function(){
    changeBgColor('gray')
})
router.route('/green', function(){
    changeBgColor('green')
})
router.route('/', function(){
    changeBgColor('white')
})

container.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){
        e.preventDefault()
        router.go(e.target.getAttribute("href"))
    }
})
```

## 3、Vue Router

### 1、路由使用

参考：[Vue Router总结资料](http://www.wangjxk.top/front-end/vue/#%E4%BA%94%E3%80%81vue-router)

### 2、路由守卫

* 【组件】前一个组件的 beforRouteLeave
<<<<<<< HEAD

=======
>>>>>>> 0780ca05a9c287d148590c318a26fe1fde334864
* 【全局】的 router.beforeEach
* 【组件】如果是路由参数变化，触发 beforeRouteUpdate
* 【配置文件】里, 下一个的 beforeEnter
* 【组件】内部声明的 beforeRouteEnter
* 【全局】的 router.afterEach

## 4、面试题

### 1、如何重定向页面 

### 2、路由模式及区别

### 3、导航守卫流程

### 4、路由导航守卫和Vue实例生命周期钩子函数的执行顺序

### 5、路由组件和路由为什么解耦，怎么解耦

### 6、直接使用a链接与使用router-link的区别

### 7、Vue路由怎么跳转打开新窗口

### 8、将vue-router选项扁平化处理