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
            text: '前端系列',
            items: [
              { text: 'js', link: '/front-end/js/' },
              { text: 'css', link: '/front-end/css/' },
              { text: 'vue', link: '/front-end/vue/' },
              { text: 'webpack', link: '/front-end/tools/webpack' },
              { text: '小程序', link: '/front-end/mini-program/' },
              { text: '工具', link: '/front-end/tools/tools' },
              { text: '算法', link: '/front-end/algorithm/' },
              { text: '面试', link: '/front-end/interview/' },
            ]
          },
          {
            text: '前端进阶',
            items: [
              { text: '面试1', link: '/front-end-course/interview_02_28_事件循环' },
              { text: '面试2', link: '/front-end-course/interview_03_14_性能优化' },
              { text: '面试3', link: '/front-end-course/interview_03_28' },
              { text: 'Promise规范和应用', link: '/front-end-course/course_04_03_promise' },
              { text: '模块化整体规范', link: '/front-end-course/course_04_04_模块化规范' },
              { text: '浏览器对象详解', link: '/front-end-course/course_04_11_浏览器' },
              { text: 'ts初探', link: '/front-end-course/course_04_12_typescript' },
              { text: '前端工程化详解', link: '/front-end-course/course_04_17_工程化' },
              { text: '面向对象编程', link: '/front-end-course/course_04_18_oop' },
              { text: 'ES6ESNext规范详解', link: '/front-end-course/course_04_24_ES6规范' },
              { text: 'ES6实战', link: '/front-end-course/course_05_01_es6实战' },
              { text: 'this指针作用域', link: '/front-end-course/course_05_02_this作用域' },
              { text: 'vue基础', link: '/front-end-course/course_05_03_vue' },
              { text: 'vue-cli', link: '/front-end-course/course_05_05_vue-cli' },

            ]
          },
          { 
            text: '后端系列', 
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