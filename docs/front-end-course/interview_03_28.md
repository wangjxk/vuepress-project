# 2021年核心面试题详解

## 1、相关面试题

1、实现lodash中的get函数：get(data, 'a[3].b') 

```js

```

2、实现 add(1)(2)(3) 柯里化函数

```js

```

3、手写await和async

参考：[手写async await的最简实现（20行）](https://juejin.cn/post/6844904102053281806)

```js

```

4、如何优化 node 镜像制作

- DOCKER_BUILDKIT 查看 dockerfile instruction 耗时
- FROM YOUR_OLD_DOCK 基于历史最新的业务镜像构建
- COPY 等指令，充分利用 cache
- 优化 OS 大小，alpine
- npm i --only=production 移除 devDependencies
- 抽出来放 CDN 
- ...

关注一下 devOps

5、webpack 热更新原理 

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

6、 最短编辑距离算法问题：给出两个单词word1和word2，计算出将word1 转换为word2的最少操作次数，你总共三种操作方法：插入一个字符、删除一个字符、替换一个字符



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