# VUE框架原理

## 1、VUE响应式原理

### 1、总结原理

当创建vue实例时，vue会遍历data里的属性，使用Object.defineProperty为属性添加getter和setter，对数据的读取进行劫持，getter进行依赖收集，setter进行派发更新。

* 依赖收集
  * 每个组件实例对应⼀个watcher实例
  * 在组件渲染过程中，把“touch”过的数据记录为依赖(触发getter -> 将当前watcher实例收集到属性对应的dep中) 
* 派发更新
  * 数据更新后 -> 会触发属性对应的setter -> 通过dep去通知watcher -> 关联的组件重新渲染

```vue
<template>
	<div>
		 <div>{{ a }}</div>
 		 <div>{{ info.name }}</div>
  </div>
</template>
<script>
  export default App extends Vue{
    data(){
      return {
        a: 'tes',
        info: {
          name: "xiaoming"
        }
      }
    }
  }
</script>

<!-- 
const dep1 = new Dep()
Object.defineProperty(this.$data, 'a', {
	get(){
		dep1.depend() //收集依赖
	  return value
	},
  set(newValue){
		if(newValue === value) return
    value = newValue
    dep1.notify() //通知依赖
	}
})

const dep2 = new Dep()
Object.defineProperty(this.$data, 'info', {
 ...
})

const dep3 = new Dep()
Object.defineProperty(this.$data.info, 'name', {
 ...
})
-->
```

### 2、三个核心类：

1. Observer：给对象的属性添加getter和setter，用于**依赖收集**和**派发更新**。
2. Dep：用于收集当前响应式对象的依赖关系，每个响应式对象都有一个dep实例。dep.subs = watcher[]，当数据发生变更的时候，会通过dep.notify()通知各个watcher.
3. Watcher：观察者对象，render watcher（渲染），computed watcher（计算属性），user watcher（用户使用watch）。

* 依赖收集
  * initState，对computed属性初始化时，会触发computed watcher依赖收集
  * initState，对监听属性初始化时，触发user watcher依赖收集
  * render，触发render watcher依赖收集

* 派发更新
  * 组件中对响应的数据进行了修改，会触发setter逻辑
  * 执行dep.notify()
  * 遍历所有subs，调用每一个watcher的update方法

<img src="/img/vue-reactive.png">

### 3、注意事项

#### 1、对象

* vue无法检测对象的添加
* 解决方案：this.$set(this.someObject, 'b', 2)
* 注意：Vue不允许动态添加根级别的响应式property

#### 2、数组

* Object.defineProperty无法监听数组索引值的变化，比如this.a[0] = 4
  * 解决方案：this.$set(this.a, 0, 44) ｜this.a.splice(0, 1, 44)
* 数组长度的变化无法检测
  * 解决方案：this.a.splice(newLength)删除从newLength之后的数据

* 重写了数组的方法：push\pop\shift\unshift\splice\sort\reverse

#### 3、其他

* 递归的循环data中的属性修改，可能导致性能问题
* 对于一些数据获取后不更改，只用于展示，可以使用Object.freeze(data.city)优化性能

### 4、手写vue响应式原理

#### 1、整体结构

申明整体核心类及方法，确认整体框架结构：

* index.html 主页面
* vue.js Vue主文件
* compiler.js 编译模版，解析指令（v-model等）
* dep.js 收集依赖关系，存储观察者，以发布订阅模式实现
* observer.js 实现数据劫持
* watcher.js 观察者对象类

```js
//vue主文件
export default class Vue {
   constructor(options = {}){
     /**
       * 1. vue构造函数，接收各种配置参数等
       * 2. options里的data挂载至根实例
       * 3. 实例化observer对象，监听数据变化，利用dep进行依赖收集和派发更新
       * 4. 实例化compiler对象，简析指令和模版表达式
       */
      ...
      this._proxyData(this.$data)
      new Observer(this.$data)
      new Compiler(this)
   }
}

//observer.js：实现数据劫持
export default class Observer {
    constructor(data){
        this.traverse(data)
    }
    traverse(data){} //递归遍历data里的所有属性
    defineReactive(obj, key, val){} //给传入的数据设置getter/setter, 利用dep实现依赖收集和派发更新
}

//compiler.js：编译模版，解析指令
export default class Compiler {
    constructor(vm){
        this.compiler(vm.$el)
    }
    compiler(el){} //编译模版时为每个响应式对象建立watcher对象，并将watcher推送进dep用于依赖收集
}

//dep.js：收集依赖关系，存储观察者
export default class Dep {
    constructor(){ //存储所有观察者
        this.subs = []
    }
    addSub(watcher){} //添加观察者
    notify(){} //发送通知
}

//watcher.js：观察者对象类
export default class Watcher {
    constructor(vm, key, cb){} //vm实例、key属性、cb回调函数
    update(){} //当数据变化时更新视图
}
```

#### 2、index.html

使用module引入vue进行测试，测试指令及响应式

```html
<!DOCTYPE html>
<html lang="cn">
    <head>
        <title>my vue</title>
    </head>
    <body>
        <div id="app">
            <h1>模版表达式测试</h1>
            <h3>{{msg}}</h3>
            <h3>{{count}}</h3>
            <br/>

            <h1>v-text测试</h1>
            <div v-text="msg"></div>
            <br/>

            <h1>v-html测试</h1>
            <div v-html="innerHtml"></div>
            <br/>

            <h1>v-model测试</h1>
            <input type="text" v-model="msg">
            <input type="text" v-model="count">
            <button v-on:click="handler">按钮</button>
        </div>
        <script src="./index.js" type="module"></script>
    </body>
</html>
```

```js
//index.js
import Vue from './vue.js'
const vm = new Vue({
    el: "#app",
    data: {
        msg: "Hello, vue",
        count: "100",
        innerHtml: "<ul><li>good job</li></ul>"
    },
    methods: {
        handler(){
            alert(1111)
        }
    }
})
console.log(vm)
```

#### 3、vue实例

```js
import Observer from './observer.js'
import Compiler from './compiler.js'

export default class Vue {
    constructor(options = {}){
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods
    
        this.initRootElement(options)
        //options里的data挂载至根实例
        this._proxyData(this.$data)

        //实例化observer对象，监听数据变化
        new Observer(this.$data)

        //实例化compiler对象，简析指令和模版表达式
        new Compiler(this)
    }

    /**
     * 获取根元素，并存储到vue实例，校验传入的el是否合规
     */
    initRootElement(options){
        if(typeof options.el === 'string'){
            this.$el = document.querySelector(options.el)
        }else if(options.el instanceof HTMLElement){
            this.$el = options.el
        }

        if(!this.$el){
            throw new Error('input el error, you should input css selector or HTMLElement')
        }
    }

    /**
     * 利用Object.defineProperty将options传入的data注入vue实例中
     * 给vm设置getter和setter
     * vm.a触发getter，获取this.$data[key]
     * vm.a=2触发setter，设置this.$data[key]=2
     */
    _proxyData(data){
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key] === newValue){
                        return
                    }
                    data[key] = newValue
                }
            })
        })

    }
}
```

#### 4、observer实例

```js
/**
 * 功能：实现数据劫持，利用dep进行依赖收集和派发更新
 * 1、调用时机：vue实例化时调用，监听data数据变化，new Observer(this.$data)
 * 2、实现机制：Object.defineProperty(this.$data, key, {})
 * 3、使用dep完成依赖收集dep.addSub和派发更新dep.notify机制
 * 编译模版：
 * a.为每个组件建立watch对象，eg：<div v-text="good"></div>  
 * new Watcher(this.vm, key, newValue => {node.textContent = newValue}
 * b.建立watch时，获取oldvalue，设置Dep.target，获取this.vm."good"值，触发vm的getter
 * c.获取this.$data["good"]，触发this.$data的getter，添加值dep依赖中
 * d.设置Dep.target = null，清除脏数据
 * 4、数据更新：
 *	this.flag = 1 -> vm的setter -> vm.$data.flag = 2 -> vm.$data.setter -> dep.notify -> 所有相关watcher.update
 */
import Dep from "./dep.js"

export default class Observer {
    constructor(data){
        this.traverse(data)
    }

    /**
     * 递归遍历data里的所有属性
     */
    traverse(data){
        if(!data || typeof data !== 'object'){
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    /**
     * 给传入的数据设置 getter/setter，响应式改造
     * 1、给vm.$data对象里的每个属性递归设置getter和setter
     * 2、使用dep进行依赖收集dep.addSub和派发更新dep.notify
     * @param {*} obj 
     * @param {*} key
     * @param {*} val
     */
    defineReactive(obj, key, val){
        this.traverse(val) //子元素是对象，递归处理
        const that = this
        const dep = new Dep() //dep存储观察者
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get(){
                Dep.target && dep.addSub(Dep.target) //收集依赖，只有当watcher初始化时才会添加依赖
                return val
            },
            set(newValue){
                if(newValue === val){
                    return
                }
                val = newValue
                that.traverse(newValue)//设置的时候可能设置了对象
                dep.notify()
            }
        })
    }
}
```

#### 5、dep实例

```js
/**
 * 发布订阅模式
 * 存储所有观察者，watcher
 * 每个watcher都有一个update
 * 通知subs里的每个watcher实例，触发update方法
 */
/**
 * 问题：
 * 1、dep 在哪里实例化，在哪里addsub：observer实例化并给this.$data添加getter和setter时初始化，用于收集依赖关系，存储观察者
 * 2、dep notify在哪里调用：数据变化时，this.$data.setter里调用
 */
export default class Dep {
    constructor(){
        //存储所有观察者
        this.subs = []
    }
    /**
     * 添加观察者
     */
    addSub(watcher){
        if(watcher && watcher.update){
            this.subs.push(watcher)
        }
    }
    /**
     * 发送通知
     */
    notify(){
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}
```

#### 6、compiler实例

```js
import Watcher from './watcher.js'

/**
 * 功能：模版编译
 * 1、模版编译时为每个组件添加一个watcher实例，设置回调函数为更新数据
 * 2、watcher初始化时，传入实例、key、回调
 */
export default class Compiler {
    constructor(vm){
        this.el = vm.$el
        this.vm = vm
        this.methods = vm.$methods
        this.compiler(vm.$el)
    }

    /**
     * 编译模版
     * @param {} el 
     */
    compiler(el){
        const childNodes = el.childNodes //nodeList伪数组
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)){//文本节点
                this.compilerText(node)
            }else if(this.isElementNode(node)){//元素节点
                this.compilerElement(node)
            }

            //有子节点，递归调用
            if(node.childNodes && node.childNodes.length > 0){
                this.compiler(node)
            }
        })
    }

   /** 判断文本节点 */
   isTextNode(node){
       return node.nodeType === 3
   }

    /** 判断元素节点 */
   isElementNode(node){
       return node.nodeType === 1
   }

   /** 判断元素属性是否是指令 */
   isDirective(attrName){
        return attrName.startsWith('v-')
   }

   /** 编译文本节点，{{text}} */
   compilerText(node){
       const reg = /\{\{(.+?)\}\}/;
       const value = node.textContent;
       if(reg.test(value)){ 
           const key = RegExp.$1.trim() //$1取到匹配内容，text
           node.textContent = value.replace(reg, this.vm[key]) //this.vm[key]即vm[text]
           new Watcher(this.vm, key, (newValue)=> {
                node.textContent = newValue //更新视图
           })
       }
   }

   /** 编译元素节点 */
   compilerElement(node){
        if(node.attributes.length){
            Array.from(node.attributes).forEach(attr => { //遍历节点的属性
                const attrName = attr.name //属性名
                if(this.isDirective(attrName)){ //v-model="msg"、v-on:click="handle"
                    let directiveName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2) //指令名，model、click
                    let key = attr.value //msg\handle，属性值
                    this.update(node, key, directiveName) //更新元素节点
                }
            })
        }
   }

   /**
    * 更新节点
    * @param {*} node 
    * @param {*} key 指令值：msg、handle
    * @param {*} directiveName 指令名，model
    */
   update(node, key, directiveName){
       //v-model\v-text\v-html\v-on:click
       const updateFn = this[directiveName + 'Updater']
       updateFn && updateFn.call(this, node, this.vm[key], key, directiveName) //
   }

   /** 解析v-text，编译模版，添加watcher */
   textUpdater(node, value, key){
        node.textContent = value
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
   }

   /** 解析v-model */
   modelUpdater(node, value, key){
        node.value = value
        new Watcher(this.vm, key, newValue => {
            node.value = newValue
        })
        node.addEventListener('input', ()=>{
            this.vm[key] = node.value
        })
   }

   /** 解析v-html */
   htmlUpdater(node, value, key){
        node.innerHTML = value
        new Watcher(this.vm, key, newValue => {
            node.innerHTML = newValue
        })
   }

   /** 解析v-on:click */
   clickUpdater(node, value, key, directiveName){
        node.addEventListener(directiveName, this.methods[key])
   }
}
```

#### 7、watcher实例

```js
import Dep from "./dep.js"

/**
 * 功能：观察者对象类
 * 1、watcher初始化获取oldvalue的时候，会做哪些操作
 * 2、通过vm[key]获取oldvalue时，为什么将当前实例挂载在dep上获取后设置为null
 * 3、update方法在什么时候执行的：dp.notify()
 */
export default class Watcher {
    /**
     * @param {*} vm vue实例
     * @param {*} key data中的属性名
     * @param {*} cb 负责更新视图的回调函数
     */
    constructor(vm, key, cb){
        this.vm = vm
        this.key = key
        this.cb = cb

        //每次watcher初始化时，添加target属性
        Dep.target = this
        //触发get方法，在get方法里会取做一些操作
        this.oldValue = this.vm[key]
        Dep.target = null //可能会出现脏数据,清空操作
    }

    /**
     * 当数据变化时更新视图
     */
    update(){
        let newValue = this.vm[this.key]
        if(this.oldValue === this.newValue){
            return
        }
        this.cb(newValue)
    }
}
```

## 2、计算属性的实现原理

computed watcher为计算属性的监听器

computed watcher持有一个dep实例，通过dirty属性标记计算属性是否需要重新求值

当computed的依赖值改变后，就会通知订阅的watcher进行更新，对于computed watcher会将dirty属性设置为true，并且进行计算属性方法的调用。

### 1、computed缓存

计算属性是基于他的响应式依赖进行缓存的，只有依赖发生改变的时候才会重新求值

### 2、缓存意义及使用

应用在方法内部操作非常耗时，优化性能。例如计算属性方法里遍历一个极大的数组，计算一次可能耗时1s，使用计算属性可以很快获取到值。

### 3、计算属性检测

计算属性必须有响应式的依赖，否则无法监听，只有在vue创建初始化时添加监听的东西，才可以被计算属性监听到。

另computed和watch属性：computed用于做简单转换不适合做复杂操作，watch适合监听动作，做复杂操作。

```vue
<template>
	<div>
    {{storageMsg}} is {{time}}
  </div>
</template>
<script>
//storageMsg和time都无法更新
export default MyVue extends Vue {
  computed: {
    storageMsg: function(){
      return sessionStorage.getItem("key")
    },
    time: function(){
      return Date.now()
    }
  }
}
</script>
```

## 3、Vue.nextTick的原理

vue是异步执行dom更新的，一旦观察到数据的变化，把同一个事件循环中观察数据变化的watcher推送到队列中。在下一次事件循环时，vue清空异步队列，进行dom的更新。eg：vm.someData = 'new value', dom并不会马上更新，而是在异步队列被清除时才会更新dom。

1. 支持顺序：Promise.then -> MutationObserver -> setImmediate -> setTimeout.

* 使用：Promise.then或者MutationObserver时，为微任务，宏任务 -> 微任务（dom更新未渲染，回调函数中已经可以拿到更新的dom）-> UI render

* 使用：setImmediate、setTimeout时，为宏任务，宏任务 -> UI render -> 宏任务，dom已更新，可拿到更新的dom

2. 什么时候使用nextTick呢？

在数据变化后要执行某个操作，而这个操作依赖因你数据改变而改变后的dom，这个操作应该放置在vue.nextTick回调中。可以使用update钩子或setTimeout方法实现。

```vue
<template>
	<div v-if="loaded" refs="test"></div>
</template>
<script>
  	export default MyVue extends Vue {
      methods: {
        async showDiv(){
          this.loaded = true
          //直接执行this.$refs.test无法拿到更新的dom
          await Vue.nextTick()
          this.$refs.test
          /* Vue.nextTick(function(){
          		this.$refs.test
					}) */
				}
      }
    }
</script>
```
