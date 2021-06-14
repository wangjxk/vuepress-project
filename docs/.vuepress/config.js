module.exports = {
    title: 'Jian‘s blog',
    description: '每天进步一点点',
    markdown: {
      lineNumbers: true
    },
    plugins: ['@vuepress/back-to-top'],
    themeConfig: {
        logo: '/img/jian.jpeg',
        nav: [
          {
            text: 'github',
            link: 'https://github.com/wangjxk'
          },
          {
            text: 'js',
            items: [
              { text: 'js杂记', link: '/front-end/js/' },
              { text: 'Promise规范和应用', link: '/front-end/js/course_04_03_promise' },   
              { text: '浏览器对象详解', link: '/front-end/js/course_04_11_browser' },
              { text: 'ts初探', link: '/front-end/js/course_04_12_typescript' }, 
              { text: '面向对象编程', link: '/front-end/js/course_04_18_oop' },
              { text: 'ES6ESNext规范详解', link: '/front-end/js/course_04_24_ES6' },
              { text: 'this指针作用域', link: '/front-end/js/course_05_02_this_chain' }
            ]
          },
          {
            text: '工程化',
            items: [
              { text: '模块化整体规范', link: '/front-end/tools/course_04_04_module' },
              { text: '前端工程化详解', link: '/front-end/tools/course_04_17_project' },
              { text: 'webpack', link: '/front-end/tools/webpack' },
              { text: '工具', link: '/front-end/tools/tools' },
              { text: 'babel', link: '/front-end/tools/babel' }
            ]
          },
          {
            text: 'vue',
            items: [
              { text: 'vue框架基础', link: '/front-end/vue/index' }, 
              { text: 'vue-cli', link: '/front-end/vue/course_05_05_vue-cli' },
              { text: 'vue-router', link: '/front-end/vue/course_05_09_vue-router' },
              { text: 'vue原理', link: '/front-end/vue/course_vue_interview_06_06' }
            ]
          },
          {
            text: '面试', 
            items:[
                { text: '面试', link: '/front-end/interview/'},
                { text: '面试1', link: '/front-end/interview/interview_02_28' },
                { text: '面试2', link: '/front-end/interview/interview_03_14' },
                { text: '面试3', link: '/front-end/interview/interview_03_28' }
              ]
          },
          {
            text: '其他',
            items: [
              { text: '小程序', link: '/front-end/mini-program/' },
              { text: '算法', link: '/front-end/algorithm/' },
              { text: 'hybrid开发及原理分析', link: '/front-end/hybrid/hybrid' },
            ]
          },
          { 
            text: '后端', 
            items: [
                { text: 'http', link: '/back-end/http/' },
                { text: 'java', link: '/back-end/java/' },
                { text: 'springboot', link: '/back-end/springboot/'}
            ] 
          }
        ],
        lastUpdated: 'Last Updated', // string | boolean
        sidebar: 'auto' 
    }
}