# vue状态管理

> 参考资料：
>
> 1、[vuex教程](https://bigdata.bihell.com/language/javascript/vue/vuex.html#%E4%B8%80%E3%80%81vuex%E5%88%B0%E5%BA%95%E6%98%AF%E4%B8%AA%E4%BB%80%E4%B9%88%E9%AC%BC)
>
> 2、[vuex官方资料](https://vuex.vuejs.org/zh/guide/)
>
> 3、[vue-vuex 最佳实践](https://github.com/weipxiu/Vue-vuex)
>
> 4、[vue源代码地址](https://github.com/vuejs/vuex/tree/dev/src)
>
> 5、[学习 vuex 源码整体架构，打造属于自己的状态管理库](https://juejin.cn/post/6844904001192853511#heading-12)
>
> 6、[开发 vue 插件](https://cn.vuejs.org/v2/guide/plugins.html)

## 1、vuex简介

### 1、定义

在vue项⽬中，每个组件的数据都有其独⽴的作⽤域。当组件间需要跨层级或者同层之间频繁传递的时候，数据交互就会⾮常繁琐。vuex的主要作⽤就是集中管理所有组件的数据和状态以及规范数据修改的⽅式。

官方解释：Vuex 是⼀个专为 Vue.js 应⽤程序开发的状态管理模式。它采⽤集中式存储管理应⽤的所有组件的状态，并以相应的规则保证状态以⼀种可预测的⽅式发⽣变化。

### 2、使用场景

⼀般来讲，是以项⽬中的数据交互复杂程度来决定的。具体包括以下场景：

* 项⽬组件间数据交互不频繁，组件数量较少：不使⽤状态管理

* 项⽬组件间数据交互频繁，但组件数量较少：使⽤eventBus或者vue store解决

* 项⽬组件间数据交互频繁，组件数量较多：vuex解决

### 3、核心原理

 `Flux` 架构主要思想是**应用的状态被集中存放到一个仓库中，但是仓库中的状态不能被直接修改**，**必须通过特定的方式**才能更新状态。

vuex基于flux思想为vue框架定制，区分同步和异步，定义两种行为，`Actions` 用来处理异步状态变更（内部还是调用 `Mutations`），`Mutations` 处理同步的状态变更，整个链路应该是一个闭环，单向的，完美契合 `FLUX` 的思想

「页面 dispatch/commit」-> 「actions/mutations」-> 「状态变更」-> 「页面更新」-> 「页面 dispatch/commit」...

![vuex](https://i1.wp.com/user-gold-cdn.xitu.io/2020/4/2/171396e1d42df794?w=701&h=551&f=png&s=30808)

## 2、vuex五大核心

1. vue使用单一状态树，单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

* 用一个对象（主干）就包含了全部的（分支）应用层级状态。
* 每个应用将仅仅包含一个 store 实例对象（主干）。

2. 每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的**状态 (state)**。Vuex 和单纯的全局对象有以下两点不同：

* Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

* 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地**提交 (commit) mutation**。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 1、State

当前应⽤状态，可以理解为组件的data⽅法返回的Object

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  }
})

new Vue({
  store, //把store的实例注入所有的子组件，this.$store可访问
  render: h => h(App)
}).$mount('#app')
```

### 2、Getters

Getter为state的计算属性，当需要重复对某个数据进⾏某种操作的时候可以封装在getter⾥⾯，当state中的数据改变了以后对应的getter也会相应的改变。

```js
const store = new Vuex.Store({
  state: {
    date: new Date()
  },
  getters: {
    // Getter 接受 state 作为其第一个参数
    weekDate: (state) => {
      return moment(state.date).format('dddd'); 
    },
    //Getter 还也可以接收 getters 作为第二个参数
    dateLength: (state, getters) => {
    	return getters.weekDate.length;
  	},
    //Getter本身为一属性，传参需返回一个函数
    weekDate: (state) => (fm) => {
    	return moment(state.date).format(fm ? fm : 'dddd'); 
  	}
  }
})

//属性访问
console.log(store.getters.weekDate)
console.log(store.getters.dateLength)
//方法访问，传参
console.log(store.getters.weekDate('MM Do YY'))
```

### 3、Mutations

* 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，必须是同步函数。

* Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type) 和 一个 回调函数 (handler)。

* 回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数，第二个参数为载荷（payload）对象。

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    // 事件类型 type 为 increment
    increment (state) {
      state.count++
    },
    // 添加第二个参数
    increment1 (state, payload) {
    	state.count += payload.amount
    }
  }
})

//参数调用
store.commit('increment')

// 1、把载荷和type分开提交
store.commit('increment1', {
  amount: 10
})

// 2、整个对象都作为载荷传给 mutation 函数
store.commit({
  type: 'increment1',
  amount: 10
})

//----- 修改参数并使用常量，必须遵循vue规则，使用set或者对象解构 -------
// mutation-types.js
export const ADD_MUTATION = 'SOME_MUTATION'
// store.js
import Vuex from 'vuex'
import { ADD_MUTATION } from './mutation-types'
const store = new Vuex.Store({
  state: {
    student: {
      name: '小明',
      sex: '女'
    }
  },
  mutations: {
    // 使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [ADD_MUTATION] (state) {
      Vue.set(state.student, 'age', 18) //添加age属性
      // state.student = { ...state.student, age: 18 }
    }
  }
})
//使用
import {ADD_PROPERTY} from '@/store/mutation-types'
this.$store.commit(ADD_PROPERTY)
```

### 4、Actions

Action 类似于 mutation，不同在于：

* Action 提交的是 mutation，而不是直接变更状态。

* Action 可以包含任意异步操作
* Action 函数接受一个 `context` 参数，它与 store 实例有着相同的方法和属性，可以使用 `context.commit` 来提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    },
    //使用解构简化
    increment ({ commit }) {
    	commit('increment')
  	}
  }
})

//分发actions
store.dispatch('increment')
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})
// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

### 5、Modules

modules的主要功能是为了防⽌state过于庞⼤和冗余，所以对其进⾏模块化分隔

* 模块内部的 state 是局部的，只属于模块本身所有，所以外部必须通过对应的模块名进行访问
* 模块内部的 action、mutation 和 getter 默认可是注册在**全局命名空间**的，通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

```js
//无命名空间
<script>
    import {mapState, mapMutations} from 'vuex';
    export default {
        computed: { //state不同
            ...mapState({
                name: state => (state.moduleA.text + '和' + state.moduleB.text)
            }),
        },
        methods: { //mutation全局
            ...mapMutations(['setText']),
            modifyNameAction() {
                this.setText();
            }
        },
    }
</script>

//使用命名空间
export default {
    namespaced: true,
    // ...
}
<script>
    import {mapActions, mapGetters} from 'vuex';
    export default {
        computed: {
            ...mapState({
                name: state => (state.moduleA.text + '和' + state.moduleB.text)
            }),
            ...mapGetters({
                name: 'moduleA/detail'
            }),
        },
        methods: {
            ...mapActions({
                call: 'moduleA/callAction'
            }),
            /* 另外写法 */
            ...mapActions('moduleA', {
                call: 'callAction'
            }),
            ...mapActions('moduleA', ['callAction']),
            modifyNameAction() {
                this.call();
            }
        },
    }
</script>
```

## 3、辅助函数

### 1、mapStates

* 使用 `mapState` 辅助函数帮助我们生成计算属性，入参为对象

* 当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      a: state => state.a,

      // 传字符串参数 'b'
      // 等同于 `state => state.b`
      bAlias: 'b',

      // 为了能够使用 `this` 获取局部状态
      // 必须使用常规函数
      cInfo (state) {
        return state.c + this.info
      }
  	}),
    ...mapState([
      // 映射 this.a 为 store.state.a
      'a',
      'b',
      'c'
    ])
}
```

### 2、mapGetters

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ]),
    ...mapGetters({
      doneCount: 'doneTodosCount'
    })
  }
}
```

### 3、mapMutaions

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      // 将 `this.increment()` 映射为 
      // `this.$store.commit('increment')`
      'increment', 
      // `mapMutations` 也支持载荷：
      // 将 `this.incrementBy(amount)` 映射为 
      // `this.$store.commit('incrementBy', amount)`
      'incrementBy' 
    ]),
    ...mapMutations({
      // 将 `this.add()` 映射为 
      // `this.$store.commit('increment')`
      add: 'increment' 
    })
  }
}
```

### 4、mapActions

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      // 将 `this.increment()` 映射为 
      // `this.$store. dispatch('increment')`
      'increment', 
      // `mapActions` 也支持载荷：
      // 将 `this.incrementBy(amount)` 映射为 
      // `this.$store. dispatch('incrementBy', amount)`
      'incrementBy' 
    ]),
    ...mapActions({
      // 将 `this.add()` 映射为 
      // `this.$store. dispatch('increment')`
      add: 'increment' 
    })
  }
}
```

## 4、源码解析

### 1、思路

* flux思想
  * 问题：在开发中面临最多的场景是状态重复但是不集中，在不同的组件中依赖了同样的状态，重复就会导致不对等的风险。
  * 思想：基于 `FLUX` 的思想，我们设计的状态管理将是中心化的工具，也就是集中式存储管理应用的所有组件的状态，将所有的状态放在一个全局的 `Tree` 结构中，集中放在一起的好处是可以有效避免重复的问题，也更好的管理，将状态和视图层解耦。
  * 解决：使用全局的store对象管理状态和数据，单一状态树

* 状态流转
  * 单一流转
  * 同步和异步分层：mutations负责同步状态管理、actions负责异步事件（内部通过mutations改变状态）

* 与vue集成
  * 通过插件将 `vue` 集成在一起，通过 `mixin` 将 `$store` 这样的快速访问 `store` 的快捷属性注入到每一个 `vue` 实例中
* 响应式
  * 利用vue的data响应式实现
* 扩展
  * 辅助函数
  * 模块化
  * 插件支持

### 2、源码解析

#### 1、store注册

```js
/**
* store.js - store 注册
*/
let Vue

// vue 插件必须要这个 install 函数
export function install(_Vue) {
  Vue = _Vue // 拿到 Vue 的构造器，存起来
  Vue.mixin({ beforeCreate: vuexInit })
  
  function vuexInit () {
    const options = this.$options //创建对象入参
    // 这样就可以通过 this.$store 访问到 Vuex 实例，拿到 store 了
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

#### 2、store的响应式

```js
/**
* store.js - 实现响应式
*/
export class Store {
  constructor(options = {}) {
    resetStoreVM(this, options.state)
  }
  
  get state () {
    return this._vm._data.$$state
  }
}

function resetStoreVM(store, state) {
  // 因为 vue 实例的 data 是响应式的，正好利用这一点，就可以实现 state 的响应式
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}
```

#### 3、衍生数据

```js
/**
* store.js - 衍生数据（getters）
*/
export class Store {
  constructor(options = {}) {
    
    const state = options.state
    
    resetStoreVM(this, state)
    
    // 我们用 getters 来收集衍生数据 computed
    this.getters = {}
    
    // 简单处理一下，衍生不就是计算一下嘛，传人 state
    _.forEach(this.getters, (name, getterFn) => {
      Object.defineProperty(this.getters, name, {
        get: () => getterFn(this.state)
      })
    })
  }
  
  get state () {
    return this._vm._data.$$state
  }
}

function resetStoreVM(store, state) {
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}
```

#### 4、Actions/Mutations

```js
/**
* store.js - Actions/Mutations 行为改变数据
*/
export class Store {
  constructor(options = {}) {
    
    const state = options.state
    
    resetStoreVM(this, state)
    
    this.getters = {}
    
    _.forEach(options.getters, (name, getterFn) => {
      Object.defineProperty(this.getters, name, {
        get: () => getterFn(this.state)
      })
    })
    
    // 定义的行为，分别对应异步和同步行为处理
    this.actions = {}
    this.mutations = {}
    
    _.forEach(options.mutations, (name, mutation) => {
      this.mutations[name] = payload => {
        // 最终执行的就是 this._vm_data.$$state.xxx = xxx 这种操作
        mutation(this.state, payload)
      }
    })
    
    _.forEach(options.actions, (name, action) => {
      this.actions[name] = payload => {
        // action 专注于处理异步，这里传入 this，这样就可以在异步里面通过 commit 触发 mutation 同步数据变化了
        action(this, payload)
      }
    })
  }
  
  // 触发 mutation 的方式固定是 commit
  commit(type, payload) {
    this.mutations[type](payload)
  }
  
  // 触发 action 的方式固定是 dispatch
  dispatch(type, payload) {
    this.actions[type](payload)
  }
  
  get state () {
    return this._vm._data.$$state
  }
}

function resetStoreVM(store, state) {
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}
```

#### 5、分形，拆分出多个 Module

```js
// module 可以对状态模型进行分层，每个 module 又含有自己的 state、getters、actions 等

// 定义一个 module 基类
class Module {
	constructor(rawModule) {
    this.state = rawModule || {}
    this._rawModule = rawModule
    this._children = {}
  }
  
  getChild (key) {
    return this._children[key]
  }
  
   addChild (key, module) {
    this._children[key] = module
  }
}

// module-collection.js 把 module 收集起来
class ModuleCollection {
  constructor(options = {}) {
    this.register([], options)
  }
  
  register(path, rawModule) {
    const newModule = new Module(rawModule)
    if (path.length === 0 ) {
      // 如果是根模块 将这个模块挂在到根实例上
      this.root = newModule
    }
    else {
      const parent = path.slice(0, -1).reduce((module, key) => {
        return module.getChild(key)
      }, this.root)
      
      parent.addChild(path[path.length - 1], newModule)
    }
    
    // 如果有 modules，开始递归注册一波
    if (rawModule.modules) {
      _.forEach(rawModule.modules, (key, rawChildModule) => {
        this.register(path.concat(key), rawChildModule)
      })
    }
  }
}

// store.js 中
export class Store {
  constructor(options = {}) {
    // 其余代码...
    
    // 所有的 modules 注册进来
    this._modules = new ModuleCollection(options)
    
    // 但是这些 modules 中的 actions, mutations, getters 都没有注册，所以我们原来的方法要重新写一下
    // 递归的去注册一下就行了，这里抽离一个方法出来实现
    installModule(this, this.state, [], this._modules.root);
  }
}

function installModule(store, state, path, root) {
  // getters
  const getters = root._rawModule.getters
  if (getters) {
    _.forEach(getters, (name, getterFn) => {
      Object.defineProperty(store.getters, name, {
        get: () => getterFn(root.state)
      })
    })
  }
  
  // mutations
  const mutations = root._rawModule.mutations
  if (mutations) {
    _.forEach(mutations, (name, mutation) => {
      let _mutations = store.mutations[name] || (store.mutations[name] = [])
      _mutations.push(payload => {
        mutation(root.state, payload)
      })
      
      store.mutations[name] = _mutations
    })
  }
  
  // actions
  const actions = root._rawModule.actions
  if (actions) {
    _.forEach(actions, (name, action) => {
      let _actions = store.actions[name] || (store.actions[name] = [])
      _actions.push(payload => {
        action(store, payload)
      })
      
      store.actions[name] = _actions
    })
  }
  
  // 递归
  _.forEach(root._children, (name, childModule) => {
    installModule(this, this.state, path.concat(name), childModule)
  })
}
```

#### 6、插件机制

```js
(options.plugins || []).forEach(plugin => plugin(this))
```

