# TypeScript

> 参考资料：
>
> 1、[TypeScript入门教程](https://ts.xcatliu.com/)
>
> 2、[深入理解TypeScript](https://jkchao.github.io/typescript-book-chinese/)

## 1、准备

```js
npm install -g typescript
tsc hello.ts  //编译
tsc //编译，默认配置tsconfig.json
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

类型别名用来给一个类型起个新名字，type声明的方式可以定义组合类型、交叉类型和原始类型，比interface声明范围广

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

### 5、数组类型

* [类型 + 方括号]表示法
* 数据泛型
* 接口表示数组
* 类数组：不能用普通数组方式表示，需使用接口方式

```typescript
//【类型+方括号】表示法
let fibonacci: number[] = [1, 2, 2] //number类型数组
//数据泛型
let fibonacci: Array<number> = [1, 2, 3]
//接口表示法
interface NumberArray{
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 2, 2]
//类数组
function sum(){
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
    //arguments的一个属性，指向arguments所在函数
    //函数逻辑与函数名解耦
    /* 阶乘
     function factorial(num){
     		if(num<1){
     			return 1
     		}else{
     			return num * arguments.callee(num-1)
     		}
     }
    */
  } = arguments
}
//any在数组中使用，允许出现任意类型
let list: any[] = ['xcatliu', 25, {website: "http://baidu.com"}]
```

### 6、元组类型

数组合并了相同类型的对象，元组（Tuple）合并了不同类型的对象。

 ```js
 let tom: [string, number] = ['Tom', 25]
 tom[0] = 'Jack'
 tom[1] = 45
 ```

### 7、函数类型

* 函数申明

```typescript
function sum(x: number, y:number): number {
  return x + y
}
sum(1, 2, 3) //error TS2346, 多余或小于参数都报错
sum(1) //error TS2346
```

* 函数表达式

```typescript
//mySum类型是通过赋值操作进行类型推论而推断出来的，类型只限制匿名函数
let mySum = function(x: number, y:number): number {
  return x + y;
}
//手动添加类型
//ts中=>用来表示函数的定义，左边是输入类型，用括号括起来，右边是输出类型，与es6中箭头函数不同
let mySum: (x: number, y:number) => number = function (x: number, y: number): number {
  return x + y
}

//接口定义函数形状
interface sum {
  (x: number, y:number): number
}
let mySum: sum = function (x: number, y: number): number {
  return x + y
}
```

* 可选参数、参数默认值、剩余参数

```typescript
//可选参数必须在最后
function buildName(firstName: string, lastName?: string){
  return lastName ? firstName + lastName : firstName;
}
//参数默认值
function buildName(firstName: string = 'Tom', lastName: string){
  return firstName + lastName
}
//剩余参数，最后一个参数，为数组
function push(array: any[], ...items: any[]){
  items.forEach(function(item){
    array.push(item)
  })
}
let a = []
push(a, 1, 2, 3)
```

* 函数重载

```typescript
//一个函数接受不同数量或类型的参数时，做出不同的处理
//函数定义
function reverse(x: number): number;
function reverse(x: string): string;
//函数实现
function reverse(x: number | string): number | string | void {
  if(typeof x === 'number'){
    return Number(x.toString().split('').reverse().join(''))
  }else if(typeof x === 'string'){
    return x.split('').reverse().join('')
  }
}
```

### 8、泛型类型

泛型是指在定义函数、接口或者类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。可以把泛型理解为代表类型的参数

```typescript
//定义
function createArray<T>(length: number, value: T): Array<T>{
  let result: T[] = []
  for (let i=0; i<length; i++) {
    result[i] = value
  }
  return result
}
//使用
createArray<string>(3, 'x') //显示指定类型
createArray(3, 'x')	//类型推论

//可指定泛型参数的默认类型, 默认为string
function createArray<T = string>(length: number, value: T): Array<T>{
  ...
}
```

* 泛型约束
  * 不可随意操作泛型的属性或方法，编译会限制
  * 可通过接口进行泛型指定约束

```typescript
interface Lengthwise {
  length: number;
}
//extends约束了泛型T必须符合接口Lengthwise的形状，必须有length属性
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

* 泛型接口：使用接口形式定义函数
* 泛型类：用于类的类型定义

```typescript
//使用接口的方式定义一个函数
interface SearchFunc {
  (source: string, substring: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, substring: string){
  return source.search(substring) !== -1
}

//泛型接口定义
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {}

//泛型接口定义：将泛型提取
interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc <any>; //使用泛型接口时需要定义
createArray = function<T>(length: number, value: T): Array<T> {}

//泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T
}
```

面试题：什么是泛型，泛型的具体使用

## 3、操作符

### 1、typeof

获取一个变量申明或对象的类型

```typescript
function toArray(x: number): Array<number>{
  return [x]
}
type Func = typeof toArray //(x: number) => nubmer[]
```

### 2、keyof

获取对象中所有的key值

```typescript
interface Person {
  name: string;
  age: number;
}
type k1 = keyof Person; //"name" | "age"
```

### 3、in

用来遍历枚举类型

```typescript
type keys = "a" | "b" | "c"
type obj = {
  [p in keys]: any
}//{a:any, b:any, c:any}
```

### 4、extends

继承及泛型约束添加

### 5、Paritial、Required、Readonly

Paritial、Required、Readonly的作用将类型里的属性全部变为可选项？、必选项、只读项

### 6、Record

```typescript
//Record<K, T>的作用是将K中所有的属性的值转化为T类型
interface PageInfo {
  title: string;
}
type Page = "home" | "about" | "contact"
const x: Record<Page, PageInfo> = {
  about: {title: "about"},
  contact: {title: "contact"},
  home: {title: "home"}
}
```

### 7、Exclude、Extract

```typescript
//类型移除
type T0 = Exclude<"a" | "b" | "c", "a">  //"b"|"c"
//类型提取
type T1 = Extract<"a" | "b" | "c", "a" | "f">  //"a"
```

## 4、实战

### 1、装饰器decorator

ES7的与类相关的新语法，通过添加@方法名对对象进行装饰包装，返回被包装的对象

* 可装饰对象包括：类、属性、方法等。
* 装饰类：当装饰的对象是类时，我们操作的就是这个类本身，即装饰器函数的第一个参数，就是所要装饰的目标类
* 装饰属性和方法：对于类属性或方法的装饰本质是操作其描述符，理解成是 Object.defineProperty(obj, prop, descriptor)的语法糖，参数如下：
  * target：装饰的属性所述的类的原型，不是实例后的类，如果装饰的是 Car 的某个属性，这个 target 的值就是 Car.prototype。
  * name：装饰的属性名
  * descriptor：属性的描述符对象

* babel支持( --save-dev)：
  * babel>=7.x: @babel/plugin-proposal-decorators
  * bable<=6.x: babel-plugin-transform-decorators-legacy

#### 1、类装饰器

```ts
@decorator
class A {}
// 等同于
class A {}
A = decorator(A) || A;


//日志打印实例
@log('hi')
class MyClass { }

function log(text) { // 这个 target 在这里就是 MyClass 这个类
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name} 被调用`
  }
}

const test = new MyClass()
test.logger() // hello，MyClass 被调用
```

#### 2、属性装饰器

* 计算时间的装饰器

```js
//decorator.ts
//装饰属性和方法
export function before(beforeFn: any){
    return function(target: any, name: any, descriptor: any){
        console.log('target:', target)
        console.log('name:', name)
        const oldValue = descriptor.value
        descriptor.value = function(){
            beforeFn.apply(this, arguments)
            return oldValue.apply(this, arguments)
        }
        return descriptor
    }
}

//装饰属性和方法
export function after(afterFn: any){
    return function(target: any, name: any, descriptor: any){
        const oldValue = descriptor.value
        descriptor.value = function(){
            const res = oldValue.apply(this, arguments)
            afterFn.apply(this, arguments)
            return res
        }
        return descriptor
    }
}

//计算时间函数，无参数
export function measure(target: any, name: any, descriptor: any): any{
    const oldvValue = descriptor.value;
    descriptor.value = async function(...args: any){
        const start = Date.now()
        const res = await oldvValue.apply(this, args)
        console.log(`${name}执行耗时  ${Date.now() - start}`)
    }
}

//index.ts
import {before, after, measure} from "./decorator"

class MyClass{
    @before(function(){console.log("begin")})
    @after(function(){console.log("end")})
    @measure
    testDecorator(){
        console.log("test decorator")
    }
}

const obj = new MyClass()
obj.testDecorator()

//tsconfig.json
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./build",
      "rootDir": "./src",
      "importHelpers": true,
      "strict": true,
      "experimentalDecorators": true
    },
    "exclude": [
        "node_modules"
    ]
}
```

* 缓存的装饰器

```ts
const cacheMap = new Map();

export function EnableCache(target: any, name: string, descriptor: PropertyDescriptor) {
    const val = descriptor.value;
    descriptor.value = async function(...args: any) {
        const cacheKey = name + JSON.stringify(args);
        if (!cacheMap.get(cacheKey)) {
            const cacheValue = Promise.resolve(val.apply(this, args)).catch((_) => cacheMap.set(cacheKey, null));
            cacheMap.set(cacheKey, cacheValue);
        }
        return cacheMap.get(cacheKey);
    };
    return descriptor;
}
```

### 2、routeHelper

实现一个路由跳转，通过ts约束参数的routeHelper

```ts
/* 使用ts类型约束，限定路由参数*/
import {Dictionary} from 'vue-router/types/router'
import Router, {RoutePath} from "../router"

//定义基本路由类型为对象，{ [key: string]: string}
export type BaseRouteType = Dictionary<string>;

/* 首页路由，必须有name参数，//注释无法查看 */
export interface IndexParam extends BaseRouteType {
    name: string
}
//关于页面，必须有testName参数
export interface AboutPageParam extends BaseRouteType {
    testName: string
}
export interface UserPageParam extends BaseRouteType {
    userId: string
}

export interface ParamsMap {
    [RoutePath.Index]: IndexParam;
    [RoutePath.About]: AboutPageParam;
    [RoutePath.User]: UserPageParam;
}

/* RoutePath为枚举类型
export enum RoutePath {
    Index = '/',
    About = '/about',
    User = '/user',
}
*/
export class RouteHelper {
    //泛型约束：T必须是RoutePath的值
    //通过路由routePath，限定参数params
    public static replace<T extends RoutePath>(routePath: T, params: ParamsMap[T]){
        Router.replace({
            path: routePath,
            query: params
        })
    }

    public static push<T extends RoutePath>(routePath: T, params: ParamsMap[T]){
        Router.push({
            path: routePath,
            query: params
        })
    }
}

//使用方法
import {RouteHelper} from '../lib/routerHelper'
RouterHelper.push(RoutePath.About, {testName: 'test'})
```

### 3、countdown基础类

实现一个基于ts和事件模式的countdown基础类

```ts
import {EventEmitter} from 'eventemitter3'

/** 倒计时状态 */
enum CountdownStatus {
    start,
    running,
    stoped
}

/** 倒计时触发的事件枚举 */
export enum CountdownEventName {
    START = 'start',
    STOP = 'stop',
    RUNNING = 'running',
}

/* key为事件名，数组为事件对应的参数 */
interface CountdownEventMap {
    [CountdownEventName.START]: [];
    [CountdownEventName.STOP]: [];
    [CountdownEventName.RUNNING]: [RemainTimeData]
}

/* 输出时间格式 */
export interface RemainTimeData {
    /** 天数 */
    days: number;
    /** 小时数 */
    hours: number;
    /** 分钟数 */
    minutes: number;
    /** 秒数 */
    seconds: number;
    /** 毫秒数 */
    count: number;
}


//开始、运行、结束
export class Countdown extends EventEmitter<CountdownEventMap>{
    private static COUNT_IN_MILLISECOND: number = 1 * 100; //100ms
    private static SECOND_IN_MILLISECOND: number = 10 * Countdown.COUNT_IN_MILLISECOND; //1s
    private static MINUTE_IN_MILLISECOND: number = 60 * Countdown.SECOND_IN_MILLISECOND; //1min
    private static HOUR_IN_MILLISECOND: number = 60 * Countdown.MINUTE_IN_MILLISECOND; //1h
    private static DAY_IN_MILLISECOND: number = 24 * Countdown.HOUR_IN_MILLISECOND; //1d

    private endTime: number; //结束时间
    private remainTime = 0;  //剩余时间
    private status: CountdownStatus = CountdownStatus.stoped; //状态
    private step: number; //增长步数

    constructor(endTime: number, step = 1000) {
        super();
        this.endTime = endTime;
        this.step = step;
        this.start();
    }

    public start(){
        this.emit(CountdownEventName.START)
        this.status = CountdownStatus.running
        this.countdown()
    }

    public stop(){
        this.emit(CountdownEventName.STOP)
        this.status = CountdownStatus.stoped
    }

    private countdown() {
        if (this.status !== CountdownStatus.running){
            return
        }
        this.remainTime = Math.max(this.endTime - Date.now(), 0); //避免负数
        this.emit(CountdownEventName.RUNNING, this.parseRemainTime(this.remainTime));
        //剩余时间大于0，继续countdown
        if (this.remainTime > 0) {
            setTimeout(() => this.countdown(), this.step);
        } else {
            this.stop();
        }

    }
    //时间计算
    private parseRemainTime(remainTime: number): RemainTimeData {
        let time = remainTime;

        const days = Math.floor(time / Countdown.DAY_IN_MILLISECOND);
        time = time % Countdown.DAY_IN_MILLISECOND;

        const hours = Math.floor(time / Countdown.HOUR_IN_MILLISECOND);
        time = time % Countdown.HOUR_IN_MILLISECOND;

        const minutes = Math.floor(time / Countdown.MINUTE_IN_MILLISECOND);
        time = time % Countdown.MINUTE_IN_MILLISECOND;

        const seconds = Math.floor(time / Countdown.SECOND_IN_MILLISECOND);
        time = time % Countdown.SECOND_IN_MILLISECOND;

        const count = Math.floor(time / Countdown.COUNT_IN_MILLISECOND);

        return {
            days,
            hours,
            minutes,
            seconds,
            count,
        };

    }
}
/** 输出格式化 */
export function fillZero(num: number) {
    return `0${num}`.slice(-2);
}

//使用
public timeDisplay: string = '';
public created(){
  const countdown = new Countdown(Date.now()+60*60*1000, 100)
  countdown.on(CountdownEventName.RUNNING, (remainTimeData)=>{
    const {hours, minutes, seconds, count} = remainTimeData
    this.timeDisplay = [hours, minutes, seconds, count].map(fillZero).join(':')
  })
}
```

## 5、编译原理

* 类型检查：通过ast和检查器实现类型检查功能

* 转换js：通过ast和发射器转换为js代码

<img src="/img/ts.png">
