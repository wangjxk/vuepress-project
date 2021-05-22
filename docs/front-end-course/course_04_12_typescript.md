# TypeScript

参考资料：[TypeScript入门教程](https://ts.xcatliu.com/)

## 1、准备

```s
npm install -g typescript
tsc hello.ts
```

面试题：你觉得使用ts的好处是什么?

*  ts是JavaScript的加强版，它给JavaScript添加了可选的静态类型和基于类的面向对象编程，它拓展了JavaScript的语法。
* ts是面向对象的编程语音，包含类和接口的概念
* ts在开发时能给出编译错误，js需要运行时暴露
* ts为强类型语言，代码可读性强
* ts中添加很多方便的特性，比如可选链

## 2、基础

### 1、原始数据类型

JavaScript 的类型分为两种：原始数据类型（[Primitive data types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)）和对象类型（Object types）。

原始数据类型包括：布尔值、数值、字符串、`null`、`undefined` 以及 ES6 中的新类型 [`Symbol`](http://es6.ruanyifeng.com/#docs/symbol) 和 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。

```typescript
let isDone: boolean = false
let isDone: boolean = Boolean(1) //使用new Boolean(1)报错，为对象不为元素数据类型
let decLiteral: number = 6
let hexLiteral: number = 0xf00d //16进制
let binaryLiteral: number = 0b1010 //2进制
let octalLiteral: number = 0o744 //8进制
let notANumber: number = NaN
let infinityNumber: number = Infinity
let myName: string = 'Tom'
let unusable: void = undefined | null
let u: undefined = undefined
let n: null = null
//undefined和null是所有类型的子类型，可赋值给所有类型的变量
let num: number = undefined
```

任意值：声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值；变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

```typescript
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;

let something; //等价于let something: any
something = 'seven';
something = 7;
```

### 2、枚举类型

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
```

### 3、接口类型和类型别名

#### 1、接口类型interface

使用接口Interfaces来定义对象的类型，TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

```typescript
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25
}

//可选属性？:
//任意属性[propName: string]: any
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

//一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：name和age必须是gender的子集，报错
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
//修改如下：使用联合属性
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number;
}
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
```

#### 2、类型别名

类型别名用来给一个类型起个新名字

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

#### 3、面试题：type 和 interface的异同

参考资料：[TypeScript中interface和type的区别](https://blog.csdn.net/weixin_43758377/article/details/110470780)

* 用interface描述数据结构，用type描述数据类型
* 相同点
  * 都可以描述一个对象或者函数
  * 都允许扩展extends：interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends  type, type 也可以 extends interface ，语法不同。

* 异同点
  * type 可以声明基本类型别名，联合类型，元组等类型
  * type语句中还可以使用typeof获取实例的类型进行赋值
  * interface能够声明合并

```typescript
//1、都可以描述一个对象或者函数
interface User {
 name: string
 age: number
}
interface SetUser {
 (name: string, age: number): void; 
}
type User = {
 name: string
 age: number
};
type SetUser = (name: string, age: number)=> void;

//2、都允许扩展
//interface extends interface
interface Name {
 	name: string; 
}
interface User extends Name {
 	age: number; 
}
// type extends type
type Name = {
 	name: string; 
}
type User = Name & { age: number };

// 3、异同点：type可以声明基本类型别名，联合类型，元组等类型
// 基本类型别名
type Name = string;

// 联合类型
interface Dog {
    wong()
}
interface Cat {
    miao();
}

type Pet = Dog | Cat;

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet];

// 当你想要获取一个变量的类型时，使用typeof
let div = document.createElement('div');
type B = typeof div;
```

### 4、联合类型与交叉类型

* 联合类型一次只能一种类型

* 交叉类型每次都是多个类型的合并类型

```typescript
let mNum: string | number;
mNum = 'five'
mNum = 5

interface ia {
  name: {
      attr1: string
  };
}
interface ib {
  name: {
      attr2: number
  };
  age: number;
}
type a= ia & ib;
var s:a= {
    name: {
        attr1: '11',
        attr2: 22
    },
    age: 16
}
```

