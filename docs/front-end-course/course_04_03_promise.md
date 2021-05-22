# Promise规范和应用

## 1、参考资料

1、 [promise A plus规范](https://promisesaplus.com/)

2、[【第1738期】100 行代码实现 Promises/A+ 规范](https://mp.weixin.qq.com/s/Yrwe2x6HukfqJZM6HkmRcw)

3、[JS常见问题整理](http://www.wangjxk.top/front-end/js/)

4、[史上最详细手写promise教程](https://www.cnblogs.com/sugar-tomato/p/11353546.html)

## 2、PromiseA+规范

参考规范： [promise A plus](https://promisesaplus.com/)，解读如下：

### 0、术语

* promise是一个有then方法的对象或者函数，行为遵循本规范

* thenable是一个有then方法的对象或者是函数

* value是promise状态成功时的值，也就是resolve的参数，指各种js值（包括undefined、thenable和promise）

* reason是promise状态失败时的值，也就是reject的参数，表示拒绝的原因

* exception是一个使用throw抛出的异常值

### 1、Promise States

promise有三种状态，注意他们之间的流转关系

#### 1、pending

* 初始状态，可改变
* 一个promise在resolve或者reject之前都处于这个状态
* 可通过resolve转变为fulfilled状态
* 可通过reject转变为rejected状态

#### 2、fulfilled

* 最终态，不可变
* 一个promise被resolve后会变为这个状态
* 必须拥有一个value值

#### 3、rejected

* 最终态，不可变
* 一个promise被reject后会变为这个状态
* 必须拥有一个reason

状态流转如下：

pending -> resolve(value) -> fulfilled

pending -> reject(reason) -> rejected

### 2、then

promise应该有个then方法，用来访问最终的结果，无论是value还是reason。

```javascript
promise.then(onFulfilled, onRejected)
```

#### 1、参数要求

* onFulfilled必须是函数类型，可选，如果不是函数，应该被忽略
* onRejected必须是函数类型，可选，如果不是函数，应该被忽略

#### 2、onFulfilled特性

* 在promise变为fulfilled时，应该调用onFulfilled，参数是value
* 在promise变成fulfilled之前，不应该被调用
* 只能被调用一次（实现时需使用变量来限制执行次数）

#### 3、onRejected特性

* 在promise变成rejected时，应该调用onRejected，参数是reason
* 在promise变成rejected之前，不应该被调用
* 只能被调用一次

#### 4、onFulfilled和onRejected应该是微任务

在执行上下文堆栈仅包含平台代码之前，不得调onFulfilled 或 onRejected函数，onFulfilled 和 onRejected 必须被作为普通函数调用（即非实例化调用，这样函数内部 this 非严格模式下指向 window），使用queueMicrotask或者setTimeout来实现微任务的调用

#### 5、then方法可以被调用多次

* promise状态变成fulfilled后，所有的onFulfilled回调都需要按照then的顺序执行，也就是按照注册顺序执行（实现时用数组存储多个onFulfilled的回调）
* promise状态变成rejected后，所有的onRejected回调都需要按照then的顺序执行，也就是按照注册顺序执行（实现时用数组存储多个onRejected的回调）

#### 6、then必须返回一个promise

then必须返回一个promise

```javascript
promise2 = promise1.then(onFulfilled, onRejected)
```

* onFulfilled或onRejected执行的结果是x，调用resolvePromise
* 如果onFulfilled或者onRejected执行时抛出异常e，promise2需要被reject，其reason为e
* 如果onFulfilled不是一个函数且promise1已经fulfilled，promise2以promise1的value触发onFulfilled
* 如果onRejected不是一个函数且promise1已经rejected，promise2以promise1的reason触发onRejected

 #### 7、Promise的解决过程resolvePromise

```javascript
resolvePromise(promise2, x, resolve, reject)
```

* 如果 x是当前 promise 本身（promise2和x相等），那么reject TypeError
* 如果 x是另一个 promise（即x是一个promise），那么沿用它的 state 和 result 状态
  * 如果x是pending态，那么promise必须要在pending，直到x变成fulfilled或者rejected
  * 如果x是fulfilled态，用相同的value执行promise
  * 如果x是rejected态，用相同的reason拒绝promise

* 如果x是一个object或者是一个function（不常见）
  * 首先取x.then的值，let then = x.then
  * 如果取x.then这步出错抛出e，那么以e为reason拒绝promise
  * 如果then是一个函数，将x作为函数的作用域this调用，即then.call(x, resolvePromise, rejectPromise)，第一个参数叫resolvePromise，第二个参数叫rejectPromise
    * 如果resolvePromise以y为参数被调用，则执行resolvePromise(promise2, y, resolve, reject)
    * 如果rejectPromise 以 r为参数被调用，则以r为reason拒绝 promise 
    * 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。 
    * 如果调用then抛出异常e：若 resolvePromise 或 rejectPromise 已经被调用，那么忽略，否则以e为reason拒绝promise
  * 如果then不是一个function，以x为value执行promise

* 如果x不是object或者function，以x为value执行promise

### 3、promise A+实现

#### 1、定义三种状态，设置初始态，使用class实现类

```js
const PENDING = 'pending'
const REJECTED = 'rejected'
const FULFILLED = 'fulFilled'
class MPromise{
    constructor(){
        this.status = PENDING
        this.value = null
        this.reason = null
        this.onResolvedCallbacks = [] //pending时回调函数存储
        this.onRejectedCallbacks = []
    }
}
```

#### 2、添加reject和resolve方法更改状态，执行回调

```js
reject(reason){
    if(this.status === PENDING){
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
    }
}

resolve(value){
    if(this.status === PENDING){
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
    }
}
```

#### 3、promise添加入参函数，函数同步执行，异常需reject

```js
constructor(fn){
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    try{
        fn(this.resolve.bind(this), this.reject.bind(this))
    }catch(e){
        this.reject(e)
    }
}
```

#### 4、实现then方法

​	1、入参为onFulfilled和onRejected并检查参数，如果不是function 就忽略，原样返回value或者reason

​	2、最终返回promise，根据不同状态执行onFulfilled和onRejected，执行异常则reject，执行正常则执行resovlePromise(promise2, x, resolve, reject)。注意：rejected状态执行onRejected，Fulfilled状态执行onFulfilled，pending状态时收集回调至数组，待状态变更时执行，可使用ES6的getter和setter监听状态变换并执行，也可以直接放在resolve和reject方法中回调。

​	3、onFulfilled 和 onRejected 是微任务，使用queueMicrotask包裹或setTimeout包裹 

```js
isFunction(fn){
    return typeof fn === 'function'
}

then(onFulfilled, onRejected){
    //入参为onFulfilled和onRejected并检查参数，如果不是function 就忽略，原样返回value或者reason
    onFulfilled = this.isFunction(onFulfilled) ? onFulfilled : value => value
    onRejected = this.isFunction(onRejected) ? onRejected : err => {throw err}
    //最终返回promise
    let promise2 = new MPromise((resolve, reject) => {
        //根据不同状态执行onFulfilled和onRejected，执行异常则reject，执行正常返回x则执行resovlePromise
        if(this.status === FULFILLED){
            //onFulfilled和onRejected执行是微任务
            setTimeout(()=>{
                try{
                    let x = onFulfilled(this.value)
                    this.resovlePromise(promise2, x, resolve, reject)
                }catch(e){
                    reject(e)
                }
            }, 0)
        }
        if(this.status === REJECTED){
            setTimeout(()=>{
                try{
                    let x = onRejected(this.reason)
                    this.resovlePromise(promise2, x, resolve, reject)
                }catch(e){
                    reject(e)
                }
            }, 0)
        }
		//pending状态时收集回调至数组
        if(this.status === PENDING){
            this.onResolvedCallbacks.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onFulfilled(this.value)
                        this.resovlePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)
            })

            this.onRejectedCallbacks.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onRejected(this.reason)
                        this.resovlePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)
            })
        }
    }) 
    return promise2
}
```

#### 5、resolvePromise实现

```js
resovlePromise(newPromise, x, resolve, reject){
        // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
        // 这是为了防止死循环
        if(newPromise === x){
            return reject(new TypeError('The promise and the return value are the same'))
        }

        //如果x是一个promise，那么沿用它的 state 和 result 状态
        if(x instanceof MPromise){
            x.then((y)=>{
                this.resovlePromise(newPromise, y, resolve, reject)
            }, reject)
        }

        //如果x是一个对象或者函数，不为null
        if(x !== null && (typeof x === 'object' || this.isFunction(x))){
            let then = null
            try{
                then = x.then
            }catch(e){
                reject(e)
            }

            if(this.isFunction(then)){
                //添加是否调用过的标志
                let called = false
                try{
                    then.call(x, 
                    (y)=>{
                        if(called) return
                        called = true
                        this.resovlePromise(newPromise, y, resolve, reject)
                    }, 
                    (r)=>{
                        if(called) return
                        called = true
                        reject(r)
                    })
                }catch(e){
                    if(called) return
                    reject(e)
                }
            }else{
                resolve(x)
            }
        }else{
            resolve(x)
        }
}
```

#### 7、Promise.reject和Promise.resolve及catch实现

```js
catch(onRejected){
    return this.then(null, onRejected)
}

static resolve(value){
    if(param instanceof MPromise){
        return value
    }
    return new MPromise(function(resolve){
        resolve(value)
    })
}

static reject(reason){
    return new MPromise(function(resolve, reject){
        reject(reason)
    })
}
```

#### 8、promise.race和promise.all实现

```js
race(promiseList){
    return new MPromise((resolve, reject)=>{
        if(!Array.isArray(promiseList)){
            reject('input param must be a list')
        }
        let size = promiseList.length
        if(size === 0){
            resolve()
        }else{
            for(let i=0; i<size; i++){
                MPromise.resolve(promiseList(i)).then(
                    (value)=>{
                        resolve(value)
                    },
                    (reason)=>{
                        reject(reason)
                    }
                )
            }
        }
    })
}

all(promiseList){
    return new MPromise((resolve, reject)=>{
        if(!Array.isArray(promiseList)){
            reject('input param must be a list')
        }
        let size = promiseList.length
        if(size === 0){
            resolve()
        }else{
            let count = 0
            let res = []
            for(let i=0; i<size; i++){
                MPromise.resolve(promiseList(i)).then((value)=>{
                    res[i] = value
                    if(count++ === size){
                        resolve(res)
                    }
                }).catch((reason)=>{
                    reject(reason)
                })
            }
        }
    })
}

//返回所有promise的状态和结果
allSettled(promiseList){
  return new MPromise((resolve, reject)=>{
    if(!Array.isArray(promiseList)){
      return reject(new TypeError('arguments must be an array'))
    }
    let counter =0
    const promiseNum = promiseList.length
    const resolvedArray = []
    for(let i=0; i<promiseNum; i++){
      MPromise.resolve(promiseList[i]).then(value => {
        resolvedArray[i] = {
          status: 'fulfilled',
          value
        }
      }).catch(reason =>{
        resolvedArray[i] = {
          status: 'rejected',
          reason
        }
      }).finally(()=>{
        if(counter++ == promiseNum){
          resolve(resolvedArray)
        }
      })
    }
  })
}
```

### 4、测试

使用promises-aplus-tests插件进行测试

```js
/* npm i promises-aplus-tests -g
命令行 promises-aplus-tests [js文件名] 即可验证 */
class MPromise{
    static deferred(){
        let dfd = {}
        dfd.promise = new MPromise((resolve,reject)=>{
        	dfd.resolve = resolve;
        	dfd.reject = reject;
        });
        return dfd;
	} 
}

module.exports = MPromise;
```

全量代码实现如下：

```js
const PENDING = 'pending'
const REJECTED = 'rejected'
const FULFILLED = 'fulfilled'

class MPromise{
    constructor(fn){
        this.status = PENDING
        this.value = null
        this.reason = null
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        try{
            fn(this.resolve.bind(this), this.reject.bind(this))
        }catch(e){
            this.reject(e)
        }
    }

    reject(reason){
        if(this.status === PENDING){
            this.status = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.forEach(fn => fn())
        }
    }

    resolve(value){
        if(this.status === PENDING){
            this.status = FULFILLED
            this.value = value
            this.onResolvedCallbacks.forEach(fn => fn())
        }
    }

    isFunction(fn){
        return typeof fn === 'function'
    }

    then(onFulfilled, onRejected){
        //入参为onFulfilled和onRejected并检查参数，如果不是function 就忽略，原样返回value或者reason
        onFulfilled = this.isFunction(onFulfilled) ? onFulfilled : value => value
        onRejected = this.isFunction(onRejected) ? onRejected : err => {throw err}
        //最终返回promise
        let promise2 = new MPromise((resolve, reject) => {
            //根据不同状态执行onFulfilled和onRejected，执行异常则reject，执行正常返回x则执行resovlePromise
            if(this.status === FULFILLED){
                //onFulfilled和onRejected执行是微任务
                setTimeout(()=>{
                    try{
                      let x = onFulfilled(this.value)
                      this.resovlePromise(promise2, x, resolve, reject)
                    }catch(e){
                      reject(e)
                    }
                }, 0)
            }
            if(this.status === REJECTED){
                setTimeout(()=>{
                    try{
                        let x = onRejected(this.reason)
                        this.resovlePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)
            }

            if(this.status === PENDING){
                this.onResolvedCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                          let x = onFulfilled(this.value)
                          this.resovlePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0)
                })

                this.onRejectedCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onRejected(this.reason)
                            this.resovlePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0)
                })
            }
        }) 
        return promise2
    }

    resovlePromise(promise2, x, resolve, reject){
        // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
        // 这是为了防止死循环
        if(promise2 === x){
            return reject(new TypeError('The promise and the return value are the same'))
        }

        //如果x是一个promise，那么沿用它的 state 和 result 状态
        if(x instanceof MPromise){
            x.then((y)=>{
                this.resovlePromise(promise2, y, resolve, reject)
            }, reject)
        
        //如果x是一个对象或者函数，不为null
        } else if(x !== null && (typeof x === 'object' || this.isFunction(x))){
            let then = null
            try{
                then = x.then
            }catch(e){
                reject(e)
            }

            if(this.isFunction(then)){
                //添加是否调用过的标志
                let called = false
                try{
                    then.call(x, 
                    (y)=>{
                        if(called) return
                        called = true
                        this.resovlePromise(promise2, y, resolve, reject)
                    }, 
                    (r)=>{
                        if(called) return
                        called = true
                        reject(r)
                    })
                }catch(e){
                    if(called) return
                    reject(e)
                }
            }else{
                resolve(x)
            }
        }else{
            resolve(x)
        }
    }

    catch(onRejected){
        return this.then(null, onRejected)
    }

    static resolve(value){
        if(param instanceof MPromise){
            return value
        }
        return new MPromise(function(resolve){
            resolve(value)
        })
    }

    static reject(reason){
        return new MPromise(function(resolve, reject){
            reject(reason)
        })
    }

    race(promiseList){
        return new MPromise((resolve, reject)=>{
            if(!Array.isArray(promiseList)){
                reject('input param must be a list')
            }
            let size = promiseList.length
            if(size === 0){
                resolve()
            }else{
                for(let i=0; i<size; i++){
                    MPromise.resolve(promiseList(i)).then(
                        (value)=>{
                            resolve(value)
                        },
                        (reason)=>{
                            reject(reason)
                        }
                    )
                }
            }
        })
    }

    all(promiseList){
        return new MPromise((resolve, reject)=>{
            if(!Array.isArray(promiseList)){
                reject('input param must be a list')
            }
            let size = promiseList.length
            if(size === 0){
                resolve()
            }else{
                let count = 0
                let res = []
                for(let i=0; i<size; i++){
                    MPromise.resolve(promiseList(i)).then((value)=>{
                        res[i] = value
                        if(count++ === size){
                            resolve(res)
                        }
                    }).catch((reason)=>{
                        reject(reason)
                    })
                }
            }
        })
    }

    static deferred(){
        let dfd = {}
        dfd.promise = new MPromise((resolve,reject)=>{
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd;
    }
}

module.exports = MPromise;
```



 