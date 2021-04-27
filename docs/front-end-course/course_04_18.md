# 面向对象编程

## 1、面向对象编程

### 1、特点

* 封装：让使用对象的人不考虑内部实现，只考虑功能使用把内部的代码保护起来，只留出一些 api 接口供用户使用
* 继承：就是为了代码的复用，从父类上继承出一些方法和属性，子类也有自己的一些属性
* 多态：是不同对象作用于同一操作产生不同的效果。多态的思想实际上是把“想做什么”和“谁去做“分开。

### 2、作用

在比较复杂的问题面前，或者参与方较多的时候，面向对象的编程思想可以很好的简化问题，并且能够更好的扩展和维护。

## 2、JS的面向对象

### 1、内置对象

* 对象包括：方法和属性
* 内置对象：Object、Array、Date、Function、RegExp

### 2、创建对象

#### 1、普通方式和工厂模式

每个对象需重写属性，无法识别对象类型，类型都为object

```js
//普通方式
const Player = new Object();
Player.color = "white";
Player.start = function () {
  console.log("white下棋");
};

//工厂模式
function createObject() {
  const Player = new Object();
  Player.color = "white";
  Player.start = function () {
    console.log("white下棋");
  };
  return Player;
}

let player1 = createObject()
```

#### 2、构造函数

自定义构造函数，使用构造函数添加对象属性和方法，通过new创建对象。

* 缺点：通过 this 添加的属性和方法总是指向当前对象的，所以在实例化的时候，通过 this 添加的属性和方法都会在内存中复制一份，这样就会造成内存的浪费
* 优点：即使改变了某一个对象的属性或方法，不会影响其他的对象（因为每一个对象都是复制的一份）

```js
function Player(color) {
  this.color = color;
  this.start = function () {
    console.log(color + "下棋");
  };
}

const whitePlayer = new Player("white");
const blackPlayer = new Player("black");
console.log(whitePlayer.start === blackPlayer.start) //false
```

* 静态属性：绑定在构造函数上的属性方法，需要通过构造函数访问

```js
//计算创建玩家总数
function Player(color) {
  this.color = color;
  if (!Player.total) {
    Player.total = 0;
  }
  Player.total++; 
}

let p1 = new Player("white");
console.log(Player.total); // 1
let p2 = new Player("black");
console.log(Player.total); // 2
```

#### 3、原型继承

通过原型对象添加属性和方法：原型继承的方法并不是自身的，我们要在原型链上一层一层的查找，这样创建的好处是只在内存中创建一次，实例化的对象都会指向这个 prototype 对象。

```js
function Player(color) {
  this.color = color;
}

Player.prototype.start = function () {
  console.log(color + "下棋");
};

//多个原型链方法添加简化，注意对象覆盖问题
Player.prototype = {
  start: function () {
    console.log("下棋");
  },
  revert: function () {
    console.log("悔棋");
  },
};

const whitePlayer = new Player("white");
const blackPlayer = new Player("black");
```

## 3、原型及原型链

### 1、原型链上添加对象和方法优点

在原型链上添加对象和方法，创建的对象，原型链上继承的方法和属性不是自身的，通过原型链查找都会指向原型对象，节省内存

### 2、查找原型对象

```js
/* 
__proto__：实例上的指针，指向其构造函数的原型对象
Object.getPrototypeOf：获取对象上的__proto__属性
isPrototypeOf：是否是某个实例对象的原型对象
prototype：构造函数属性，指向原型对象，原型对象有constructor属性，指向构造函数
*/
//构造函数
function Player(color) {
    this.color = color;
}

//构造函数的原型对象上添加start方法
Player.prototype.start = function () {
console.log(color + "下棋");
};
  
const whitePlayer = new Player("white");
  
console.log(whitePlayer.__proto__); // Player { start: [Function] }
console.log(Object.getPrototypeOf(whitePlayer)); // Player { start: [Function] }
console.log(Player.prototype); // Player { start: [Function] }
console.log(Player.__proto__); // [Function]

//原型对象有constructor属性，指向构造函数
console.log(Player.prototype.constructor === Player) //true
//正常的原型链都会终止于Object的原型对象，Object原型的原型是null
console.log(Player.prototype.__proto__ === Object.prototype)  //true
console.log(Player.prototype.__proto__.constructor === Object)//true
console.log(Player.prototype.__proto__.__proto__ === null) //true
```

<img src="/img/prototype.png">

### 3、new关键字解析

* 创建一个新对象
* 这个新对象内部的[[prototype]]特性被赋值为构造函数的prototype属性
* 构造函数内部的this指向这个新对象
* 执行构造函数内部的代码
* 如果构造函数返回非空对象，则返回该对象，否则返回刚创建的对象 

面试题目手写new函数：

```js
// 1. 用new Object() 的方式新建了一个对象 obj
// 2. 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
// 3. 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
// 4. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
// 5. 返回 obj
function objectFatory(){
    let obj = new Object()
    let Constructor = [].prototype.shift(arguments)
    obj.__prototype__ = Constructor.prototype
    let res = Constructor.apply(obj, arguments)
    return typeof res === 'object' : res : obj
}
//解析：
//栈方法：后进先出LIFO    push()末尾添加元素，pop()末尾取出元素
//队列方法：先进先出LILO	  push()末尾添加元素，shift()开头取出元素，
//                      unshift()开头添加元素,pop()末尾取出元素
```

### 4、原型链

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。这样一条通过[[prototype]]和 prototype 去连接的对象的链条，就是原型链。

```js
function Player() {}

Player.prototype.name = "Kevin";

var p1 = new Player();

p1.name = "Daisy";
// 查找p1对象中的name属性，因为上面添加了name，所以会输出“Daisy”
console.log(p1.name); // Daisy

delete p1.name;
// 删除了p1.name，然后查找p1发现没有name属性，就会从p1的原型p1.proto中去找，也就是Player.prototype，然后找到了name，输出"Kevin"
console.log(p1.name); // Kevin
```

那如果我们在 Player.prototype 中也找不到 name 属性呢,那么就会去 Player.prototype.[[prototype]]中去寻找，也就是{}。

```js
Object.prototype.name = "root";

function Player() {}

Player.prototype.name = "Kevin";

var p1 = new Player();

p1.name = "Daisy";
// 查找p1对象中的name属性，因为上面添加了name，所以会输出“Daisy”
console.log(p1.name); // Daisy

delete p1.name;
// 删除了p1.name，然后查找p1发现没有name属性，就会从p1的原型p1.__proto__中去找，也就是Player.prototype，然后找到了name，输出"Kevin"
console.log(p1.name); // Kevin

delete Player.prototype.name;

console.log(p1.name);
```

## 4、继承



