# Vue原理-diff算法

> 参考资料
>
>  * [浏览器工作原理揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
>  * [像素的一生](https://www.bilibili.com/video/av35265997/)
>  * [Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance)
>  * [inferno]( https://github.com/infernojs/inferno)
>  * [启发式算法](https://www.zhihu.com/topic/19864220/hot)
>  * [最长上升子序列算法](https://en.wikipedia.org/wiki/Longest_increasing_subsequence)
>  * [diff算法O(n^3)](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)

## 1、diff算法简介

* 上古时期：o(m^3n^3)
* 2011年：o(n^3)，n为节点总数
* react提出近代同层比较算法：o(n)

解析：时间复杂度：最好时间复杂度、最坏时间复杂度、平均时间复杂度、均摊时间复杂度

Eg：遍历列表（长度n）

* 最好时间复杂度：1（第一个就找到）
* 最坏时间复杂度：n（最后一个元素找到）
* 平均时间复杂度：总操作数 / 总情况数  = 1 + 2 + 3 ... + n / (n + 1(not found)) = n

* 均摊时间复杂度：最坏时间复杂度均摊 = n / n  = 1

## 2、为什么diff

* 在数据模型和视图模型中使用虚拟dom，使用diff算法避免直接操作dom提升性能，数据模型 -> virtual dom -> 视图（dom)
* virtual dom可使用DSL(领域特定语言)： {type: 'div', props: {}, ...} -> DOM 结构，用对象表示dom
* 虚拟dom渲染不一定比原生dom渲染快，本质是原生的dom渲染，前端框架svelte未使用vm及diff
* 数据和视图隔离：f(state) -> view，通过操作状态实现视图更新

## 3、为什么o(n^3)

* 字符串的比较，通过「替换」「插入」「删除」，执行这三种操作后使两个字符串一致的最小操作数，就是最短编辑距离。经典解决方法：Levenshtein（莱文斯坦）算法，复杂度o(n^2)
* 树的比较使用该模型，进行替换、插入、删除操作变为一致，具体进行操作时需要遍历树，即 diff 还要做一次 patch（找到差异后还要计算最小转换方式）这个时候还要在之前遍历的基础上再遍历一次，所以累计起来就是 O(n^3) 了

## 4、为什么o(n)

react和vue的diff算法，严格意义上不是o(n)，复杂度其实是 O(nm)，这里只是有一些技巧可以优化成 O(n)

```js
 /*
 *   a       a
 *  | |     | |
 *  c b     c d
 * 只做同层比较：
 * [a, a] 相同，不处理
 * [c, c] 相同，不处理
 * [b, d] 不相同，替换
 */
 const arr = [a, b, c] 
 const newArr = [b, d, e, f]
 /* 比较过程
 * [a, b]
 * [b, d]
 * [c, e]
 * [null, f]
 */
//技巧，减少一次for循环，变为O(n)
for (let i = 0, len = oldNodes.length; i < len; i++) {
  compare(oldNodes[i], newNodes[i])
}
//react写法：复杂度o(m*n)，m是父节点、n是子节点
for (let i = 0, len = oldNodes.length; i < len; i++) {
   if (oldNodes[i].type !== newNodes[i].type) {
    replace()
   // 如果没有这一层，假设 type 全不相同，那么就是 O(n)，最坏复杂度 O(nm)
   }else if (oldNodes[i].children && oldNodes[i].children.length) { 
	 }
}
//vue，使用inferno算法（最长上升子序列），复杂度能到 O(mlogn)
```

## 5、how O(n)

react 是怎么设计将复杂度砍下来呢？

其实就是在算法复杂度、虚拟 dom 渲染机制、性能中找了一个平衡，react 采用了启发式的算法，做了如下最优假设：

 * 如果节点类型相同，那么以该节点为根节点的 tree 结构，大概率是相同的，所以如果类型不同，可以直接「删除」原节点，「插入」新节点
 * 跨层级移动子 tree 结构的情况比较少见，或者可以培养用户使用习惯来规避这种情况，遇到这种情况同样是采用先「删除」再「插入」的方式，这样就避免了跨层级移动
 * 同一层级的子元素，可以通过 key 来缓存实例，然后根据算法采取「插入」「删除」「移动」的操作，尽量复用，减少性能开销
 * 完全相同的节点，其虚拟 dom 也是完全一致的

基于这些假设，可以将 diff 抽象成只需要做同层比较的算法，这样复杂度就直线降低了

## 6、同级元素的key

### 1、为什么添加key

官方文档就有说明：https://cn.vuejs.org/v2/api/#key
 * key 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes：如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

举个例子，假设原来有 [1, 2, 3] 三个子节点渲染了，假设我们这么操作了一波，将顺序打乱变成 [3, 1, 2]，并且删除了最后一个，变成 [3, 1]。那，最优的 diff 思路应该是复用 3, 1组件，移动一下位置，去掉 2 组件，这样整体是开销最小的，如果有 key 的话，这波操作水到渠成，如果没有 key 的话，那么就要多一些操作了:

 * 判断哪些可以复用，有 key 只需要从映射中看看 3, 1在不在，没有 key 的话，可能就执行替换了，肯定比「复用」「移动」开销大了
 * 删除了哪一个？新增了哪一个？有 key 的话是不是很好判断嘛，之前的映射没有的 key，比如变成 [3, 1, 4]那这个 4 很容易判断出应该是新建的，删除也同理但是没有 key 的话就麻烦一些了

### 2、key的使用

* 不使用随机数：不利于diff算法，无意义，需全部重绘
* 不使用数组下标
  * vue中使用数组下标会导致删除异常
  * react中会全部列表重绘

```js
//1、vue
//执行结果 1，2，3 -> 1, 2
//解析：vue中key值【0，1，2】-> [0, 1]，比较时认为删除了第三个，实际需删除第一个
<ul>
  <li v-for="(value, index) in arr" :key="index">
    <test/>
  </li>
</ul>
data(){
  return {
    arr: [1, 2, 3]
  }
},
methods: {
   handleDelete(){
     this.arr.splice(0, 1)
   }
}

//2、react中会出现警告，会全部重写渲染，现象正常，删除首个
//[0('a'), 1, 2, 3, 4] -> [0('b'), 1, 2, 3]
/*
 * function sameVnode (a, b) {
 *  return (
 *    a.key === b.key &&  // key值
 *    a.tag === b.tag &&  // 标签名
 *    a.isComment === b.isComment &&  // 是否为注释节点
 *    // 是否都定义了data，data包含一些具体信息，例如onclick , style
 *   isDef(a.data) === isDef(b.data) &&  
 *    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
 *  )
 * }
 */
```

## 7、虚拟dom的实现

### 1、什么是虚拟dom

虚拟dom为嵌套结构的对象树，与dom结构类似

```js
{
  type: 'div',
  props: {
    children: [ //子节点  
    ]
  },
  el: xxx
}
```

### 2、怎么创建虚拟dom

h、createElement：function h(type, props) { return { type, props } }

```js
//h.js
export const NODE_FLAG = {
  //使用位运算进行元素类型判断：元素1，text2
  //type & NODE_FLAG.EL = true 元素节点
  //1 & 1 = 1为true，2 & 1 = 0 为false
  //1 & 2 = 0为false，2 & 2 = 2 为true
  EL: 1, // 元素 element
  TEXT: 1 << 1
}

const  createText = (text) => {
  return {
    type: '',
    props: {
      nodeValue: text + ''
    },
    $$: { flag: NODE_FLAG.TEXT }
  }
}

const createVnode = (type, props, key, $$) => {
  // step1. 定义虚拟 DOM 的数据结构
  return {
    type,   // div / CompoentA / ''(文本)
    props,  // children放置在props中
    key,
    $$      //存在内部使用属性
  }
}

const normalize = (children = []) => {
  children.map(child => {
    typeof child === 'string' ? createText(child) : child
  })
}

/**
 * step2. 定义生成虚拟DOM对象的方法
 * h('div', { className: 'padding20'}, 'hello world!')
 * const nextVNode = h(
      'ul',
      {
        style: {
          width: '100px',
          height: '100px',
          backgroundColor: 'green'
        }
      },
      [
        h('li', { key: 'li-a' }, 'this is li a'),
        h('li', { key: 'li-b' }, 'this is li b'),
        h('li', { key: 'li-c' }, 'this is li c'),
        h('li', { key: 'li-d' }, 'this is li d'),
      ]
    )
 */
export const h = (type, props, ...kids) => {
  props = props || {}
  let key = props.key || void 0
  //支持props.children以及直接children属性情况
  kids = normalize(props.children || kids)
  
  //props.children三种情况
  //1、为空：null void 0
  //2、单个对象：{ type: 'div', ... }
  //3、多个子对象（数组）：[{xx}, {xxx}]
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const $$ = {}
  $$.el = null
  $$.flag = type === '' ? NODE_FLAG.TEXT : NODE_FLAG.EL

  return createVnode(type, props, key, $$)
}
```

### 3、如何使用虚拟dom

编写模版，模版template、jsx通过工具转换为createELement、h函数

```js
 /*
 * JSX:
 * <div>
 *   <ul className='padding-20'>
 *     <li key='li-01'>this is li 01</li>
 *   </ul>
 * </div>
 * 
 * 经过一些工具转一下：
 * createElement('div', {
 *   children: [
 *     createElement('ul', { className: 'padding-20' },
 *        createElement('li', { key: 'li-01'}, 'this is li 01'))
 *   ]
 * })
 */
```

### 4、虚拟dom的渲染

使用dom相关函数：createElement、insert、insertbefore等dom方法进行操作

```js
// f(vnode) -> view
f(vnode) {
  document.createElement();
  ....
  parent.insert()
  . insertBefore
}

export const render = (vnode, parent) => {  }
<div id='app'></div>


//render.js
/*
 * step3. 渲染 f(vnode, parent)
 */
export const render = (vnode, parent) => {
  let prev = parent._vnode

  if (!prev) { //首次创建
    mount(vnode, parent)
    parent._vnode = vnode
  }
  else {
    if (vnode) { // 新旧两个 vnodeTree 都存在，patch
      patch(prev, vnode, parent)
      parent._vnode = vnode
    }
    else { //旧存在、新不存在直接删除
      parent.removeChild(prev.$$.el)
    }
  }
}

//mount.js
export const mount = (vnode, parent, refNode) => {
  if (!parent) throw new Error('你可能忘了点啥')
  const $$ = vnode.$$
  //文本节点
  if ($$.flag & NODE_FLAG.TEXT) {
    const el = document.createTextNode(vnode.props.nodeValue)
    vnode.el = el //挂载真实dom节点
    parent.appendChild(el)
  }//元素节点
  else if ($$.flag & NODE_FLAG.EL) {
    const { type, props } = vnode
    // 先不考虑 type 是一个组件的情况 ⚠️
    const el = document.createElement(type)
    vnode.el = el

    const { children, ...rest } = props
    if (Object.keys(rest).length) {
      for (let key of Object.keys(rest)) {
        patchProps(key, null, rest[key], el)//patch属性，前属性为null
      }
    }
    if (children) {
      const __children = Array.isArray(children) ? children : [children]
      for (let child of __children) {
        mount(child, el) //递归执行
      }
    }
    refNode ? parent.insertBefore(el, refNode) : parent.appendChild(el)
  }
}

//patchProps.js，属性值、前属性对象、后属性对象、dom节点
export const patchProps = (key, prev, next, el) => {
  // style
  if (key === 'style') {
    // { style: { margin: '0px', padding: '10px' }}
    if (next)
      for (let k in next) {
        el.style[k] = next[k]
      }
    // { style: { padding: '0px', color: 'red' } }
    if (prev)
      for (let k in prev) {
        if (!next.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
  }
  // class
  else if (key === 'className') {
    if (!el.classList.contains(next)) {
      el.classList.add(next)
    }
  }
  // events
  else if (key[0] === 'o' && key[1] === 'n') {
    prev && el.removeEventListener(key.slice(2).toLowerCase(), prev)
    next && el.addEventListener(key.slice(2).toLowerCase(), next)
  }
  else if (/\[A-Z]|^(?:value|checked|selected|muted)$/.test(key)) {
    el[key] = next
  }
  else {
    el.setAttribute && el.setAttribute(key, next)
  }
}
```

### 5、diff 相关(patch)

f(oldVnodeTree, newVnodeTree, parent) -> 调度 -> view

```js
//新老tree一个对象情况
//prev旧虚拟dom树、next新虚拟dom树、parent挂载节点
export const patch = (prev, next, parent) => {
  // type: 'div' -> type: 'p'，type不同直接删除新增
  if (prev.type !== next.type) {
    parent.removeChild(prev.el)
    mount(next, parent)
    return
  }

  // type 一样，diff props（先不看 children）
  const { props: { children: prevChildren, ...prevProps } } = prev
  const { props: { children: nextChildren, ...nextProps } } = next
  // patchProps
  const el = (next.el = prev.el)
  for (let key of Object.keys(nextProps)) {
    let prev = prevProps[key], next = nextProps[key]
      patchProps(key, prev, next, el)
  }
  for (let key of Object.keys(prevProps)) {
    if (!nextProps.hasOwnProperty(key)) patchProps(key, prevProps[key], null, el)
  }
  // patch children
  patchChildren(
    prevChildren,
    nextChildren,
    el
  )
}
const patchChildren = (prev, next, parent) => {
  // diff 比较耗性能，可以前置做一些处理，提升效率
  if (!prev) {
    if (!next) {//新旧tree不存在
      // do nothing
    }
    else {//旧不存在，新存在
      next = Array.isArray(next) ? next : [next]
      for (const c of next) {
        mount(c, parent)
      }
    }
  }
  // 只有一个 children，直接diff处理
  else if (prev && !Array.isArray(prev)) {
    //新tree不存在，删除
    if (!next) parent.removeChild(prev.el)
    //新tree一个对象，老tree一个对象，直接patch
    else if (next && !Array.isArray(next)) {
      patch(prev, next, parent)
    }
    else {//旧tree一个对象，新tree多个对象，删除直接挂载
      parent.removeChild(prev.el)
      for (const c of next) {
        mount(c, parent)
      } 
    }
  }
  //新老tree都多个对象，使用diff算法
  else odiff(prev, next, parent)
}
```

#### 1、react的diff算法

```js
export const diff = (prev, next, parent) => {
  let prevMap = {}
  let nextMap = {}

  // old tree children
  for (let i = 0; i < prev.length; i++) {
    let { key = i + '' } = prev[i]
    prevMap[key] = i
  }

  let lastIndex = 0
  for (let n = 0; n < next.length; n++) {
    let { key = n + '' } = next[n]
    let j = prevMap[key]
    let nextChild = next[n]
    nextMap[key] = n
    
    // {b: 0, a: 1}
    // 原children    新 children
    // [b, a]   ->   [c, d, a]  ::[c, b, a] 👉 c
    // [b, a]   ->   [c, d, a]  ::[c, d, b, a] 👉 d
    if (j == null) {
      let refNode = n === 0 ? prev[0].el : next[n - 1].el.nextSibling
      mount(nextChild, parent, refNode)
    }
    else {
      // [b, a] -> [c, d, a]  ::[c, d, a, b] 👉 a
      patch(prev[j], nextChild, parent)
      if (j < lastIndex) {
        let refNode = next[n - 1].el.nextSibling;
        parent.insertBefore(nextChild.el, refNode)
      }
      else {
        lastIndex = j
      }
    }
  }

  // [b, a] -> [c, d, a]  ::[c, d, a] 👉 b
  for (let i = 0; i < prev.length; i++) {
    let { key = '' + i } = prev[i]
    if (!nextMap.hasOwnProperty(key)) parent.removeChild(prev[i].el)
  }
}
```

#### 2、vue的diff算法

* 双指针前置处理
* 最长上升子序列最小化移动

```js
export const odiff = (prevChildren, nextChildren, parent) => {
  // 前指针
  let j = 0

  // 后指针
  let prevEnd = prevChildren.length - 1
  let nextEnd = nextChildren.length - 1

  let prevNode = prevChildren[j]
  let nextNode = nextChildren[j]

  // [a, b, c, d]   [a, b, c, d, e]
  //  j        👆    j           👆
  outer: {
    while(prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      j++
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[j]
      nextNode = nextChildren[j]
    }

    prevNode = prevChildren[prevEnd]
    nextNode = nextChildren[nextEnd]

    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      prevEnd--
      nextEnd--
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[prevEnd]
      nextNode = nextChildren[nextEnd]
    }
  }

  // [a, b, c, h, d]   [a, b, c, f, m, k, h, d]
  //        👆 j                 j     👆
  if (j > prevEnd && j <= nextEnd) {
    let nextPos = nextEnd + 1
    let refNode = nextPos >= nextChildren.length
      ? null
      : nextChildren[nextPos].el
    while (j <= nextEnd) {
      mount(nextChildren[j++], parent, refNode)
    }
    return
  }

  // [a, b, c, f, m, k, h, d]  [a, b, c, h, d]   
  //           j     👆               👆  j
  else if (j > nextEnd) {
    while (j <= prevEnd) {
      parent.removeChild(prevChildren[j++].el)
    }
    return
  }

  // [a, b, c, d]  [c, a, d, b]
  //  j        👆   j        👆
  let nextStart = j,
    prevStart = j,
    nextLeft = nextEnd - j + 1,
    nextIndexMap = {},
    source = new Array(nextLeft).fill(-1),
    patched = 0,
    lastIndex = 0,
    move = false

  // { 'c': 0, 'a': 1, 'd': 2, 'b': 3 }
  for (let i = nextStart; i <= nextEnd; i++) {
    let key = nextChildren[i].key || i
    nextIndexMap[key] = i
  }

  for (let i = prevStart; i <= prevEnd; i++) {
    let prevChild = prevChildren[i],
      prevKey = prevChild.key || i,
      nextIndex = nextIndexMap[prevKey]
    if (patched >= nextLeft || nextIndex === undefined) {
      parent.removeChild(prevChild.el)
      continue
    }
    patched++
    let nextChild = nextChildren[nextIndex]
    patch(prevChild, nextChild, parent)

    source[nextIndex - nextStart] = i

    if (nextIndex < lastIndex) {
      move = true
    } else {
      lastIndex = nextIndex
    }
  }

  if (move) {
    const seq = lis(source); // seq = [1, 3]
    let j = seq.length - 1;
    for (let i = nextLeft - 1; i >= 0; i--) {
      let pos = nextStart + i,
        nextPos = pos + 1,
        nextChild = nextChildren[pos],
        refNode = nextPos >= nextLeft ? null : nextChildren[nextPos].el
      // [4, 0, -1, 1]
      if (source[i] === -1) {
        mount(nextChild, parent, refNode)
      } else if (i !== seq[j]) {
        parent.insertBefore(nextChild.el, refNode)
      } else {
        j--
      }
    }
  } else {
    // no move
    for (let i = nextLeft - 1; i >= 0; i--) {
      if (source[i] === -1) {
        let pos = nextStart + i,
          nextPos = pos + 1,
          nextChild = nextChildren[pos],
          refNode = nextPos >= nextLeft ? null : nextChildren[nextPos].el
      
        mount(nextChild, parent, refNode)
      }
    }
  }
}

function lis(arr) {
  let len = arr.length,
    result = [],
    dp = new Array(len).fill(1);

  for (let i = 0; i < len; i++) {
    result.push([i])
  }

  for (let i = len - 1; i >= 0; i--) {
    let cur = arr[i], nextIndex = undefined
    if (cur === -1) continue

    for (let j = i + 1; j < len; j++) {
      let next = arr[j]
      if (cur < next) {
        let max = dp[j] + 1
        if (max > dp[i]) {
          nextIndex = j
          dp[i] = max
        }
      }
    }
    if (nextIndex !== undefined) result[i] = [...result[i], ...result[nextIndex]]
  }
  let index = dp.reduce((prev, cur, i, arr) => cur > arr[prev] ? i : prev, dp.length - 1)
  return result[index]
}
```

