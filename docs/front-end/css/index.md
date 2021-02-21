# scss

## 1、参考资料

[sass官网资料](https://www.sass.hk/guide/)

[scss菜鸟教程](https://www.runoob.com/sass/sass-tutorial.html)

## 2、css、sass、scss

* sass为css预处理语言，有严格的缩进风格，和css编写规范有着很大的出入，不使用花括号和分号。增加了变量、嵌套、混合、继承、导入等高级功能，后缀为.sass。

* scss也为css预处理器，是sass3新增的语法，兼容css3，后缀名为.scss。

## 3、scss梳理

### 1、变量

存储：字符串、数字、颜色、布尔、列表、null。

``` css
//定义
$myFont: Helvetica, sans-serif;

//引用
body {
  font-family: $myFont;
}
//局部作用域
h1 {
  $myColor: green;   // 只在 h1 里头有用，局部作用域
  color: $myColor;
}
//全局作用域
h1 {
  $myColor: green !global;  // 全局作用域
  color: $myColor;
}
```

### 2、嵌套规则与属性

``` css
//嵌套规则: nav ul
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
//嵌套属性
text: {
  align: center;
  transform: lowercase;
  overflow: hidden;
}
```

### 3、文件导入（import）和局部文件（partials）

``` css
//文件导入import：css、scss
//CSS @import 指令在每次调用时，都会创建一个额外的 HTTP 请求
//Sass @import 指令将文件包含在 CSS 中，不需要额外的 HTTP 请求。
variables.scss
@import "variables";

//局部文件partials，告知该文件无需编译为css文件
_filename.scss
@import "filename";
```

### 4、@mixin 与 @include

* @mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。

* @include 指令可以将混入（mixin）引入到文档中。

``` css
@mixin important-text {
  color: red;
  font-size: 25px;
  font-weight: bold;
  border: 1px solid blue;
}
.danger {
  @include important-text;
  background-color: green;
}

//混入中使用混入
@mixin special-text {
  @include important-text;
  @include link;
  @include special-border;
}

//混入添加变量
@mixin bordered($color, $width) {
  border: $width solid $color;
}
.myArticle {
  @include bordered(blue, 1px);  // 调用混入，并传递两个参数
}

//混入默认值
@mixin sexy-border($color, $width: 1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue); }
h1 { @include sexy-border(blue, 2in); }

//可变参数$shadows...
@mixin box-shadow($shadows...) {
      -moz-box-shadow: $shadows;
      -webkit-box-shadow: $shadows;
      box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

### 5、继承@extend

``` css
.button-basic  {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  @extend .button-basic;
  background-color: red;
}

.button-submit  {
  @extend .button-basic;
  background-color: green;
  color: white;
}
```

### 6、函数

字符串、数字、列表、选择器、映射、颜色、Introspection。

参考：[sass相关函数-菜鸟教程](https://www.runoob.com/sass/sass-functions.html)