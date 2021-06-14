# Hybrid开发及原理

## 1、Hybrid开发

* Hybrid开发：原生app嵌入web页面的开发模式
* jsBidge：原生app与web页面的交互沟通桥梁，一种通信方式，类比于JSONP的交互方式，只是类比的对象放到了js与native身上，native通过桥调用js的一些方法，js也能通过桥调用js的一些方法和功能。

## 2、Js调用Native

### 1、注入api方式

通过webview提供的接口，向JavaScript的window中注入对象或方法，让js调用时，直接执行相应的Native代码逻辑。webview在native中，native可控制webview。

* 后段注入api：jsSendMessage

```java
//ios：使用UIWebView
JSContext *context = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"]; context[@"jsSendMessage"]=getJsData;

//andriod：使用addJavascriptInterface接口
class getJsData { 
  /* Android4.2之前addJavascriptInterface接口存在注入漏洞，升级后增加了JS只 能访问带有 @JavascriptInterface注解的Java函数的限制，在本地定义的提供给 JS调用的接口都需要增加@android.webkit.JavascriptInterface声明 */
		@JavascriptInterface //标注的方法里面是子线程，而不是主线程 
    public String getNativeData() { 
      return "nativeData"; 
    }
}
webView.addJavascriptInterface(getJsData, "jsSendMessage");
```

* 前端调用native

```js
window.jsSendMessage(message)  //ios
window.jsSendMessage.getNativeData()  //andriod
```

### 2、拦截URL Scheme

* 浏览器输入url即可打开app：weixin://

* 协议类型：`scheme(应用标识)：//[path](行为即应用的某个功能)[?query](功能需要的参数)`
* 后端代码：约定bridge://loaded

```java
//ios操作
(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{ 
  if ([request.URL.absoluteString hasPrefix:@"bridge://loaded"]) { 
    //执行native端的一些操作 
    return NO; //返回NO是为了不再执行点击原链接的跳转 
  }
  return YES; 
}

//andriod：使用shouldOverrideUrlLoading方法对url协议进行解析
webView.setWebViewClient(new WebViewClient(){ 
  @Override 
  public boolean shouldOverrideUrlLoading(WebView view, String url) { 
    if (isNativeUrl(url)) { 
      // 执行native端的一些操作 
      return true; 
    } 
  } 
})
```

* 前端操作：直接请求定义好的bridge://loaded 协议就能触发native端的拦截

```js
<a href="bridge://loaded"> 触发app </a>
```

* 缺点：目前不建议只使用拦截url scheme解析参数的形式，主要存在如下问题：
  * 连续调用location.href会出现消息丢失，因为webview限制了连续跳转，会过滤掉后续的请求
  * url会有长度限制，一旦过长就会出现信息丢失，一般结合注入api的形式一起使用

## 3、Native调用Js

* 调用UIWebView的stringByEvaluatingJavaScriptFromString:方法

* 调用WKWebView的evaluateJavaScript:completionHandler:方法
* 调用WebView.loadUrl()方法

```java
//ios适用于UIWebView和WKWebView
[self.webView stringByEvaluatingJavaScriptFromString:@"jsFunction('发送给js的数据')"]; 
//WKWebView 
[webView evaluateJavaScript:@"jsFunction('我是ios')" completionHandler:^(id item, NSError * _Nullable error) { // Block中处理是否通过了或者执行JS错误的代码 
}];

//andriod
public void javaCallJS(){ 
  webView.loadUrl("javascript:jsFunction('我是Android')"); 
}
```

## 4、现有开源解决方案

* iOS：WebViewJavascriptBridge
* andriod：JsBridge
* andriod在启动webview时加载脚步，ios在webview发送scheme请求时加载脚步

<img src="./img/jsbridge.png"/>

```js
//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
(function() {
    // 错误优先-判断是否WebViewJavascriptBridge已经被注册好
    if (window.WebViewJavascriptBridge) {
        return;
    }
    //native传过来的回调队列
    var receiveMessageQueue = [];
    // 提供给native调js的 key=>handlerName（就是native端定义的函数名）  value=>页面注册的回调函数（就是页面调用native端方法 registerHandler时候的回调函数）
    var messageHandlers = {};
    // 页面调用native使用 key=>callbackId (页面生成的唯一标示供native找到的函数) value=>页面提供native调用的函数
    var responseCallbacks = {};
    var uniqueId = 1;

    //set default messageHandler  初始化默认的消息线程
    //init方法就是执行一遍native传给页面的回调队列-receiveMessageQueue队列
    function init(messageHandler) {
        if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        WebViewJavascriptBridge._messageHandler = messageHandler;
        var receivedMessages = receiveMessageQueue;
        receiveMessageQueue = null;
        for (var i = 0; i < receivedMessages.length; i++) {
              // 将native传过来的队列依次执行一遍
            _dispatchMessageFromNative(receivedMessages[i]);
        }
    }

    // 发送
    // 直接调用native中的send方法
    function send(data, responseCallback) {
        _doSend('send', data, responseCallback);
    }

    /**
     * 页面提供函数为native调用的
     * @param { string } handlerName native中定义的方法名
     * @param { Function } handler 用来接收native方法执行完得到返回值的页面回调函数
     */
    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }
    /**
     * 页面调用native的方法
     * @param { string } handlerName native中定义的方法名
     * @param { string } data 页面中函数体所需要的参数
     * @param { Function } responseCallback 页面中函数体
     */
    function callHandler(handlerName, data, responseCallback) {
        // 如果方法不需要参数，只有回调函数，简化JS中的调用
        if (arguments.length == 2 && typeof data == 'function') {
			responseCallback = data;
			data = null;
		}
        _doSend(handlerName, data, responseCallback);
    }
    callHandler('nativeMethod',function(data){
        console.log(data)
    })
    //sendMessage add message, 触发native处理 sendMessage
    /** 
     * @param { string } handlerName 页面中函数名
     * @param { string } message 页面中函数体所需要的参数
     * @param { Function } responseCallback 页面中函数体
     */
    function _doSend(handlerName, message, responseCallback) {
        var callbackId;
        if(typeof responseCallback === 'string'){
            callbackId = responseCallback;
        } else if (responseCallback) {
            callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
        }else{
            // 没有回调时候
            callbackId = '';
        }
        try {
             var fn = eval('window.android.' + handlerName);
         } catch(e) {
             console.log(e);
         }
         if (typeof fn === 'function'){
             var responseData = fn.call(this, JSON.stringify(message), callbackId);
             if(responseData){
              console.log('response message: '+ responseData);
                 responseCallback = responseCallbacks[callbackId];
                 if (!responseCallback) {
                     return;
                  }
                 responseCallback(responseData);
                 delete responseCallbacks[callbackId];
             }
         }
    }

    //提供给native使用,
    function _dispatchMessageFromNative(messageJSON) {
        setTimeout(function() {
            var message = JSON.parse(messageJSON);
            var responseCallback;
            //java call finished, now need to call js callback function 
            //页面调native 执行回调
            if (message.responseId) {
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(message.responseData);
                delete responseCallbacks[message.responseId];
            } else {
                 //有callbackId直接发送
                if (message.callbackId) {
                    var callbackResponseId = message.callbackId;
                    responseCallback = function(responseData) {
                        _doSend('response', responseData, callbackResponseId);
                    };
                }
                //messageHandlers中有对应回调就执行没有其实执行的是init()方法所传入的的回调
                var handler = WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                //查找指定handler
                try {
                    handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console != 'undefined') {
                        console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                    }
                }
            }
        });
    }

    //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromNative(messageJSON) {
        console.log('handle message: '+ messageJSON);
        if (receiveMessageQueue) {
            receiveMessageQueue.push(messageJSON);
        }
        _dispatchMessageFromNative(messageJSON);

    }

    var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
        init: init,
        send: send,
        registerHandler: registerHandler,
        callHandler: callHandler,
        _handleMessageFromNative: _handleMessageFromNative
    };

    var doc = document;
    var readyEvent = doc.createEvent('Events');
    var jobs = window.WVJBCallbacks || [];
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    window.WVJBCallbacks = []
    jobs.forEach(function (job) {
        job(WebViewJavascriptBridge)
    })
    doc.dispatchEvent(readyEvent);
})();

```

