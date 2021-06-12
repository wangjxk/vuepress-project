# VUE2.0基础

> 参考资料：
> 1. [VUE官网教程](https://cn.vuejs.org/v2/guide/index.html)
> 2. [VUE官网API详解](https://cn.vuejs.org/v2/api/)

vue 是一个响应式的前端视图层框架。

* 响应式：编写模版代码时，仅需要关注数据的变化即可，数据变化 UI 即可随之变化 

* 视图层：类似前段模板、只是UI层面的框架
* 框架：framework框架（整个应用程序设计），library库（工具函数集合）

## 一、引入

1、直接引用vue.js，适合小型项目或部分使用vue

* 引用全部vue.js，运行时编译及渲染
* 引用部分vue.js，仅引入渲染部分

```html
<!-- 全部引用 -->
<head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <p>Message is: {{message}}</p>
    </div>
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                message: 'hello world'
            }
        })
    </script>
</body>

<!-- 部分引用，不再展示双括号再重新渲染 -->
<head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app"></div>
    <script>
        var app = new Vue({
            el: '#app',
            data: {
                message: 'hello world'
            }，
            render(createElement){
                return createElement(
                    'p',
                    null,
                    [createElement('Message is: ', this.message)]
                )
        	}
        })
    </script>
</body>
<!-- 解析
createElement建立虚拟DOM即VNODE
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
-->
```

2、使用vue-cli工程化启动整体vue项目

## 二、选项

### 1、数据选项

#### 1、data

```js
{//根实例为数据对象，组件为函数返回对象
  data: {}, //根实例
  data: function(){
    return {
    }
  }, //组件
} 
```

#### 2、props

* 传值方式

```js
//子组件：可为数组或对象
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}

//父组件
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
<!-- 单文件组件和字符串模板无限制 -->
<blog-post postTitle="hello!"></blog-post>

几种传值方式：
<!-- 静态值 -->
<blog-post title="My journey with Vue"></blog-post>
<!-- 动态值，使用bind，包括：变量、对象、表达式、数字、布尔值、数组 -->
<blog-post v-bind:title="post.title"></blog-post>
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>
<blog-post v-bind:likes="42"></blog-post>
<blog-post is-published></blog-post>  //无值等价为true
<blog-post v-bind:is-published="false"></blog-post>
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>
```

* 类型检测与验证

```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

* 传值异常处理

```js
# 替换/合并已有的 Attribute
对于绝大多数 attribute 来说，从外部提供给组件的值会替换掉组件内部设置好的值。所以如果传入 type="text" 就会替换掉 type="date" 并把它破坏！庆幸的是，class 和 style attribute 会稍微智能一些，即两边的值会被合并起来。

# 禁用Attribute继承，不会影响style和class 的绑定
# 基础组件：inheritAttrs和$attrs配合使用
# <base-input> 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 <input> 元素一样使用了：所有跟它相同的 attribute 和监听器都可以工作，不必再使用 .native 监听器。

Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
<base-input
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>

/*
解析：
1、如果给组件传递的数据，组件不使用props接收，那么这些数据将作为组件的HTML元素的特性，这些特性绑定在组件的HTML根元素上。
2、inheritAttrs: false的含义是不希望本组件的根元素继承父组件的attribute，同时父组件传过来的属性（没有被子组件的props接收的属性），也不会显示在子组件的dom元素上，但是在组件里可以通过其$attrs可以获取到没有使用的注册属性。
3、$attrs、$listeners、$props
$attrs：当前组件的属性，通俗的讲也就是在组件标签定义的一系列属性，如input的value，placeholder等，但是不包括在当前组件里面定义的props属性。
$listeners：当前组件监听的事件，通俗的讲也就是在使用组件的时候在标签中定义的事件，如@input，以及一些自定义事件@tempFn等。
$props：当前组件从父组件那里接收的参数，通俗的讲和$attr差不多，但是只包括在当前组件中定义了的props属性。
4、.native修饰符：在一个组件的根元素上直接监听一个原生事件。
*/
```

#### 3、propsData

```js
//只用于new创建的实例中，创建实例时传递props，方便测试
var vm = new Comp({
  propsData: {
    msg: 'Hello'
  }
})
```

#### 4、methods｜computed｜watch

1. computed:  { [key: string]: Function | { get: Function, set: Function } }

2. watch:  { [key: string]: string | Function | Object | Array }

3. methods:  { [key: string]: Function }

* 计算属性：computed，同步操作不能含有异步

``` js
<!-- 通常为get -->
computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
}
<!-- 可使用set -->
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
vm.fullName = 'John Doe'
```

* 监听属性：watch，在数据变化响应时，执行异步操作或开销较大的操作使用watch更佳

``` js
<!-- 简写 -->
watch: {
    firstName(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    }
}

<!-- handler函数和immediate、deep -->
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，默认为false
    immediate: true，
  }，
  'firstName.a':{
     handler(){},
     // 深度监听
    deep：true
  }
}
```
* 计算属性与方法

计算属性是基于它们的响应式依赖进行缓存的；方法每次会求值。

``` js
<!-- 计算属性 -->
<p>Computed reversed message: "{{ reversedMessage }}"</p>
<!-- 方法 -->
<p>Reversed message: "{{ reversedMessage() }}"</p>
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

* 计算属性与监听属性
  - 当需要数据在 **异步变化或者开销较大时** ，执行更新，使用watch会更好一些；而computed**不能进行异步操作**；
  - computed可以用 **缓存中拿数据** ，而watch是每次都要运行函数计算，不管变量的值是否发生变化，而computed在值没有发生变化时，可以直接读取上次的值。

### 2、生命周期选项

<img src="/img/vue-life.png" width="70%">

``` js
{
  //生命周期钩子函数
	beforeCreate：function(){},
	created:function(){},
	beforeMounted: function(){},
	mounted:function(){},
	beforeUpdate：function(){},
	updated:function(){},
	beforeDestory:function(){},
	destoryed(){},
 }
```

| vue2.0        | description（function）                                      |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 组件实例刚被创建，组件属性计算之前，如data属性等，this.data、this.$el都是undefined |
| created       | 组件实例创建完成，属性已绑定，但dom未生成，$el属性不存在undefined，this.data有值 |
| beforeMount   | 模板编译/挂载之前，data、$el都有值，dom树显示的是{{message}}，虚拟dom |
| mounted       | 模板编译/挂载之后，data、$el都有值，dom树显示正常节点        |
| beforeUpdated | 组件更新之前                                                 |
| updated       | 组件更新之后                                                 |
| activated     | for  keep-alive，组件被激活时使用                            |
| deactivated   | for  keep-alive，组件被移除时调用                            |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |

vue中内置的方法 属性和vue生命周期的运行顺序（methods、computed、data、watch、props)：props => methods =>data => computed => watch。

### 3、dom选项

#### 1、el

* vue实例创建时有效，可以是css选择器或者是一个 HTMLElement 实例。

* 在实例化时存在这个选项，实例将立即进入模版编译过程，否则，需要显式调用 `vm.$mount()` 手动开启编译。

* 可通过vm.$el获取vue关联的实例

```js
new Vue({    
  el:"#container",
})

new Vue({
  render: h => h(App),
}).$mount('#app')
```

#### 2、template

* String类型，字符串模版，模版会替换挂载的元素。

* 如果值以 `#` 开始，则它将被用作选择符，并使用匹配元素的 innerHTML 作为模板。常用的技巧是用 `<script type="x-template">` 包含模板。

```vue
<!-- heading组件定义 -->
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
</script>
<script>
Vue.component('heading', {
  template: '#anchored-heading-template',
  /* 
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
  */
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
</script>
```

#### 3、render

* **类型**：`(createElement: () => VNode) => VNode`
* 字符串模板的代替方案，该渲染函数接收一个 `createElement` 方法作为第一个参数用来创建 `VNode`。如果组件是一个函数组件，渲染函数还会接收一个额外的 `context` 参数，为没有实例的函数组件提供上下文信息。

```js
Vue.component('heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

#### 4、renderError

- **类型**：`(createElement: () => VNode, error: Error) => VNode`
- 只在开发环境使用，当 `render` 函数遭遇错误时，提供另外一种渲染输出。其错误将会作为第二个参数传递到 `renderError`。

```js
new Vue({
  render (h) {
    throw new Error('oops')
  },
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
}).$mount('#app')
```

### 4、资源选项

#### 1、components

包含vue实例可用组件的hash表，object对象，component: { heading, mycomponent}

#### 2、directives

包含vue实例可用指令的哈希表

#### 3、filters

将原数据进行格式话，不改变原数据，应用于金额、时间格式化，过滤器内部无法使用this

* 全局过滤器
* 局部过滤器

```html
<script>
//全局定义
Vue.filter("timeFormat", function(val, formatter="YYYY:MM:DD")){
    return moment(val).format(formatter)
})
//局部定义
{
  fiters:{
    timeFormat(val, formatter) {
 				return moment(val).format(formatter)
 		}
  }
}
</script>
//使用
<template>
	<div>
  		<!-- {{}}使用 -->
			{{ timer | format }}   
      <!-- 在v-bind中 -->
      <div v-bind:id="rawId | format('YYYY:MM:DD')"></div>  
 	</div>
</tempalte>
```

### 5、组合选项

#### 1、parent

指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 `this.$parent` 访问父实例，子实例被推入父实例的 `$children` 数组中。

#### 2、mixins

接收一个混入对象的数组，Array<object>

* 应用于抽离公共逻辑（逻辑相同，模版不同），缺点数据来源不明确
* 全局混入与局部混入：全局会影响之后每个创建的vue实例，局部只组件内使用

```js
//全局混入
Vue.mixin({
  created: function(){}
})

//局部混入
export default {
 name: 'ElDialog',
 mixins: [Popup, emitter, Migrating],
}
```

* 合并策略

  * 数据对象，在内部会进行递归合并，发生冲突时以组件数据优先

  * 同名钩子函数将合并为一个数组，全部会执行，混入对象的钩子在自己钩子之前执行

  * 值为对象的选项，例如 methods、components 和 directives，将被合并为同⼀个对象。两个对象键 

    名冲突时，取组件对象的键值对。

```js
var mixin = {
  data: function(){
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function(){
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function(){
    // {message: "goodbye", bar: "def", foo: "abc"}
    console.log(this.$data) //
  }
})
```

#### 3、extends

申明扩展了另一个组件 (可以是一个简单的选项对象或构造函数)，而无需使用 `Vue.extend`

```js
var CompA = { ... } // 在没有调用 `Vue.extend` 时候继承 CompA 
var CompB = {  extends: CompA,  ... }
```

#### 4、provide/inject

一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效.`provide` 和 `inject` 绑定并不是可响应的

* provide
  * Object | () => Object
* Inject
  * Array<string> | { [key: string]: string | Symbol | Object }

```js
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

### 6、其他选项




## 三、指令

### 1、模版指令：v-text｜v-html|v-once

使用基于html的模板语法，渲染成虚拟DOM结构，可使用JSX模板语法，也可直接使用render函数。

* 文本：v-text

``` vue
//“Mustache”语法 (双大括号) 的文本插值
<span>Message: {{ msg }}</span>
<span v-text="msg"></span>
```

* javascript表达式

``` vue
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```

* v-html：内容按普通html插入，不会作为模版进行编译

```vue
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

* v-once：一次插值，不变化

```
<span v-once>这个将不会改变: {{ msg }}</span>
```

### 2、条件指令：v-if｜v-else｜v-else-if｜v-show

v-if、v-else、v-else-if：条件渲染，用key管理组件复用，v-for优先级高于v-if。

v-show：改变display（disabled）

### 3、循环指令：v-for

* 数组： items = [];

  v-for=“item in items”

  v-for=“(item, index) in items”

  v-for="item of items"

* 对象：object = {}，通过object.keys()遍历

  v-for="value in object"

  v-for="(value, name) in object"

  v-for="(value, name, index) in object"

* 整数：< span v-for="n in 10">{{ n }} < /span >

* 渲染使用就地更新策略（track-by="$index"，根据游标更新），通过使用key值来重用和重新排序渲染，key使用字符串或数据类型值。

* Vue **不能检测**数组和对象的变化，可监听数组变化方法

``` js
  - push() //向数组的末尾添加一个或更多元素，并返回新的长度
  - pop()  //删除数组的最后一个元素并返回删除的元素。
  - shift() //删除并返回数组的第一个元素。
  - unshift() //向数组的开头添加一个或更多元素，并返回新的长度。
  - splice() //添加或删除原素 array.splice(index,howmany,item1,.....,itemX)
  - sort() //array.sort(sortfunction)
  - reverse() //颠倒顺序后的数组
  
  使用新数组替换旧数组，使用filter、concat、slice返回新数组
  example1.items = example1.items.filter(function (item) {
    return item.message.match(/Foo/)
  })
  - filter
  - concat //array1.concat(array2,array3,...,arrayX)
  - slice //选取数组的一部分，并返回一个新数组。array.slice(start, end)
```

附件：扩展数组其他操作

``` js
//数组是否有该元素，include
arr.includes(searchElement)
arr.includes(searchElement, fromIndex)

//循环操作数据返回新值，map
array.map(function(currentValue,index,arr), thisValue)
currentValue 必须。当前元素的值
index 可选。当前元素的索引值
arr 可选。当前元素属于的数组对象
thisValue 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。
如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象。
```

### 3、事件指令：v-on，简写@

* 调用方法

``` js
<button v-on:click="counter += 1">Add 1</button>
<!-- 事件处理方法 -->
<button v-on:click="greet">Greet</button>
 methods: {
    greet: function (event) {
      // `this` 在方法里指向当前 Vue 实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM 事件
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
  
<!-- 处理方法入参 --> 
<button v-on:click="say('hi')">Say hi</button>
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

* 事件修饰符

``` js
.stop //event.stopPropagaration()
.prevent //event.preventDefault()
.capture //事件捕获模式，即内部元素触发的事件先在此处理，然后才交由内部元素进行处理
.self //只当在 event.target 是当前元素自身时触发处理函数
.once //只会触发一次事件
.passive //表示处理事件函数中不会调用preventDefault函数,用于提升滑动性能
.native //监听组件根元素的原生事件，主要是给自定义的组件添加原生事件

<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发，不必检测preventDefault -->
<div v-on:scroll.passive="onScroll">...</div>

<!-- 监听根元素事件 -->
<my-component v-on:click.native="outClick"></my-component>
```

* 按键修饰符

``` html
<！-- 按键编码控制 -->
<！-- .enter、.tab、.delete (捕获“删除”和“退格”键)、.esc、.space -->
<！-- .up、.down、.left、.right -->
<input v-on:keyup.13="submit">
<input v-on:keyup.enter="submit">

<！-- 通过全局 config.keyCodes 对象自定义按键修饰符别名 -->
Vue.config.keyCodes.f1 = 112
```

* 系统修饰符

``` html
<！-- .ctrl、.alt、.shift、.meta、.exact精确控制 -->

<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

* 鼠标修饰符

``` html
<！-- .left、.right、.middle -->

<！-- 鼠标左键事件 -->
<div @click.left="mouseClick"></div>
```

### 4、表单指令：v-model｜v-bind
1. v-bind，简写”：“，单向数据绑定

```vue
<!-- 固定参数 -->
<a v-bind:href="url">...</a>

<!--
//动态参数
//约定1：输出字符串，异常为null，null也用于移除绑定
//约定2：动态参数表达式有语法约定，空格和引号放在 HTML attribute名里是无效的，可使用计算属性替代
//约定3：在DOM中使用模板时 (直接在一个HTML文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把attribute名全部强制转为小写
-->
<a v-bind:[attributeName]="url"> ... </a>
```

* class和style增强：使用v-bind，添加了对象和数组支持

```vue
//class绑定
<!-- 对象语法 -->
<div class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
data: {
  isActive: true,
  hasError: false
}
result：<div class="static active"></div>

<div v-bind:class="classObject"></div>
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}

<!-- 数组语法 -->
<div v-bind:class="[activeClass, errorClass]"></div>
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
result：<div class="active text-danger"></div>

<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
<div v-bind:class="[{ active: isActive }, errorClass]"></div>

//style绑定
<!-- 对象语法：属性可为fontSize或'font-size' -->
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
data: {
  activeColor: 'red',
  fontSize: 30
}

<div v-bind:style="styleObject"></div>
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}

<!-- 数组语法 -->
<div v-bind:style="[baseStyles, overridingStyles]"></div>
//使用需要添加浏览器引擎前缀的 CSS property 时，如 transform，Vue.js 会自动侦测并添加相应的前缀。
//多重值给定，只会渲染数组中最后一个被浏览器支持的值
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

2. v-model：双向数据绑定，表单元素创建双向绑定数据流：select、input、textarea，本质为语法糖

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 `value` property 和 `input` 事件；

- checkbox 和 radio 使用 `checked` property 和 `change` 事件；

- select 字段将 `value` 作为 prop 并将 `change` 作为事件。

``` html
<!-- 单行文本：input，使用value属性 -->
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>

<!-- 多行文本：textarea，使用value属性 -->
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>

<!-- 选择框：checkbox，使用checked属性，checked返回true和false -->
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>

<!-- 选择框：redio，多选使用value属性，picked返回value值-->
<div id="example-4">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <span>Picked: {{ picked }}</span>
</div>
```

修饰符: lazy、.number、.trim

``` html
<!-- 在“change”时而非“input”时更新，input事件转为change事件 -->
<input v-model.lazy="msg">

<!-- 将用户的输入值转为数值类型 -->
<input v-model.number="age" type="number">

<!-- 去除首位空白符 -->
<input v-model.trim="msg">
```

### 5、插槽指令：v-slot

* 默认插槽和具名插槽：缩写#

```vue
<!-- 子组件：base-layout -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<!-- 父组件使用base-layout -->
<base-layout>
  <!-- 需要使用 template 包裹 -->
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>
  
	<!-- 默认插槽 -->
  <!-- 等价于 <template v-slot:default> <template> 包裹 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <!-- 缩写#，动态插槽为 v-slot:[dynamicSlotName] -->
  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

* 作用域插槽：组件内部将数据传递给插槽。父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字，并使用prop访问子组件的数据

```vue
<!-- 子组件current-user -->
<span>
  <slot>{{ user.lastName }}</slot>
</span>

<!-- 父组件使用: 放置在template上 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>

<!-- 只有默认插槽的缩写，直接放组件上，无需使用template -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

<!-- 默认插槽作⽤域与具名插槽作⽤域同时存在时，默认插槽不能简写，必须写成v-slot形式 -->
<el-dialog>
 		<!-- 不能简写，直接使用div形势，作用域不明确 -->
    <!-- 错误写法：
			<div>这是弹窗内容</div>
 			<div>{{ contentInfo }}</div>
    -->
 		<template v-slot:default="contentInfo">
 				<div>这是弹窗内容</div>
 				<div>{{ contentInfo }}</div>
 		</template>
 		<template v-slot:footer="footerSlotProps">
 				<div>footer</div>
 				<div>{{ footerSlotProps }}</div>
 		</template>
</el-dialog>
<!-- 子组件el-dialog  -->
<div>
 		<div>弹窗</div>
 		<slot :contentInfo="contentInfo">默认内容</slot>
 		<slot name="footer" :footerInfo="footerInfo">默认footer</slot>
</div>
```

* 废弃语法
  * 具名插槽属性：slot
  * 作用域插槽属性：slot-scope

### 6、编译指令：v-pre｜v-cloak

* v-pre

跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

```js
<span v-pre>{{ this will not be compiled }}</span>
```

* v-cloak

这个指令保持在元素上直到关联实例结束编译。和 css 规则如`[v-cloak] { display: none }`一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

用法：可以使用 v-cloak 指令设置样式，这些样式会在 Vue 实例编译结束时，从绑定的 HTML 元素上被移除。当网络较慢，网页还在加载 Vue.js ，而导致 Vue 来不及渲染，这时页面就会显示出 Vue 源代码，使用v-cloak配合样式是解决屏幕闪动的好方法。

```html
<div id="app">
  {{context}}
</div>
<script>
  var app = new Vue({
    el: '#app',
    data: {
      context:'屏幕会出现闪动'
    }
  });
</script>

<!-- 优化 -->
<div id="app" v-cloak>
  {{context}}
</div>
<style>
  [v-cloak]{
  		display: none;
	}
</style>
```

## 四、组件

### 1、注册

* 全局注册：所有组件及子组件都可用

```
//组件名使用 kebab-case短横线隔开式
Vue.component('my-component-name', { /* ... */ })
使用：<my-component-name></my-component-name>

//组件名使用 PascalCase驼峰式
Vue.component('MyComponentName', { /* ... */ })
使用：<my-component-name></my-component-name>或<MyComponentName>

解析：
w3c标准html中使用小写的kebab-case短横线隔开式；
字符串模板以及单文件组件可使用PascalCase驼峰式，最好统一使用kebab-case短横线隔开式。

模板字符串（支持空格和缩进、变量输出和函数调用）：`This is a ${basket.count}`.
字符串模板：使用字符串生成vue模板
template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'

// 定义一个名为 button-counter 的新组件，在new Vue()之前。
Vue.component('button-counter', {
  //data是个函数，不为对象
  data: function () {
    return {
      count: 0
    }
  },
  //字符串模板
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

//模块化全局注册
import BetterScroll from './components/BetterScroll'
Vue.component('BetterScroll', BetterScroll)
```

* 局部注册：当前组件可使用

```
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})

//模块化
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA //等价于ComponentA：ComponentA
  },
}
```

* 应用：基础组件的自动全局注册，多个组件的自动加载

```
//应用入口文件：src/main.js
//组件目录：./components
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

解析：
1、webpack的api：require.context函数获取特定上下文
require.context(directory,useSubdirectories,regExp)）
（1）接收三个参数：
directory {String} -读取文件的路径
useSubdirectories {Boolean} -是否遍历文件的子目录
regExp {RegExp} -匹配文件的正则
（2）返回一个函数，且有如下3个属性
function webpackContext(req) {return __webpack_require__(webpackContextResolve(req))};
resolve {Function} -接受一个参数request,request为匹配文件的相对路径,返回这个匹配文件相对于整个工程的相对路径
keys {Function} -返回匹配成功模块的名字组成的数组
id {String} -执行环境的id,返回的是一个字符串,主要用在module.hot.accept
```

### 2、vue实例与vue组件

1、组件是扩展的 Vue 构造器，“扩展”的含义是用一些“默认”属性、方法以及钩子函数来“定制” Vue 构造器，其语法自然就和 Vue 实例化的语法类似。

2、模板中的<MyComponent...>是实例化组件的一种方法（另一种方法是 render 函数中使用 createElement 创建），实例化的组件就是一个 Vue 实例。

```
//main.js根实例
import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({//这里就是一个vue实例
  el: '#app',//el挂载点，根实例特有
  router,   //路由，根实例特有
  components: { App },
  template: '<App/>',//此处引根组件
})

//app.vue单文件组件
<template>
  <div id="app">
      <div class="welcome">welcome! {{name}}, you are {{age}} years old</div>
  </div>
</template>
<script>
export default {  //输出为对象
  name: 'App',  //组件名字
  data:function(){ //data为函数
    return {
      name:'wangyue',
      age:'25'
    }
  },
  }
</script>
<style>
  .welcome{
    font-size: 32px;
    color: blueviolet;
  }
</style>
```

### 3、prop数据传递


* 数据双向绑定：.sync事件，update:myPropName模式触发更新

```
子组件：this.$emit('update:title', newTitle)
父组件：
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
<text-document v-bind:title.sync="doc.title"></text-document>
```

### 4、组件间通信

#### 1、props和$emit

props：父组件单向数据流向子组件

$emit：子组件通过事件流向父组件

#### 2、.sync 修饰符

数据双向绑定，语法糖

```
<!-- 传递数据：title -->
父组件：
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event">
</text-document>
<text-document v-bind:title.sync="doc.title"></text-document>
子组件：通过update事件，传递数据
this.$emit('update:title', newTitle)
```

## 五、响应式原理

###  1、核心api

* 通过Object.defineProperty将属性转换为getter/setter

* 收集依赖

  * 每个组件实例对应⼀个watcher实例 

  * 在组件渲染过程中，把“touch”过的数据记录为依赖(触发getter -> 将当前watcher实例收集到属性对应的dep中) 

* 触发更新
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

### 2、注意事项

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

