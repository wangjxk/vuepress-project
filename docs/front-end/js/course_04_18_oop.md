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

### 1、原型链继承

#### 1、实现

* 原理：通过原型继承多个引用类型的属性和方法。

* 构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型有一个属性指回构造函数，而实例有一个指针指向原型。原型对象是另一个类型的实例时，原实例即可继承该实例的属性和方法。

```js
//父对象构造函数
function Parent() {
  this.name = "parentName";
}
//父对象原型对象
Parent.prototype.getName = function () {
  console.log(this.name);
};

//子对象构造函数
function Child() {}
//子对象原型对象指向父对象实例，完成继承
Child.prototype = new Parent();
//子对象构造函数更新为自身
Child.prototype.constructor = Child;

//测试
var child1 = new Child();
child1.getName(); // parentName

// 1、解析：Child.prototype = new Parent();
// Parent的实例同时包含实例属性方法和原型属性方法，所以把new Parent()赋值给Child.prototype。
// 如果仅仅Child.prototype = Parent.prototype，那么Child只能调用getName，无法调用.name
// 当Child.prototype = new Parent()后， 如果new Child()得到一个实例对象child，那么
// child.__proto__ === Child.prototype;
// Child.prototype.__proto__ === Parent.prototype
// 也就意味着在访问child对象的属性时，如果在child上找不到，就会去Child.prototype去找，如果还找不到，就会去Parent.prototype中去找，从而实现了继承。

// 2、解析：Child.prototype.constructor = Child;
// 因为constructor属性是包含在prototype里的，上面重新赋值了prototype，所以会导致Child的constructor指向[Function: Parent]，有的时候使用child1.constructor判断类型的时候就会出问题
// 为了保证类型正确，我们需要将Child.prototype.constructor 指向他原本的构造函数Child
```

#### 2、隐含的问题

* 如果有属性是引用类型的，一旦某个实例修改了这个属性，所有实例都会受到影响。

* 创建子对象Child 实例的时候，不能传参

```js
function Parent() {
  this.actions = ["eat", "run"];
}
function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child();
const child2 = new Child();

child1.actions.pop();
//所有实例受影响，因都使用原型链属性，此时原型链属性被修改
console.log(child1.actions); // ['eat']
console.log(child2.actions); // ['eat']
```

### 2、构造函数继承

#### 1、实现

盗用构造函数技巧：在子类构造函数中调用父类构造函数，使用apply和call方法以新创建的对象为上下文执行构造函数。

* 属性公用问题解决：执行子类的构造函数时，相当于运行了父类构造函数的所有初始化代码，结果是子类的每个实例都会有自己的属性。
* 传递参数：可以在子类构造函数中向父类构造函数传参。

```js
function Parent() {
  this.actions = ["eat", "run"];
  this.name = "parentName";
}

function Child() {
  Parent.call(this); //子类构造函数调用父类构造函数
}

const child1 = new Child();
const child2 = new Child();

child1.actions.pop();

console.log(child1.actions); // ['eat']
console.log(child1.actions); // ['eat', 'run']
```

```js
function Parent() {
  this.actions = ["eat", "run"];
  this.name = "parentName";
}

function Child(id, name, actions) {
  Parent.call(this, name); // 如果想直接传多个参数, 可以Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

const child1 = new Child(1, "c1", ["eat"]);
const child2 = new Child(2, "c2", ["sing", "jump", "rap"]);

console.log(child1.name); // { actions: [ 'eat' ], name: 'c1', id: 1 }
console.log(child2.name); // { actions: [ 'sing', 'jump', 'rap' ], name: 'c2', id: 2 }
```

#### 2、隐含的问题

* 属性或者方法想被继承的话，只能在构造函数中定义。
* 方法在构造函数内定义了，那么每次创建实例都会创建一遍方法，多占一块内存。

```js
function Parent(name, actions) {
  this.actions = actions;
  this.name = name;
  this.eat = function () {
    console.log(`${name} - eat`);
  };
}

function Child(id) {
  Parent.apply(this, Array.prototype.slice.call(arguments, 1));
  this.id = id;
}

const child1 = new Child(1, "c1", ["eat"]);
const child2 = new Child(2, "c2", ["sing", "jump", "rap"]);

console.log(child1.eat === child2.eat); // false
```

### 3、组合继承

#### 1、实现

综合了原型链继承和构造函数继承，基本思路：使用原型链继承原型上的属性和方法，通过构造函数继承继承实例属性。这些既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。

```js
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

//使用构造函数继承实例属性
function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1)); 
  this.id = id;
}
//使用原型链继承继承原型上的属性和方法
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child(1, "c1", ["hahahahahhah"]);
const child2 = new Child(2, "c2", ["xixixixixixx"]);

child1.eat(); // c1 - eat
child2.eat(); // c2 - eat
console.log(child1.name === child2.name); // false
console.log(child1.eat === child2.eat);   // true
```

#### 2、隐含的问题

调用了两次构造函数，做了重复的操作，一次是在创建子类原型时调用，另一次是在子类构造函数中调用

* Parent.apply(this, Array.from(arguments).slice(1));

* Child.prototype = new Parent();

### 4、寄生组合式继承

组合继承的优化，通过 Child.prototype 间接访问到 Parent.prototype，减少一次构造函数执行。



```js
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

// 模拟Object.create的效果
let TempFunction = function () {};
TempFunction.prototype = Parent.prototype;
Child.prototype = new TempFunction();
Child.prototype.constructor = Child;
//封装写法
function inheritPrototype(child, parent){
    let prototype = Object.create(parent.prototype)//object(parent.prototype)
    prototype.constructor = child
    child.prototype = prototype
}
inheritPrototype(Child, Parent)

const child1 = new Child(1, "c1", ["hahahahahhah"]);
const child2 = new Child(2, "c2", ["xixixixixixx"]);
```

为什么一定要通过桥梁的方式让 Child.prototype 访问到 Parent.prototype？
直接 Child.prototype = Parent.prototype 不行吗？
答：不行！！在给 Child.prototype 添加新的属性或者方法后，Parent.prototype 也会随之改变。

```js
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

Child.prototype = Parent.prototype;

Child.prototype.constructor = Child;

console.log(Parent.prototype); // Child { eat: [Function], childEat: [Function] }

Child.prototype.childEat = function () {
  console.log(`childEat - ${this.name}`);
};

const child1 = new Child(1, "c1", ["hahahahahhah"]);

console.log(Parent.prototype); // Child { eat: [Function], childEat: [Function] }
```

### 5、class类继承

* 两种定义方式
  * 类申明：class Person{}
  * 类表达式：const Person = class{}

* 构成
  * 构造函数方法：类构造函数与普通构造函数的主要区别是，调用类的构造函数必须使用new操作符，而普通函数如果不使用new调用，那么就会以全局this（通常是window）作为内部对象。
  * 实例方法
  * 获取函数、设置函数
  * 静态类方法

```js
class Parent {
    name_= null
    constructor() {
        this.name = 'aaa';
    }
    getName() {
        return this.name
    }
    static get(){
        return 'good'
    }
    //支持获取和设置访问器
    //使用get和set关键字对某个属性设置存值函数和取值函数，拦截该函数的存取行为
    set name(value){
        this.name_ = value
    }
    get name(){
        return this.name_
    }
}
Parent.get() //good
//通过类继承
class Child extends Parent {
    constructor() {
        super();
    }
}
const p1 = new Child();
p1.getName();

```

