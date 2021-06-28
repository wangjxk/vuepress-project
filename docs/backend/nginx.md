# nginx总结

> 参考资料:
>
> 1、[nginx反向代理location和proxy_pass参数](https://www.hangge.com/blog/cache/detail_2979.html)
>
> 2、[nginx之proxy_redirect详解](https://blog.csdn.net/u010391029/article/details/50395680)
>
> 3、[Nginx面试题](https://blog.csdn.net/weixin_43122090/article/details/105461971)
>
> 4、[Nginx配置文件详解](https://blog.csdn.net/wangbin_0729/article/details/82109693)
>
> 5、[Nginx配置文件解析](https://blog.csdn.net/tjcyjd/article/details/50695922)

## 1、简介

### 1、nginx简介

Nginx是一个轻量级、高性能的反向代理Web服务器，他实现非常高效的反向代理、负载平衡，他可以处理2-3万并发连接数，官方监测能支持5万并发。

### 2、优缺点

* 优点
  * 占内存小，高并发处理响应快：开启10个nginx才占150M内存、2-3万并发连接数
  * 配置简单，功能强大：可实现http服务器、虚拟主机、反向代理、负载均衡
  * 稳定性高，节省带宽：宕机的概率非常小，支持GZIP压缩，可以添加浏览器本地缓存
* 缺点：nginx处理静态文件好,耗费内存少，动态处理差例如处理动态页面，一般前端用nginx作为反向代理抗住压力

### 3、应用场景

* http服务器：可以独立提供http服务，做网页静态服务器。
* 虚拟主机：可以实现在一台服务器虚拟出多个网站，例如个人网站使用的虚拟机。
* 反向代理，负载均衡：当网站的访问量达到一定程度后，单台服务器不能满足用户的请求时，需要用多台服务器集群可以使用nginx做反向代理。并且多台服务器可以平均分担负载，不会应为某台服务器负载高宕机而某台服务器闲置的情况。
* 安全控制：可以配置安全管理、比如防sql注入，比如可以使用Nginx搭建API接口网关，对每个接口服务进行拦截。

### 3、正向与反向代理

* 正向代理（发送请求方的代理）
  * 正向代理屏蔽客户端，当我们想要访问外网时，先经过正向代理服务器，去帮我们访问互联网
  * 正向代理可以添加访问资源的控制策略
* 反向代理（服务接收方的代理）
  * 反向代理屏蔽服务器，当外网想访问我们的服务器时，先访问反向代理服务器，再转发到我们的服务器
  * 对服务器起到保护作用，隐藏源服务器的存在和特性，用于安全控制，可充当互联网云和web服务器的中间层
  * 应用：解决“同源策略”造成的跨域问题，浏览器发送请求后，统一被nginx反向代理服务器接收，不同路由通过location+upstream进行分发给后端的业务处理服务器进行处理

## 2、nginx配置

### 1、程序目录结构

```shell
[root@localhost ~]# tree /usr/local/nginx
/usr/local/nginx
├── client_body_temp
├── conf                             # Nginx所有配置文件的目录
│   ├── fastcgi.conf                 # fastcgi相关参数的配置文件
│   ├── fastcgi.conf.default         # fastcgi.conf的原始备份文件
│   ├── fastcgi_params               # fastcgi的参数文件
│   ├── fastcgi_params.default       
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types                   # 媒体类型
│   ├── mime.types.default
│   ├── nginx.conf                   # Nginx主配置文件
│   ├── nginx.conf.default
│   ├── scgi_params                  # scgi相关参数文件
│   ├── scgi_params.default  
│   ├── uwsgi_params                 # uwsgi相关参数文件
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp                     # fastcgi临时数据目录
├── html                             # Nginx默认站点目录
│   ├── 50x.html                     # 错误页面优雅替代显示文件，例如当出现502错误时会调用此页面
│   └── index.html                   # 默认的首页文件
├── logs                             # Nginx日志目录
│   ├── access.log                   # 访问日志文件
│   ├── error.log                    # 错误日志文件
│   └── nginx.pid                    # pid文件，Nginx进程启动后，会把所有进程的ID号写到此文件
├── proxy_temp                       # 临时目录
├── sbin                             # Nginx命令目录
│   └── nginx                        # Nginx的启动命令
├── scgi_temp                        # 临时目录
└── uwsgi_temp                       # 临时目录
```

### 2、配置文件

#### 1、总体简介

nginx.conf由多个块组成，最外面的块是main，main包含Events和HTTP，HTTP包含upstream和多个Server，Server又包含多个location：main（全局设置）、server（主机设置）、upstream（负载均衡服务器设置）和 location（URL匹配特定位置的设置）。

- main块设置的指令将影响其他所有设置；
- server块的指令主要用于指定主机和端口；
- upstream指令主要用于负载均衡，设置一系列的后端服务器；
- location块用于匹配网页位置。

这四者之间的关系式：server继承main，location继承server，upstream既不会继承其他设置也不会被继承。
在这四个部分当中，每个部分都包含若干指令，这些指令主要包含Nginx的主模块指令、事件模块指令、HTTP核心模块指令，同时每个部分还可以使用其他HTTP模块指令，例如Http SSL模块、HttpGzip Static模块和Http Addition模块等。

<img src="/img/nginxconf.png">

```shell
user root;                        #主模块指令，指定Nginx Worker进程运行用户以及用户组
worker_processes  auto；          #指定nginx要开启的进程树，每个进程平均耗费10M-12M内存，建议和cpu的数量一致
error_log  /data/nginx/log/error.log;  #全局错误日志文件,日志输出级别有debug、info、notice、warn、error、crit可供选择
pid /data/nginx/log/nginx.pid;    #用来指定进程pid（进程标识符）的存储文件位置

# 事件区块开始
events {                            
    worker_connections  1024；      # 每个worker进程支持的最大连接数
}

# HTTP区块开始
http {                              
    include       mime.types；      # Nginx支持的媒体类型库文件，类型由mime.type文件定义
    default_type  text/plain；      # 默认的媒体类型
    sendfile        on；       		 # 开启高效传输模式
    keepalive_timeout  65；       	 # 连接超时
    server_tokens off;              # 关闭nginx版本提示
    client_max_body_size 50m;       # 设置允许客户端请求的最大的单个文件字节数
    gzip on;                        # 开启gzip压缩输出，减少网络传输
    
    #log_format是Nginx的HttpLog模块指令，用于指定Nginx日志的输出格式， main和log404为此日志输出格式的名称
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';
    log_format log404 '$status [$time_local] $remote_addr $host$request_uri $sent_http_location';

		#指定了一个负载均衡器的名称subloanIntrantDomain,在后面需要的地方直接调用即可。
    upstream subloanIntrantDomain { #默认策略为轮训
    		ip_hash;
    		#hash $request_uri;
    	  server 122.70.77.84:9081;
    	  server 122.70.77.84:9090 down;   #当前的server暂时不参与负载均衡
    	  #允许请求失败的次数3,当超过最大次数时，返回proxy_next_upstream 模块定义的错误；
    	  #在经历了max_fails次失败后，暂停服务的时间20s
    	  server 122.70.77.84:9091 max_fails=3 fail_timeout=20s; 
    }
    
    # 第一个Server区块开始，表示一个独立的虚拟主机站点
    server {            								
        listen       80；      							# 提供服务的端口，默认80
        server_name  localhost；       			# 提供服务的域名主机名
        
        #设置日志按照时间进行分割，$year-$month-$day-$hour-access.log定义按天进行分割
        if($time_iso8601 ~ "^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})"){
        	 set $year $1;
        	 set $month $2;
        	 set $day $3;
        	 set $hour $4;
        	 set $minutes $5;
        	 set $seconds $6;
        }
        #access_log用来指定此虚拟主机的访问日志存放路径，最后的main用于指定访问日志的输出格式
        access_log /data/nginx/log/$year-$month-$day-$hour-access.log main;
        
        # 第一个location区块开始，动态请求
        location ^~ /ICBCWAPBankB7HR/api/ {
        	proxy_http_version 1.1;
        	proxy_set_header Host $host;
        	proxy_set_header X-Real-IP $remote_addr;   #记录客户端ip，被HTTP代理用来表示与它产生TCP连接的设备IP
        	proxy_set_header X-Forwarder-For $proxy_add_x_forwarded_for; #记录HTTP请求端真实IP
        	#以上三行，目的是将代理服务器收到的用户的信息传到真实服务器上
        	proxy_set_header Accept-Encording '';
        	proxy_set_header Connection "Keep-Alive";
        	proxy_pass http://subloanIntrantDomain/ICBCWAPBankB7HR/;
        	proxy_redirect off;
        }
        
         # 第二个location区块开始，静态页面
        location ^~ /ICBCWAPBankB7HR/ {
          alias /data/nginx/client/;   #http://xxxx/ICBCWAPBankB7HR/ ->访问：/data/nginx/client/
          index index.html;    # 默认的首页文件，多个用空格分开
          add_header X-Frame-options 'SAMEORIGIN'; #同源可在 <frame>, </iframe> 或者 <object> 中展现
          #启用XSS过滤，如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载
          add_header X-XSS-Protection '1;mode=block'; 
          add_header X-Content-Type-Options 'nosniff';
          expires 4h;  #缓存4h
        }
      									
        error_page   403  /error.html；     		# 出现对应的http状态码时，使用error.html回应客户
        
        # location区块开始，访问50x.html
        location = /err.html {          		
            root /ICBCWAPBankB7HR；      			# 指定对应的站点目录为html
        }
    }
    
    ##安全控制，防sql注入以及xss
    if($request_method !~* GET|POST|PUT|DELETE){
    	return 444;
    }
    .....
}
```

#### 2、location描述

location指令的作用是根据用户请求的URI来执行不同的应用，也就是根据用户请求的网站URL进行匹配，匹配成功即进行相关的操作。location支持正则表达式匹配，也支持条件判断匹配，用户可以通过location指令实现Nginx对动、静态网页进行过滤处理。使用location URL匹配配置还可以实现反向代理，用于实现PHP动态解析或者负载负载均衡。

* 语法

| 匹配符 | 匹配规则                     | 优先级 |
| ------ | ---------------------------- | ------ |
| =      | 精确匹配                     | 1      |
| ^~     | 以某个字符串开头             | 2      |
| ~      | 区分大小写的正则匹配         | 3      |
| ~*     | 不区分大小写的正则匹配       | 4      |
| !~     | 区分大小写不匹配的正则       | 5      |
| !~*    | 不区分大小写不匹配的正则     | 6      |
| /      | 通用匹配，任何请求都会匹配到 | 7      |

```nginx
#优先级1,精确匹配，根路径，eg：https://baidu.com.cn/
location =/ {
  return 400;
}

#优先级2,以某个字符串开头, 从域名开始以av开头的，优先匹配这里，区分大小写，～代表输入字符
#eg: https://baidu.com.cn/av/login/匹配，https://baidu.com.cn/login/av不匹配
#root实际访问路径：https://baidu.com.cn/data/av/av/
location ^~ /av {
  root /data/av/;
}

#优先级3，区分大小写的正则匹配，匹配/media*****路径
location ~ /media {
  alias /data/static/;
}

#优先级4 ，不区分大小写的正则匹配，所有的****.jpg|gif|png 都走这里
location ~* .*\.(jpg|gif|png|js|css)$ {
  root  /data/av/;
}

#优先7，通用匹配
location / {
  return 403;
}
```

* 常用指令
  * proxy_pass：代理转发
    * url加上/为绝对路径，则 Nginx不会把 location 中匹配的路径部分加入代理 uri
    * url不加/，则 Nginx会把 location 中匹配的路径部分加入代理 uri
  * proxy_redirect：修改被代理服务器返回的响应头中的location头域跟refresh头域数值
    * 值为：default|off|redirect replacement
      * default：默认
      * off：禁止所有的proxy_redirect指令
    * 代替的字段中可以不写服务器名，使用\ ，使用服务器的基本名称和端口
  * nginx指定文件路径有两种方式root和alias，root与alias主要区别在于nginx如何解释location后面的uri，这会使两者分别以不同的方式将请求映射到服务器文件上,说白了就是两者拼接文件路径的手段不一样。
    * root的处理结果是：root路径＋location路径
    * alias的处理结果是：使用alias路径替换location路径

```nginx
server {
  listen   80;
  server_name  www.boke.com;
  location / {
    //重定向至该地址和端口
    proxy_pass http://192.168.1.154:8080; 
    //修改返回的响应头中的location
    proxy_redirect http://192.168.1.154:8080/wuman/  http://www.boke.com/wuman/;
  }
}

#测试
[root@localhost nginx]# curl -I http://www.boke.com/wuman
HTTP/1.1 301 Moved Permanently
Server: nginx
Date: Thu, 24 Dec 2015 12:08:34 GMT
Content-Type: text/html; charset=iso-8859-1
Connection: keep-alive
Location: http://www.boke.com/wuman/
```

#### 3、负载均衡配置

upstream是Nginx的HTTP Upstream模块，这个模块通过一个简单的调度算法来实现客户端IP到后端服务器的负载均衡。

Nginx的负载均衡模块目前支持4种调度算法，后两项属于第三方的调度方法。

- 轮询（默认）：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器宕机，故障系统被自动剔除，使用户访问不受影响；
- Weight：指定轮询权值，Weight值越大，分配到的访问机率越高，主要用于后端每个服务器性能不均的情况下；
- ip_hash：每个请求按访问IP的hash结果分配，这样来自同一个IP的访客固定访问一个后端服务器，有效解决了动态网页存在的session共享问题；
- fair：比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx本身是不支持fair的，如果需要使用这种调度算法，必须下载Nginx的upstream_fair模块；
- url_hash：按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx本身是不支持url_hash的，如果需要使用这种调度算法，必须安装Nginx 的hash软件包。

在HTTP Upstream模块中，可以通过server指令指定后端服务器的IP地址和端口，同时还可以设定每个后端服务器在负载均衡调度中的状态。常用的状态有：

- down：表示当前的server暂时不参与负载均衡；
- backup：预留的备份机器。当其他所有的非backup机器出现故障或者忙的时候，才会请求backup机器，因此这台机器的压力最轻；
- max_fails：允许请求失败的次数，默认为1。当超过最大次数时，返回proxy_next_upstream 模块定义的错误；
- fail_timeout：在经历了max_fails次失败后，暂停服务的时间。max_fails可以和fail_timeout一起使用。

注意，当负载调度算法为ip_hash时，后端服务器在负载均衡调度中的状态不能是weight和backup。

#### 4、使用变量解析

* 日志格式设置：
  * $remote_addr与$http_x_forwarded_for用以记录客户端的ip地址；
  * $remote_user：用来记录客户端用户名称；

  * $time_local： 用来记录访问时间与时区；

  * $request： 用来记录请求的url与http协议；

  * $status： 用来记录请求状态；成功是200，

  * $body_bytes_sent ：记录发送给客户端文件主体内容大小；

  * $http_referer：用来记录从那个页面链接访问过来的；

  * $http_user_agent：记录客户浏览器的相关信息；

  通常web服务器放在反向代理的后面，这样就不能获取到客户的IP地址了，通过$remote_add拿到的IP地址是反向代理服务器的iP地址。反向代理服务器在转发请求的http头信息中，可以增加x_forwarded_for信息，用以记录原有客户端的IP地址和原来客户端的请求的服务器地址。

* 其他变量

  $args此变量与请求行中的参数相等

  $content_length等于请求行的“Content_Length”的值。

  $content_type等同与请求头部的”Content_Type”的值

  $document_root等同于当前请求的root指令指定的值

  $document_uri与$uri一样

  $host与请求头部中“Host”行指定的值或是request到达的server的名字（没有Host行）一样

  $limit_rate允许限制的连接速率

  $request_method等同于request的method，通常是“GET”或“POST”

  $remote_addr客户端ip

  $remote_port客户端port

  $remote_user等同于用户名，由ngx_http_auth_basic_module认证

  $request_filename当前请求的文件的路径名，由root或alias和URI request组合而成

  $request_body_file

  $request_uri含有参数的完整的初始URI

  $query_string与$args一样

  $sheeme http模式（http,https）尽在要求是评估例如

  Rewrite ^(.+)$ $sheme://example.com$; Redirect;

  $server_protocol等同于request的协议，使用“HTTP/或“HTTP/

  $server_addr request到达的server的ip，一般获得此变量的值的目的是进行系统调用。为了避免系统调用，有必要在listen指令中指明ip，并使用bind参数。

  $server_name请求到达的服务器名

  $server_port请求到达的服务器的端口号

  $uri等同于当前request中的URI，可不同于初始值，例如内部重定向时或使用index

### 3、常用命令

```shell
nginx -t  #检测配置文件是否有语法错误，然后退出
nginx -s reopen #重启Nginx
nginx -s reload #重新加载Nginx配置文件，然后以优雅的方式重启Nginx
nginx -s stop #强制停止Nginx服务
nginx -s quit #优雅地停止Nginx服务（即处理完所有请求后再停止服务）
nginx -v #显示版本信息并退出
killall nginx  #杀死所有nginx进程
```

### 4、http头部解析

#### 1、X-Frame-Options

HTTP 响应头是用来给浏览器指示允许一个页面可否在 `<frame>`, `</iframe>` 或者 `<object> `中展现的标记

* DENY：表示该页面不允许在frame中展示，即便是在相同域名的页面中嵌套也不允许。

* SAMEORIGIN：表示该页面可以在相同域名页面的frame中展示。

* ALLOW-FROM uri：表示该页面可以在指定来源的frame中展示

#### 2、Host、X-Real-IP、X-Forwarder-For

参考资料：[HTTP X-Forwarded-For 介绍](https://www.runoob.com/w3cnote/http-x-forwarded-for.html)

X-Forwarded-For 是一个 HTTP 扩展头部。HTTP/1.1（RFC 2616）协议并没有对它的定义，它最开始是由 Squid 这个缓存代理软件引入，用来表示 HTTP 请求端真实 IP。

XFF 的内容由「英文逗号 + 空格」隔开的多个部分组成，最开始的是离服务端最远的设备 IP，然后是每一级代理设备的 IP。

如果一个 HTTP 请求到达服务器之前，经过了三个代理 Proxy1、Proxy2、Proxy3，IP 分别为 IP1、IP2、IP3，用户真实 IP 为 IP0，那么按照 XFF 标准，服务端最终会收到以下信息：

```
X-Forwarded-For: IP0, IP1, IP2
```

X-Real-IP 通常被 HTTP 代理用来表示与它产生 TCP 连接的设备 IP，这个设备可能是其他代理，也可能是真正的请求端。需要注意的是，X-Real-IP 目前并不属于任何标准，代理和 Web 应用之间可以约定用任何自定义头来传递这个信息。

#### 3、X-XSS-Protection

HTTP **`X-XSS-Protection`** 响应头是 Internet Explorer，Chrome 和 Safari 的一个特性，当检测到跨站脚本攻击 ([XSS (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting))时，浏览器将停止加载页面。

```
X-XSS-Protection: 0
X-XSS-Protection: 1
X-XSS-Protection: 1; mode=block
X-XSS-Protection: 1; report=<reporting-uri>
```

- 0

  禁止XSS过滤。

- 1

  启用XSS过滤（通常浏览器是默认的）。 如果检测到跨站脚本攻击，浏览器将清除页面（删除不安全的部分）。

- 1;mode=block

  启用XSS过滤。 如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载。

- 1; report=`<reporting-URI> `(Chromium only)

  启用XSS过滤。 如果检测到跨站脚本攻击，浏览器将清除页面并使用CSP [report-uri (en-US)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri)指令的功能发送违规报告。

#### 4、X-Content-Type-Options

`X-Content-Type-Options` HTTP 消息头相当于一个提示标志，被服务器用来提示客户端一定要遵循在 [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) 首部中对 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 的设定，而不能对其进行修改。这就禁用了客户端的 [MIME 类型嗅探](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#MIME_sniffing)行为，换句话说，也就是意味着网站管理员确定自己的设置没有问题。

```html
X-Content-Type-Options: nosniff
```

下面两种情况的请求将被阻止：

- 请求类型是"`style`" 但是 MIME 类型不是 "`text/css`"，
- 请求类型是"`script`" 但是 MIME 类型不是 [JavaScript MIME 类型](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type)

#### 5、Cache-control、Expires、max-age

* Cache-control 用于控制HTTP缓存（在HTTP/1.0中可能部分没实现，仅仅实现了 Pragma: no-cache）
* Expires 表示存在时间，允许客户端在这个时间之前不去检查（发请求），等同max-age的效果。但是如果同时存在，则被Cache-Control的max-age覆盖。

```http
Respense Headers
cache-control: max-age=2592000           缓存的持续时间
expires: Thu, 04 Apr 2019 09:22:20 GMT   缓存的到期时间
```

