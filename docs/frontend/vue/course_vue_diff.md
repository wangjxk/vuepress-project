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
* 树的比较使用该模型，进行替换、插入、删除操作变为一致，具体进行操作时需要遍历树，即 diff 还要做一次 patch，（找到差异后还要计算最小转换方式）这个时候还要在之前遍历的基础上再遍历一次，所以累计起来就是 O(n^3) 了

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

 * 判断哪些可以复用，有 key 只需要从映射中康康 3, 1在不在，没有 key 的话，可能就执行替换了，肯定比「复用」「移动」开销大了
 * 删除了哪一个？新增了哪一个？有 key 的话是不是很好判断嘛，之前的映射没有的 key，比如变成 [3, 1, 4]那这个 4 很容易判断出应该是新建的，删除也同理但是没有 key 的话就麻烦一些了









