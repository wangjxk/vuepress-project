# 图的存储和遍历

## 1、图的定义

* 无向图和有向图 ：根据有无方向分为有向图和无向图
  * 无向图由顶点和边组成
  * 有向图由顶点和弧构成，弧有弧尾和弧头之分，弧为弧尾指向弧头
  * 无向图顶点的边数叫度，有向图顶点分为入度和出度
* 稀疏图和稠密图：有很少条边或弧叫稀疏图，否则叫稠密图
* 网：图上的边或弧上带权则称为网

## 2、图的存储

### 1、邻接矩阵

* 一个一维数组存储图中的顶点

* 一个二维数组存储图中的边或弧信息

### 2、邻接表

* 图中的顶点用一个一维数组存储
* 图中的每个顶点的所有邻接点构成一个线性表

```javascript
/* 邻接表实现图，无向图 */
// 构造函数
function Graph() {
    this.vertices = []  //顶点集合
    this.edges = new Map() //边集合
}

// 添加顶点
Graph.prototype.addVertex = function (v) {
    this.vertices.push(v)
    this.edges.set(v, [])
}

// 添加边，无向图
Graph.prototype.addEdge = function (v, w) {
    let vEdge = this.edges.get(v)
    vEdge.push(w)
    let wEdge = this.edges.get(w)
    wEdge.push(v)
    this.edges.set(v, vEdge)
    this.edges.set(w, wEdge)
}

Graph.prototype.toString = function () {
    var s = ''
    for (var i=0; i<this.vertices.length; i++){
        s += this.vertices[i] + ' -> '
        var neighors = this.edges.get(this.vertices[i])
        for (var j=0; j<neighors.length; j++){
            s += neighors[j] + ' '
        }
        s += '\n'
    }
    return s
}

var graph = new Graph()
var vertices = [1,2,3,4,5]
for (var i=0; i<vertices.length; i++){
    graph.addVertex(vertices[i])
}
graph.addEdge(1, 4)
graph.addEdge(1, 3)
graph.addEdge(2, 3)
graph.addEdge(2, 5)

console.log(graph.toString())
```

### 3、十字链表

邻接表和逆邻接表结合，针对有向邻接表机构的优化

### 4、邻接多重表

无向图邻接表的优化

### 5、边集数组

* 顶点数组：一个一维数组存储顶点信息
* 边数组：一个一维数组存储边值信息，每个数组元素由一条边的起点下标、终点下标、权组成。

## 3、图的遍历

从图中某一顶点出发访问图中其余顶点，且使每个顶点仅被访问一次，这一过程叫图的遍历。

### 1、深度优先遍历（DFS）

* 遍历过程：从图中的一个节点开始追溯，直到最后一个节点，然后回溯，继续追溯下一条路径，直到到达所有的节点
* 实现：使用递归实现，或使用栈（先进后出）实现
* 用途产生拓扑排序表，解决最大路径问题

```javascript
/* dsf递归实现 */
Graph.prototype.dfs = function () {
    var marked = []
    let edges = this.edges
    for(var i=0; i< this.vertices.length; i++){
        if(!marked[this.vertices[i]]){
            dfsVisit(this.vertices[i])
        }
    }
    function dfsVisit(u) {
        marked[u] = true
        console.log(u)
        var neighors = edges.get(u)
        for (var i=0; i<neighors.length; i++){
            var w = neighors[i]
            if(!marked[w]){
                dfsVisit(w)
            }
        }
    }
}
```

### 2、广度优先遍历（BFS）

* 遍历过程：从根节点开始，沿着图的宽度遍历节点，如果所有节点均被访问过，则算法终止
* 实现：使用队列实现

```javascript
/* bsf队列实现 */
Graph.prototype.bfs_stack = function () {
    var queue = [], marked = []
    marked[v] = true
    queue.push(v)
    while (queue.length > 0) {
        var s = queue.shift()
        console.log(s)
        var neighors = this.edges.get(s)
        for(var i=0; i<neighors.length; i++){
            var w = neighors[i]
            if(!marked[w]){
                marked[w] = true
                queue.push(w)
            }
        }
    }
}
```

## 4、应用

### 1、赋值、深拷贝与浅拷贝

参考：[赋值、深拷贝、浅拷贝](https://github.com/yygmind/blog/issues/25)

#### 1、赋值

将某一数值或对象赋给某个变量的过程，分为下面 2 部分

- 基本数据类型：赋值，赋值之后两个变量互不影响
- 引用数据类型：赋**址**，两个变量具有相同的引用，指向同一个对象，相互之间有影响

```JavaScript
let a = "muyiy";
let b = a;
console.log(b); // muyiy
a = "change";
console.log(a); // change
console.log(b); // muyiy

let a = {
    name: "muyiy",
    book: {
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = a;
console.log(b);
// {
// 	name: "muyiy",
// 	book: {title: "You Don't Know JS", price: "45"}
// } 

a.name = "change";
a.book.price = "55";
console.log(a);
// {
// 	name: "change",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 

console.log(b);
// {
// 	name: "change",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 
```

#### 2、浅拷贝

##### 1、定义

创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

##### 2、使用场景

- `Object.assign()`

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

```javascript
let a = {
    name: "muyiy",
    book: {
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = Object.assign({}, a);
console.log(b);
// {
// 	name: "muyiy",
// 	book: {title: "You Don't Know JS", price: "45"}
// } 

a.name = "change";
a.book.price = "55";
console.log(a);
// {
// 	name: "change",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 

console.log(b);
// {
// 	name: "muyiy",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 
```

- 展开语法 `Spread`

```javascript
let a = {
    name: "muyiy",
    book: {
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = {...a};
console.log(b);
// {
// 	name: "muyiy",
// 	book: {title: "You Don't Know JS", price: "45"}
// } 

a.name = "change";
a.book.price = "55";
console.log(a);
// {
// 	name: "change",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 

console.log(b);
// {
// 	name: "muyiy",
// 	book: {title: "You Don't Know JS", price: "55"}
// } 
```

- `Array.prototype.slice()`

`slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin`和 `end`（不包括`end`）决定的原数组的**浅拷贝**。原始数组不会被改变，相应的还有`concat`等。

```javascript
let a = [0, "1", [2, 3]];
let b = a.slice(1);
console.log(b);
// ["1", [2, 3]]

a[1] = "99";
a[2][0] = 4;
console.log(a);
// [0, "99", [4, 3]]

console.log(b);
//  ["1", [4, 3]]
```

#### 3、深拷贝

##### 1、定义

深拷贝会拷贝所有的属性，并拷贝属性指向的动态分配的内存。当对象和它所引用的对象一起拷贝时即发生深拷贝。深拷贝相比于浅拷贝速度较慢并且花销较大。拷贝前后两个对象互不影响。

##### 2、使用场景

* JSON.parse(JSON.stringify(object))

  问题：

  1、会忽略 `undefined`

  2、会忽略 `symbol`

  3、不能序列化函数

  4、不能解决循环引用的对象

  5、不能正确处理`new Date()`

  6、不能处理正则

* jQuery.extend()
* lodash.cloneDeep()

##### 3、实现

* 参考资料

[深拷贝的终极探索（99%的人都不知道）](https://segmentfault.com/a/1190000016672263)

[面试题之如何实现一个深拷贝](https://github.com/yygmind/blog/issues/29)

* 用bfs和dfs实现

```javascript
// 深拷贝：Object, Array，其他的非基本类型都是浅拷贝
// 如果是对象/数组，返回一个空的对象/数组，
// 都不是的话直接返回原对象
// 判断返回的对象和原有对象是否相同就可以知道是否需要继续深拷贝
// 处理其他的数据类型的话就在这里加判断
function getEmpty(o){
	if(Object.prototype.toString.call(o) === '[object Object]'){
		return {};
	}
	if(Object.prototype.toString.call(o) === '[object Array]'){
		return [];
	}
	return o;
}

function deepCopyBFS(origin){
	let queue = [];
	let map = new Map(); // 记录出现过的对象，用于处理环

	let target = getEmpty(origin);
	if(target !== origin){
		queue.push([origin, target]);
		map.set(origin, target);
	}

	while(queue.length){
		let [ori, tar] = queue.shift();
		for(let key in ori){
			// 处理环状
			if(map.get(ori[key])){
				tar[key] = map.get(ori[key]);
				continue;
			}

			tar[key] = getEmpty(ori[key]);
			if(tar[key] !== ori[key]){
				queue.push([ori[key], tar[key]]);
				map.set(ori[key], tar[key]);
			}
		}
	}

	return target;
}

function deepCopyDFS(origin){
	let stack = [];
	let map = new Map(); // 记录出现过的对象，用于处理环

	let target = getEmpty(origin);
	if(target !== origin){
		stack.push([origin, target]);
		map.set(origin, target);
	}

	while(stack.length){
		let [ori, tar] = stack.pop();
		for(let key in ori){
			// 处理环状
			if(map.get(ori[key])){
				tar[key] = map.get(ori[key]);
				continue;
			}

			tar[key] = getEmpty(ori[key]);
			if(tar[key] !== ori[key]){
				stack.push([ori[key], tar[key]]);
				map.set(ori[key], tar[key]);
			}
		}
	}

	return target;
}

// test
[deepCopyBFS, deepCopyDFS].forEach(deepCopy=>{
	console.log(deepCopy({a:1}));
	console.log(deepCopy([1,2,{a:[3,4]}]))
	console.log(deepCopy(function(){return 1;}))
	console.log(deepCopy({
		x:function(){
			return "x";
		},
		val:3,
		arr: [
			1,
			{test:1}
		]
	}))

	let circle = {};
	circle.child = circle;
	console.log(deepCopy(circle));
})
```

### 2、回环判断

* AOV网：在一个表示工程的有向图中，用顶点表示活动，用弧表示活动之间的优先关系，这样的有向无环图为AOV网。

* 拓扑排序：将 AOV 网中所有活动排成一个序列，使得每个活动的前驱活动都排在该活动的前面。
* 拓扑序列：经过拓扑排序后得到的活动序列（一个 AOV 网的拓扑序列不是唯一的）。
* 拓扑排序思路
  * 选择一个入度为 0 的顶点并输出。
  * 从 AOV 网中删除此顶点及以此顶点为起点的所有关联边。
  * 重复上述两步，直到不存在入度为 0 的顶点为止。
  * 若输出的顶点数小于 AOV 网中的顶点数，则说明 AOV 网中回路，不是一个标准的 AOV 网。

```javascript
/* 邻接表实现有向图，拓扑排序判断是否有环 */
// 构造函数
function Graph() {
    this.vertices = []         //顶点集合
    this.edges = new Map()      //边集合
    this.indegress = new Map()  //入度集合
}

// 添加顶点
Graph.prototype.addVertex = function (v) {
    this.vertices.push(v)
    this.edges.set(v, [])
    this.indegress.set(v, 0)
}

// 添加边
Graph.prototype.addEdge = function (from, to) {
    let vEdge = this.edges.get(from)
    vEdge.push(to)
    this.edges.set(from, vEdge)
    this.indegress.set(to, this.indegress.get(to) + 1)
}

Graph.prototype.toString = function () {
    var s = ''
    for (var i=0; i<this.vertices.length; i++){
        s += this.vertices[i] + ' -> '
        var neighors = this.edges.get(this.vertices[i])
        for (var j=0; j<neighors.length; j++){
            s += neighors[j] + ' '
        }
        s += '\n'
    }
    return s
}

/* 拓扑排序判断回环 */
Graph.prototype.checkCircle = function () {
    var queue = []
    for(let key of this.indegress.keys()){
        if(this.indegress.get(key) === 0){
            queue.push(key)
        }
    }
    let count = 0;
    while (queue.length > 0) {
        count++;
        let from = queue.shift()
        let neighors = this.edges.get(from)
        for(let i=0; i<neighors.length; i++){
            let to = neighors[i]
            this.indegress.set(to, this.indegress.get(to) - 1)
            if(this.indegress.get(to) === 0){
                queue.push(to)
            }
        }
    }

    return !(count === this.vertices.length)
}

var graph = new Graph()
var vertices = [1,2,3,4,5]
for (var i=0; i<vertices.length; i++){
    graph.addVertex(vertices[i])
}
graph.addEdge(1, 4)
graph.addEdge(1, 3)
graph.addEdge(4, 5)
graph.addEdge(5, 1)

console.log(graph.toString())
console.log(graph.checkCircle())
```

