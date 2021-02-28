# 1、scss

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

# 2、flex布局

## 1、参考资料

1、[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

2、[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## 2、概念

* 容器和项目：采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。
* 主轴和交叉轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

<img src="/img/flex.png"/>

## 3、属性

### 1、设置flex布局

设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效

```css
.box{
  display: flex;
}
.box{
  display: inline-flex;
}
```

### 2、容器6属性

- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

#### 1、flex-direction

设置主轴方向

```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- `row`（默认值）：主轴为水平方向，起点在左端。
- `row-reverse`：主轴为水平方向，起点在右端。
- `column`：主轴为垂直方向，起点在上沿。
- `column-reverse`：主轴为垂直方向，起点在下沿。

#### 2、flex-wrap

设置主轴元素换行

```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

* `nowrap`（默认）：不换行
* `wrap`：换行，第一行在上方
* `wrap-reverse`：换行，第一行在下方

#### 3、flex-flow

`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

#### 4、justify-content

项目在主轴上的对齐方式。

```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

- `flex-start`（默认值）：左对齐
- `flex-end`：右对齐
- `center`： 居中
- `space-between`：两端对齐，项目之间的间隔都相等。两边贴边。
- `space-around`：每个项目两侧的间隔相等。项目之间的间隔比项目与边框的间隔大一倍。两边有间隔。

#### 5、align-items

项目在交叉轴的对其方式

```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- `flex-start`：交叉轴的起点对齐。
- `flex-end`：交叉轴的终点对齐。
- `center`：交叉轴的中点对齐。
- `baseline`: 项目的第一行文字的基线对齐。
- `stretch`（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

#### 6、align-content

换行后多根轴线（主轴）的对齐方式。如果项目只有一根轴线，该属性不起作用。

```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

- `flex-start`：与交叉轴的起点对齐。
- `flex-end`：与交叉轴的终点对齐。
- `center`：与交叉轴的中点对齐。
- `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
- `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- `stretch`（默认值）：轴线占满整个交叉轴。

### 3、项目6属性

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

#### 1、order

定义项目的排列顺序。数值越小，排列越靠前，默认为0。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

#### 2、flex-grow

* 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

* 如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

#### 3、flex-shrink

* 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

* 如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
* 负值对该属性无效。

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

#### 4、flex-basis

* 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。

* 它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间。

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

#### 5、flex

* `flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

* 该属性有两个快捷值：`auto` (`1 1 auto`)（自动放大和缩小） 和 none (`0 0 auto`)（即保持不变）。

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

#### 6、align-self

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

# 3、CSS3

参考资料：html5权威指南

## 1、过渡transition

过渡效果一般是由浏览器直接改变元素的css属性实现的，过渡特性transition可控制过渡效果。

```css
transition: <transition-property> <transition-duration> <transition-timing-function><transition-delay>
```

* transition-property：指定应用过渡的属性，不设置默认全部。
* transition-duration：指定过渡的持续时间。
* transition-timing-function：指定过渡期间计算中间值的方式，ease(default)|linear|ease-in|ease-out|ease-in-out|cubic-besier(用于指定自定义曲线)。
* transition-delay：指定过渡开始之前的延时时间，单位ms或s。

```css
#banana {
    font-size: large;
    border: midium solid black;
    /* 反向过渡：由hover切回初始时的属性 */
    transition-delay: 10ms;
    transition-duration: 250ms;
}

#banana:hover {
    font-size: x-large;
    border: medium solid white;
    background-color: green;
    color: white;
    padding: 4px;
    transition-delay: 100ms;
    transition-property: background-color, color, padding, font-size, border;
    transition-duration: 500ms;
    transition-timing-function: linear;
}
```

## 2、动画animation

动画通过animation属性和@keyframes属性两部分设置

### 1、animation

* animation属性定义动画的样式
* @keyframes属性定义应用动画的属性

```css
animation: <animation-name> <animation-duration> <animation-timing-function><animation-delay><animation-iteration-count>
```

* animation-name：指定动画名称

* animation-duration：设置动画播放的持续时间
* animation-timing-function：指定计算中间动画值，，ease(default)|linear|ease-in|ease-out|ease-in-out|cubic-besier(用于指定自定义曲线)
* animation-delay：指定设置动画开始前的延迟
* animation-iteration-count：设置动画的播放次数。

除上述属性外还有2个属性控制

* animazion-direction：设置动画循环播放的时候是否反向播放，normal|alternate
* animation-play-state：允许动画暂停和重新播放，running|paused，用于设置动画播放。

### 2、@keyframes

指定动画应用属性，可使用%或from、to属性。

```css
#banana,#apple {
	animation-duration: 1500ms;
	animation-iteration-count: infinite;
	animation-direction: alternate;
	animation-timing-function: linear;
	animation-name: 'ColorSwap', 'GrowShrink'
}

@keyframes ColorSwap {
	to {
		border: medium solid white;
		background-color: green;
	}
}

@keyframes GrowShrink {
	/* 0% */
	from {
		font-size: xx-small;
		background-color: green;
	}
	
    50% {
        background-color: yellow;
        padding: 1px;
    }
    
    /* 100% */
    to {
		border: medium solid white;
		background-color: green;
	}
}
```

## 3、变换transform

使用css变换为元素应用线性变换，可以旋转、缩放、倾斜和平移某个元素。

* transform：指定应用的变换功能
* transition-origin：指定变化的起点

###1、transform

指定应用的变换功能

* 平移：translate(<长度值或百分数值>)|translateX|translateY，单方向或者两方向
* 缩放：scale(<数值>)|scaleX|scaleY
* 旋转：rotate(<角度>)，eg：rotate(-45deg)
* 倾斜：skew(<角度>)|skewX|skewY,eg：skewX(1.2)
* 自定义：matrix(4-6个数值)

###2、transition-origin

指定变化的起点

* 指定元素x轴或者y轴的起点：<%>
* 指定距离：<长度值>
* 指定x轴上位置：<left|center|right>
* 指定y轴上位置：<top|center|bottom>

```css
#banana ｛
	border: medium solid white;
	background-color: green;
	transform：rotate(-45deg) scaleX(1.2);
	transform-origin: right top;
｝
```

