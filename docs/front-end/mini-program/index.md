# 微信小程序
## 1、简介

灰度更新和线上版本回退功能：按客户等维度发布
* 双线程架构：视图线程和逻辑线程，两线程通过WeixinJSBridge与native通信
* WXS(视图线程，不能调用js)\WXML\WCSS\js(setData),初始化数据使用setData，后续不于后台交互使用wxs
* 视图组件和原生组件：原生组件放在视图组件上方

## 2、原生组件

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

  json web token

* OAuth（一键登录）

wx.login\wx.checkSession\wx.request

#### 3、h5与小程序通信

h5：postMessage发送消息

小程序：wx.miniProgram.postMessage获取信息

#### 4、调试

开发工具可使用调试工具

手机：vConsole

### 2、live-pusher、live-player组件



