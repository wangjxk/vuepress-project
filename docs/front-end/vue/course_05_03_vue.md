# VUE框架

> 参考资料：
>
> 1. [VUE官网教程](https://cn.vuejs.org/v2/guide/index.html)
> 2. [VUE官网API详解](https://cn.vuejs.org/v2/api/)
> 3. [VUE_0.10版本](https://github.com/vuejs/vue/tree/0.10)
> 4. [VUE总结](/front-end/vue/)

## 一、简介

vue 是一个响应式的前端视图层框架。

* 响应式：编写模版代码时，仅需要关注数据的变化即可，数据变化 UI 即可随之变化 

* 视图层：类似前段模板、只是UI层面的框架
* 框架：framework框架（整个应用程序设计），library库（工具函数集合）

## 二、引入

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

## 三、基础指令

* v-text：等同于直接在文本处使用{{xx}}

  ```js
  <span v-text="msg"></span>
  <!-- 和下面的一样 -->
  {{msg}}
  ```

* v-html：将最终值的结果渲染为html

* v-show

* v-if/v-else/v-else-if

* v-for

  ```js
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, name, index) in object"></div>
  ```

* v-on：简写@

* v-bind：简写:

* v-model：表单的双向绑定

* v-slot

* v-pre

* v-cloak

* v-once

## 四、生命周期

* beforeCreate
* created
* beforeMount
* mounted
* beforeUpdate
* updated
* activated：被 keep-alive 缓存的组件激活时调用
* deactivated：被 keep-alive 缓存的组件停用时调用。
* beforeDestroy
* destroyed
* errorCaptured：当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。