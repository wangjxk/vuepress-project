# vue-router详解

> 参考资料：[Vue Router官方文档](https://router.vuejs.org/zh/)
>

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

::: tip
面试题：路由的模式和区别
:::

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

### 1、引入router

```javascript
import VueRouter from 'vue-router'
Vue.use(VueRouter)
//1、引入了两个组件 router-link和router-view
//2、全局混入了$route（获取属性）和$router（操作）
```

#### 1、router-link

* to属性： 字符串 | Location对象

```vue
<!-- 等价于 router.push -->
<!-- 字符串 -->
<router-link to="home">Home</router-link>

<!-- 命名的路由 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

<!-- 带查询参数，下面的结果为 /register?plan=private -->
<router-link :to="{ path: 'register', query: { plan: 'private' }}"
  >Register</router-link
```

- replace：设置 `replace` 属性的话，当点击时，会调用 `router.replace()` 而不是 `router.push()`，于是导航后不会留下 history 记录
- append：设置 `append` 属性后，则在当前 (相对) 路径前添加基路径。例如，我们从 `/a` 导航到一个相对路径 `b`，如果没有配置 `append`，则路径为 `/b`，如果配了，则为 `/a/b`

```vue
<router-link :to="{ path: '/abc'}" replace></router-link>
<router-link :to="{ path: '/abc'}" append></router-link>
```

::: tip
面试题：手写a链接与router-link区别
:::

- tag默认为a，与手写a链接的区别
  - router-link抹平了两种模式下href的书写方式，会得到正确的href值
  - history模式下调用pushState并阻止默认行为
  - history 模式下使用 `base` 选项之后，所有的 `to` 属性都不需要写 (基路径) 了

#### 2、router-view

* 确定路由组件显示的位置
* 可以嵌套
* 命名视图router-view：如果 `<router-view>`设置了名称（name属性），则会渲染对应的路由配置中 `components` 下的相应组件

```JavaScript
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

#### 3、this.$route

* params：路由参数对象
* query：表示 URL 查询参数对象，对于路径 `/foo?user=1`，则有 `　this.$route.query.user == 1`
* matched：匹配的路由记录数组
* path：当前路由的路径，绝对路径，eg：”/foo/bar“

#### 4、this.$router

* push(location) 

  跳转到指定url路径，并向history栈中添加一个记录，点击后退会返回到上一个页面

* replace(location) 

  跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面

* go(n) 

  向前或者向后跳转n个页面，n可为正整数或负整数

* back() 

* forward() 

* resolve() 

  解析目标位置，const {href} = this.$router.resolve(location) // 得到完整的url，可以window.open打开

```javascript
//demo
// 0. 注册插件 Vue.use(VueRouter) 
// 1. 定义 (路由) 组件。 
// 可以从其他文件 import 进来 
const Foo = { template: '<div>foo</div>' } 
const Bar = { template: '<div>bar</div>' } 

// 2. 定义路由 
// 每个路由应该映射一个组件。 
const routes = [ { path: '/foo', component: Foo }, { path: '/bar', component: Bar } ]

// 3. 创建 router 实例，然后传 `routes` 配置 
const router = new VueRouter({ routes // (缩写) 相当于 routes: routes })
                              
// 4. 创建和挂载根实例。 
// 记得要通过 router 配置参数注入路由， 
// 从而让整个应用都有路由功能 
const app = new Vue({ router }).$mount('#app')
```

### 2、命名路由

* 可以直接通过名字跳转，后续如果更改了path，则不影响name的跳转 

* 设置了默认的子路由，则子路由的name会被警告，通过name跳转子路由则不会显示默认的子路由

```vue
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})

<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
<!-- router.push({ name: 'user', params: { userId: 123 } }) -->
<!-- 导航至/user/123 -->
```

### 3、子路由

* 默认子路由: path: '' 
* 子路由中的path是否以'/'开头的区别，加'/'是绝对路径，不加是相对

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: '/posts',
          component: UserPosts
        },
        {
          //默认子路由，默认显示
          path:'',
          component: UserPosts
        }
      ]
    }
  ]
})
```

### 4、动态匹配路由

* params: /user/:username 
* 响应路由参数变化：watch 、beforeRouteUpdate

```javascript
watch: { 
    '$route.params.id'() { 
        this.getNews() 
    } 
｝

beforeRouteUpdate(to, from, next) { 
    this.getNews(to.params.id) 
  	next() 
},
```

### 5、404路由

```javascript
// 含有通配符的路由应该放在最后
{ path: '*', component: NotFound, }
```

### 6、重定向和路由别名

::: tip
面试题：如何重定向页面
:::

* 重定向：通过routers配置redirect实现，可配置为：路径｜对象｜函数

* 别名：通过routers配置alias实现

```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' },
    { path: '/a', redirect: { name: 'foo' }},
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
     }},
    { path: '/a', component: A, alias: '/b' } 
  ]
})
```

### 7、导航守卫

#### 1、全局守卫
* 前置守卫: beforeEach(to, from, next)
  * 必须调用next()才可继续
  * next('/')  next({path: '/'}) 当前的导航被中断，然后进行一个新的导航。比如访问需要登录的页面，如果没有登录的话， 就跳转到登录页
  * 参数解析：
    * to即将要进入的目标路由对象
    * from当前导航正要离开的路由
    * next: Function 一定要调用该方法来 **resolve** 这个钩子。
* 解析守卫: beforeResolve(to, from, next)
  * 2.5.0新增
  * 组件内守卫和异步路由组件被解析之后，导航被确认之前被调用
* 后置守卫: afterEach(to, from)
  * 无next参数，不会改变导航，因为导航已被确认
#### 2、路由独享守卫
* beforeEnter：路由配置上直接定义
```JavaScript
  const router = new VueRouter({
    routes: [
      {
        path: '/foo',
        component: Foo,
        beforeEnter: (to, from, next) => {
            // ...
        }
      }
    ]
  })
```
####  3、组件守卫
* beforeRouteEnter(to, from, next)
  * 在渲染该组件的对应路由被 confirm 前调用
  * 不能访问this，组件实例还未被创建
  * 可以给next传递一个回调访问this，也是唯一一个支持给next传递回调的守卫
```javascript
  beforeRouteEnter (to, from, next) {
    next(vm => {
        // 通过 `vm` 访问组件实例
    })
  }   
```
* beforeRouteUpdate(to, from, next)
  * 在当前路由改变，但是该组件被复用时调用
  * 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
```javascript
  beforeRouteUpdate (to, from, next) {
    // just use `this`
    this.name = to.params.name
    next()
  }
```
* beforeRouteLeave(to, from, next)
  * 导航离开该组件的对应路由时调用
  * 这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。
```javascript
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm('您确定离开吗？还有未保存的更改')
    if (answer) {
        next()
    } else {
        next(false)
    }
  }
```

#### 4、完整的导航解析流程

::: tip
面试题：导航守卫的流程
:::

* 导航被触发

* 【组件守卫】前一个组件的 beforRouteLeave
* 【全局守卫】的 router.beforeEach
* 【组件守卫】如果是路由参数变化，重用组件，在重用的组件内触发 beforeRouteUpdate
* 【路由独享守卫】在路由配置里, 调用下一个的 beforeEnter
* 解析异步路由组件
* 【组件守卫】激活的组件里调用 beforeRouteEnter，next内传入的回调未调用
* 【全局守卫】调用全局的beforeResolve守卫，组件内守卫和异步路由组件被解析之后，导航被确认之前被调用
* 导航被确认
* 【全局守卫】调用全局的afterEach钩子
* 触发DOM更新
* 调用beforeRouteEnter守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入

::: tip
面试题：路由导航守卫和Vue实例生命周期钩子函数的执行顺序
:::

1. /news/1 -> /login
   * 【组件守卫】beforRouteLeave
   * 【全局守卫】beforeEach
   * 【路由独享守卫】beforeEnter
   * 【组件守卫】beforeRouteEnter(无法访问this，实例未创建)
   * 【全局守卫】beforeResolve
   * 【全局守卫】afterEach
   * 【vue生命周期】beforeCreate、created、beforeMount
   * 调用beforeRouteEnter守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入
   * 【vue生命周期】mounted
2. /news/1 -> /news/1(路由更新，组件相同)
   * 【全局守卫】beforeEach
   * 【组件守卫】beforeRouteUpdate
   * 【全局守卫】beforeResolve
   * 【全局守卫】afterEach
   * 【vue生命周期】beforeUpdate、updated

### 8、路由元数据

路由定义时可通过meta属性配置元数据，常用于路由鉴权

```js
//定义
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          meta: { requiresAuth: true } // a meta field
        }
      ]
    }
  ]
})
//使用meta，通过路由记录访问：/foo/bar 这个 URL 将会匹配父路由记录以及子路由记录。
router.beforeEach((to, from, next) => {
  //一个路由匹配到的所有路由记录会暴露为 $route 对象 (还有在导航守卫中的路由对象) 的 $route.matched 数组。因此，我们需要遍历 $route.matched 来检查路由记录中的 meta 字段。
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

### 9、路由懒加载及异步组件

* 优点：在这个组件需要被渲染的时候才会触发该工厂函数，建议主页面组件正常加载，其他组件按需加载
* 基于vue异步组件和webpack代码分割可实现路由懒加载，异步组件需要一个工厂函数

```js
//定义能够被 Webpack 自动代码分割的异步组件
//1、异步组件：（）=> Promise.resolve({})
//2、webpack2代码分割：import('./Foo.vue')
//两者组合：() => import('./Foo.vue')
const Foo = () => import('./Foo.vue') 
//代码按组分块：const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const router = new VueRouter({ routes: [ { path: '/foo', component: Foo } ] })
```

* vue-cli3默认支持。在webpack中需要使用syntax-dynamic-import 插件，才能使babel支持
* prefetch: vue-cli3 对动态import()生成的资源自动添加prefetch，当前页面可能会用到的资源，在浏览器空闲时加载 

* preload: vue-cli3 应用会为所有初始化渲染需要的文件自动生成preload，用来指定页面加载后很快会被用到的资源 

## 4、其他面试题

1. 路由组件和路由为什么解耦，怎么解耦

解析：路由组件中写入路由参数有耦合，可以使用props进行解构，参数变化时路由组件不进行修改

```js
const Home = { template: '<div>User {{ $route.params.id }}</div>' }
const router = new VueRouter({ 
  routes: [ 
    { 
      path: '/home/:id', 
      component: Home 
    } ] 
})

//解耦后
const Home = { 
  props: ['id'], 
  template: '<div>User {{ id }}</div>' 
}
const router = new VueRouter({ 
  routes: [ { 
    path: '/home/:id', 
    component: Home, 
    props: true}, 
  ] 
})
```

2. Vue路由怎么跳转打开新窗口

```js
const resolved: {
  location: Location;
  route: Route;
  href: string;
} = router.resolve(location, current?, append?)
/* 解析目标位置 (格式和 <router-link> 的 to prop 一样)。
current 是当前默认的路由 (通常你不需要改变它)
append 允许你在 current 路由上附加路径 */
```

```js
const obj = { 
  path: xxx,//路由地址 
  query: { 
    mid: data.id //可以带参数 
  } 
};
const {href} = this.$router.resolve(obj);
window.open(href, '_blank');
```

