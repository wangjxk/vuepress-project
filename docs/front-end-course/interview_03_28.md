# 2021年核心面试题详解

## 1、相关面试题

### 1、实现lodash中的get函数：get(data, 'a[3].b') 

```js
//_.get(object, path, [defaultValue])
// 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
// 以免直接使用a[0].c时因a[0]为undefind造成undefind.c报错
// 使用方法：let a = {b:{c:'name'}}
// get(a, 'b[c]', 5)
const get = (data, path, defaultValue = void 0) => {
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  // paths => ['a', '3', 'b'];
  let result = data;
  for (const path of paths) {
    result = Object(data)[path];  // edge case data -> null 
    if (result == null || result == undefined) {
      return defaultValue;
    }
  }
  return result;
}
```

### 2、实现 add(1)(2)(3) 柯里化函数

参考资料：

1、[前端经典面试题解密-add(1)(2)(3)(4) == 10到底是个啥？](https://blog.csdn.net/chen801090/article/details/105602712/?utm_medium=distribute.wap_relevant.none-task-blog-baidujs_title-2)

2、[js高阶函数应用—函数柯里化和反柯里化](https://www.cnblogs.com/johnhery/p/9805931.html)

3、[js高阶函数应用—函数柯里化和反柯里化(二)](https://www.cnblogs.com/yifeng555/p/8901751.html)

4、[函数的length属性](https://www.cnblogs.com/xuzhudong/p/8383597.html)

函数柯里化概念： 柯里化（Currying）是把接受多个参数的函数转变为接受一个单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。本题实现将add(1, 2, 3)函数柯里化，即add(1)(2)(3)

length 是函数对象的一个属性值，指该函数有多少个必须要传入的参数，即形参的个数。形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。与之对比的是，arguments.length 是函数被调用时实际传参的个数。

```js
//粗暴版本
function add (a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        }
    }
}
console.log(add(1)(2)(3)); // 6

//参数长度固定
function curry(fn){
    let len = fn.length 
    let args = []
    return function _c(...newArgs){
        args = [...args, ...newArgs] //合并参数
        if(args.length < len){
            return _c
        }else{
            let res = fn.apply(this, args.slice(0, len))
            args = [] //清空数组，防止下次调用时影响
            return res
        }
    }
}

const add = (a, b, c) => a + b + c;
const curryAdd = curry(add);
console.log(curryAdd(1)(2)(3)); // 6
console.log(curryAdd(1, 2)(3)); // 6
console.log(curryAdd(1)(2, 3)); // 6

//参数长度不固定
function add(...args) {
    return args.reduce((a, b) => a + b)
}
 
function currying (fn) {
    let args = []
    return function _c (...newArgs) {
        if (newArgs.length) {
            args = [
                ...args,
                ...newArgs
            ]
            return _c
        } else {
            let res = fn.apply(this, args)
            args = [] //保证再次调用时清空
            return res
        }
    }
}
 
let addCurry = currying(add)
console.log(addCurry(1)(2)(3)(4, 5)())  //15
console.log(addCurry(1)(2)(3, 4, 5)())  //15
console.log(addCurry(1)(2, 3, 4, 5)())  //15
```

### 3、手写await和async

参考：[手写async await的最简实现（20行）](https://juejin.cn/post/6844904102053281806)

```js
function fn(s){
    return new Promise(function(resolve){
        setTimeout(() => {
            resolve(s)
        }, s)
    })
}
//用generator和yield实现await
function * gFn(){
    console.time('t1')
    let t1 = yield fn(1000)
    console.timeEnd('t1')
    console.time('t2')
    let t2 = yield fn(2000)
    console.timeEnd('t2')
    return 'success'
}

function asyncToGenerator(fn){
    let generator = fn()
    return new Promise(function(resolve, reject){
        let step = function(key, args){
            let res = null
            try{
                res = generator[key](args)
            }catch(e){
                reject(e)
            }
            let {value, done} = res
            if(done){
                resolve(value)
            }else{
                Promise.resolve(value).then((value) => {
                    step('next', value)
                }).catch((e)=>{
                    step('throw', e)
                })
            }
        }
        step('next')
    })
}

let t = asyncToGenerator(gFn)
t.then(r => {
    console.log('r', r)
})
```

### 4、如何优化 node 镜像制作

- DOCKER_BUILDKIT 查看 dockerfile instruction 耗时
- FROM YOUR_OLD_DOCK 基于历史最新的业务镜像构建
- COPY 等指令，充分利用 cache
- 优化 OS 大小，alpine
- npm i --only=production 移除 devDependencies
- 抽出来放 CDN 
- ...

关注一下 devOps

### 5、webpack 热更新原理 

```js
/**

- 内存文件系统
- |
- 读写
- |
- webpack compile     - watch -      代码
- |                               |
- ----------------------------change
- |
- server(websocket) --> manifest(hash.hot-update.json / hash.hot-update.js) ｜ hash & chunk
- |
- |
- Browser: hotDownloadManifest(拉 manifest)
- |
- | get hash chunkid
- |
- hotDownloadUpdateChunk(拉 chunkjs 文件)
- |
- |
- hotAddUpdateChunk(update the chunk)
- |
- |
- hotUpdateDownloaded
*/

// homework： 思考如何让传统的 webpack hmr 更快？
// 思路：
// 1. 为什么慢？
// 2. 跟模块模式有关联吗？ ESM
// 3. 想想 vite？
```

### 6、 最短编辑距离算法问题

参考资料：[经典动态规划问题：最短编辑距离算法的原理及实现](https://www.jianshu.com/p/12e9b9a9a350)

给出两个单词word1和word2，计算出将word1 转换为word2的最少操作次数，你总共三种操作方法：插入一个字符、删除一个字符、替换一个字符

考察点：`Levenshtein Distance` 算法，react中使用场景，多应用于模糊匹配

```js
const str1 = 'study'
const str2 = 'stduy1'

/*
     0 s t u d y
   0 0 1 2 3 4 5
   s 1
   t 2
   u
   d
   y
*/
//暴力解法： 空间复杂度o(n^2), 时间复杂度o(n^2)
function levenshtein1(str1, str2) {
    let len1 = str1.length
    let len2 = str2.length
    let ary = Array.from(new Array(len2 + 1), () => new Array(len1 + 1))
    //let ary = []
    for (let i = 0; i <= len1; i++) {
        //ary[i] = []
        for (let j = 0; j <= len2; j++) {
            if (i == 0) {
                ary[i][j] = j
            } else if (j == 0) {
                ary[i][j] = i
            } else {
                ary[i][j] = Math.min(
                    ary[i - 1][j] + 1, 
                    ary[i][j - 1] + 1, 
                    str1[i] === str2[j] ? ary[i - 1][j - 1] : ary[i - 1][j - 1] + 1)
            }
        }
    }
    return ary[len1][len2]
}

//滚动数组：空间复杂度o(n*2), 时间复杂度o(n^2)
function levenshtein2(str1, str2) {
    let len1 = str1.length
    let len2 = str2.length
    let ary = new Array(len1 + 1)
    for(let i=0; i<=len1; i++){
        ary[i] = i
    }
    let aryT = [].concat(ary)
    for(let j=1; j<=len2; j++){
        ary[0] = j;
        for (let i=1; i<=len1; i++){
            ary[i] = Math.min(
                ary[i-1] + 1,
                aryT[i] + 1,
                str1[i] === str2[j] ? aryT[i-1] : aryT[i-1] + 1
            )
        }
        aryT = [].concat(ary)
    }
    return ary[len1]
}

console.log(levenshtein1(str1, str2))
console.log(levenshtein2(str1, str2))
```

## 2、个人简历

* 简历的标题一定要带上名字(比如：张三-本-4年-高级前端开发工程师.pdf) 

* 强烈建议不要搞些花哨的网页版简历 

* 简历最好不要超过 1 页，至多不超过 2 页 

* 简历三大原则：清晰，简短，必要 

* 简历不是一成不变，可针对 JD 定制，指哪儿打哪儿 

### 1、个人介绍

联系方式，意向工作地，岗位诉求，学校学历

### 2、个人技术部分

一、不建议写个人技术列表，如果非要写，切记以下内容不建议写上去： 

1、其实你不是很精深的知识领域，比如只是配置过 webpack 

2、常识性的知识技能不要写了，比如 git 操作等

3、过时已久的也不建议写了，比如你写一个熟练使用 backbone 

二、注意以下措辞的区别： 

1、了解：表示你听说过这个概念，甚至了解与此概念有关的基本原理 

2、熟悉：表示你通过 Demo 的形式实践过某个技术，或做过一两个与该技术有关的项目，但缺乏沉 

淀

3、熟练掌握：表示你在工业级环境下，通过数个项目的实践已经掌握了某种技术的核心原理，并能够 

灵活地应用在开发中 

4、精通：表示你通过很多次的项目实践和潜心研究，已经对某种技术的原理和应用掌握到近乎尽善尽 

美的程度 

三、加分项： 

1、社区博客文章，高转发高点赞那种，加分 

2、Github 一片绿油油的，主导/参与维护一些社区知名项目， PR 内容都是逻辑代码级别的，不是 

文档 

3、除前端常用技术栈，还掌握了一些其他技能，后端语言等

### 3、个人项目（60%）

1、bad case：我在该项目中完成了 XXX，YYY 需求，运用了 a，b，c 技术。 

2、good case: XXX 项目出现 XXX 问题，我作为 XXX，负责其中的 XXX 部分，我通过 XXX 方式（或技术方案） ，成功解决了该问题，使 XXX 提高了 XXX，XXX 增长了 XXX