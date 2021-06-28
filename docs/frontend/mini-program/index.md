# 微信小程序
> 资料：[微信官方文档-小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 1、简介

灰度更新和线上版本回退功能：按客户等维度发布
* 双线程架构：视图线程和逻辑线程，两线程通过WeixinJSBridge与native通信
* WXS(视图线程，不能调用js\WXML\WCSS\js(setData),初始化数据使用setData，后续不于后台交互使用wxs
* 视图组件和原生组件：原生组件放在视图组件上方

## 2、组件解析

### 1、web-view组件

* 限定企业账户使用，需设置业务域名，域名下的h5页面才可正常使用。
* web-view组件和小程序隔离，只能通过url传递参数。
* 无法使用原生组件覆盖，使用js-sdk在H5页面实现功能。

#### 1、判断是否在小程序环境

* js-sdk
* localStorage塞入取出变量
* 判断user-agent

#### 2、鉴权方式

* HTTP Basic Authentication
* session-cookie（后端/灰度）
* token(JWT)
* OAuth（一键登录）

wx.login\wx.checkSession\wx.request

#### 3、h5与小程序通信

h5：postMessage发送消息

小程序：wx.miniProgram.postMessage获取信息

#### 4、调试

开发工具可使用调试工具

手机：vConsole

## 3、双重登录态

### 1、三种状态

访客态、游客态、会员态

* 访客态：未授权用户信息，未静默登录
* 游客态：授权用户信息，进行静默登录
* 会员态：授权手机号或使用账号密码登录，使用手机号进行账号关联

### 2、静默登录

#### 1、登录流程

利用小程序登录机制，实现静默登录，对客户无感。

<img src="/img/minip-login.jpg">

* 小程序：调用 wx.login() 获取临时登录凭证code ，并回传到开发者服务器。
  * code有效率期5min，短时间内多次获取code值不变，有缓存

* 小程序：使用wx.request调用开发者服务器接口，上送code值。

* 开发者服务器：调用auth.code2Session接口进行登录请求，获取 **用户唯一标识 OpenID** 、 用户在微信开放平台帐号下的**唯一标识UnionID**（若当前小程序已绑定到微信开放平台帐号） 和 **会话密钥 session_key**。

  * 登录凭证校验接口：`https://api.weixin.qq.com/sns/jscode2session`
  * 上送：code + appid + appSecret
  * 接收：openid + session_key + unionid

  * 会话密钥 `session_key` 是对用户数据进行加密签名的密钥。为了应用自身的数据安全，开发者服务器**不应该把会话密钥下发到小程序，也不应该对外提供这个密钥**，code登录后会失效。

* 开发者服务器：使用openid + unionid + session_key建立登录态，使用token鉴权或session鉴权，返回token或者sessionid。
* 小程序：将鉴权信息token或sessionid存入storage中，后续调用接口时携带鉴权信息。
* 开发者服务器：根据上送鉴权信息，校验成功后，回传数据。

#### 2、api解析

* openid和unionid
  * openid
    * 客户在某一应用下的唯一标识：同一平台，不同应用，编号不同
    * 通过后台调用auth.code2Session登录凭证校验接口获取
  * unionid
    * 客户在同一个微信开放平台下的唯一标识：同一平台，不同应用，编号相同
    * 当前小程序已绑定到微信开放平台帐号可通过后台调用auth.code2Session接口获取
    * 前期通过getUseInfo获取，目前可通过wx.login获取，接口隔离

* wx.getUserInfo
  * 存量：获取用户信息，获取unionid
  * 现状：匿名头像昵称、默认性别地区、加密后的身份认证
* wx.getUserProfile
  * 弹出个人信息授权弹框
  * 成功后获取用户信息、调用失败
* wx.login
  * 获取code
  * 获取unionid

#### 3、超时处理

* 小程序到开发服务器认证超时：校验sessionkey，重新进行登录或重新发起请求
* 开发者服务器到wx服务器认证超时：重新发起请求
* 小程序到开发者服务器登录后交易超时：重新发送请求即可

参考资料：[小程序的登录与静默续期](https://www.cnblogs.com/wangsky/p/11023616.html)

### 3、用户登录

操作具体业务，需要会员及用户体系时，添加用户登录流程，弹出登录弹框，通常使用微信一键登录或账号密码登录两种方式，一般使用手机号进行用户体系关联。

* 微信一键登录：提示用户授权手机号使用，getPhoneNumber
  * 授权使用手机号，则用手机号进行账号关联绑定，进行登录操作
  * 未授权使用手机号，登录失败，跳转至登录弹框

* 账号密码登录：使用账号和密码认证登录
  * 登录成功后，进行账号关联绑定
  * 登录失败返回登录弹框

### 4、用户体系

账号saas系统中，同一账号关联：账号体系、套餐、动态权限等，同一账号查找不同属性。

## 4、支付宝小程序 & 微信小程序

### 1、app.json

#### 1、小程序的通用设置

状态栏、导航条、标题、窗口背景色

* 微信

```js
  window: {
      "backgroundTextStyle": "light",
      // ……
  }
```

* 支付宝

```js
  window: {
      "default": "light",
      // ……
  }
```

#### 2、tabBar

* 区别

```js
  tabBar: {
      // 支付宝
      items: [],
      // 微信
      list: []
  }
```

### 2、pages

#### 1、文件名

* 支付宝: axml + acss
* 微信： wxml + wxss

#### 2、视图页面axml、wxml

##### 1、事件

* 支付宝 onTap\catchTap
* 微信 bindtap\catchtouchstart

##### 2、列表的渲染

* 支付宝

```js
  a:for="{{list}}" key="item-{{index}}" index="index"
```

* 微信

```js
  wx:for="{{list}}" wx:key="key" wx-for-item="item"
```

##### 3、条件渲染

* 支付宝

```js
  a:if
  a:else
  a:esleif
```

* 微信

```js
  wx:if
  wx:else
  wx:esleif
```

### 3、组件的不同

#### 1、showToast

* 支付宝

```js
  my.showToast({
  })
```

* 微信

```js
  wx.showToast({
  })
```

#### 2、showLoading

```js
  my.showLoading({
  })
```

* 微信

```js
  wx.showLoading({
  })
```

#### 3、request网络请求

* 支付宝

```js
my.httpRequest({
    url: '',
    method: '',
    data: {},
    header: '',
    dataType: '',
    success: function() {},
    fail: function() {}
})
```

* 微信

```js
wx.request({
    url: '',
    method: '',
    data: {},
    header: '',
    dataType: '',
    success: function() {},
    fail: function() {}
})
```

#### 4、支付

* 支付宝

```js
  my.tradePay({
      tradeNO: '47983279478923797057247185',
      success: res => {},
      fail: res => {}
  })
```

* 微信

```js
  wx.requstPayment({
      package: 'pre_pay_id',
      signType: 'MD5',
      paySign: '',
      success: res => {},
      fail: res => {}
  })
```

#### 5、获取code

* 支付宝

```js
my.getAuthCode({
    success() {
    }
})
```

* 微信

```js
wx.login({
    success() {}
})
```

## 5、微信小程序问题汇总

1. 自定义tabbar在页面存在下拉更新（scrollview）的时候，页面被下拉，tabbar也会跟着下拉。

*  提前沟通，修改为原生tabbar

2. require在小程序中不支持绝对路径，只能用相对路径去选取'../../../utils/tool.js'

```js
//app.js  
App({
      require: function($uri) {
          return require($url);
      }
})

//comp.js
const Api = app.require('utils/tool.js'); //利用require返回uri带上/
```

3. 组件引用资源路径不能解析特殊字符或汉字

* 规范文件命名

4. {{}}模板中不能执行特殊方法，只能处理简单的四则运算

```js
//期望:'34万元'
const money = 345678; 
<view>{{ money }}</view>
```

* 方案 利用wxs的format
  vue {{ money | moneyFilter }}
  wxs 实现format

```js
const fnToFixed = function(num) {
  return num.toFixed(2);
}
module.exports = {
  fnToFixed
}
<wxs src='../../../xxx.wxs' module="filters">
<view>{{ filters.fnToFixed(money) }}</view>
```

5. wxs无法使用new Date()

* 方案： 使用getDate()方法

6. setData过程中需要注意对象覆盖

```js
  data: {
      a: '1',
      b: {
        c: 2,
        d: 3
      }
  }
  //会覆盖原对象b
  this.setData({
      b: { 
        c: 4
      }
  });
  //解决办法1
  const { b } = this.data;
  b.c = 4;
  this.setData({ b });
  //解决办法2: wx-update-data库
```

7. IOS的date不支持2020-06-26格式，必须要转成2020/06/26

8. wx接口不promise，可使用wx-promise-pro库

## 6、小程序缓存

### 1、小程序缓存



### 2、h5缓存

协商缓存、强缓存

## 7、小程序框架wepy

常用框架：原生小程序、wepy(vue)、uniapp(vue)、taro(react)

* 考虑到原声api变更后，框架未及时变更情况，可使用原生小程序框架。

* 跨端和跨平台需求，建议使用小程序框架

wepy借鉴了vue语法功能，支持vue书写特征 - vue技术友好行

### 1、生命周期

wepy生命周期同原生小程序

* 应用周期
  * onLaunch 首次打开
  * onShow 初始化完成
  * onHide 切换

* 页面周期
  * onLoad 加载页面
  * onShow 前后台切换
  * onHide 前后台切换
  * onUnLoad 重定向 / 路由切换
  * onPullDownRefresh 下拉
  * onReachBottom 上拉
  * onShareAppMessage 分享
  * ……

::: details 面试题

1、小程序的生命周期

2、小程序的双线程架构

* view thread + appService thread
* notify、 sendData 对应周期

:::

### 2、数据层-数据绑定

```js
this.setData({label: 'label'}) //原生小程序
this.label = 'label1' //wepy
```

1. 如何做到监听数据改变，多次setData时候，通信次数是一次还是几次

* 在一次渲染周期内，收到多次setData的话，只会渲染一次
* jscore -> native ->web view

2. 如何优化小程序数据通信，提升页面性能

* 减少setData的调用，合并多个setData
* 与界面渲染无关的数据最好不要设置在data
* 有些数据不在页面中展示，包含复杂数据结构或者超长字符串，则不应该使用setData来设置这些数据

3. 哪些地方可以放置无关数据
4. 为什么data设置长字符串，不显示也会影响页面性能
5. wepy如何做数据绑定优化

* wepy内部实现了一个脏数据检查机制，函数执行完成之后 -> data-check
* newValue 和 oldValue做比较，如果有变化，就会加入到readyToSet的队列中，最后统一做一个setData
* 同一时间只允许一个脏值检查流程进行

6. wepy中异步数据如何更新

