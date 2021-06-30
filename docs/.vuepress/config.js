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
              { text: 'js杂记', link: '/frontend/js/' },
              { text: 'Promise规范和应用', link: '/frontend/js/course_04_03_promise' },   
              { text: '浏览器对象详解', link: '/frontend/js/course_04_11_browser' },
              { text: 'ts初探', link: '/frontend/js/course_04_12_typescript' }, 
              { text: '面向对象编程', link: '/frontend/js/course_04_18_oop' },
              { text: 'ES6ESNext规范详解', link: '/frontend/js/course_04_24_ES6' },
              { text: 'this指针作用域', link: '/frontend/js/course_05_02_this_chain' }
            ]
          },
          {
            text: '工程化',
            items: [
              { text: '模块化整体规范', link: '/frontend/tools/course_04_04_module' },
              { text: '前端工程化详解', link: '/frontend/tools/course_04_17_project' },
              { text: 'webpack', link: '/frontend/tools/webpack' },
              { text: '工具', link: '/frontend/tools/tools' },
              { text: 'babel', link: '/frontend/tools/babel' }
            ]
          },
          {
            text: 'vue',
            items: [
              { text: 'vue框架基础', link: '/frontend/vue/index' }, 
              { text: 'vue-cli', link: '/frontend/vue/course_05_05_vue-cli' },
              { text: 'vue-router', link: '/frontend/vue/course_05_09_vue-router' },
              { text: 'vuex', link: '/frontend/vue/course_vuex' },
              { text: 'vue-ssr', link: '/frontend/vue/course_vue_ssr' },
              { text: 'vue原理', link: '/frontend/vue/course_vue_interview_06_06' }
            ]
          },
          {
            text: '面试', 
            items:[
                { text: '面试', link: '/frontend/interview/'},
                { text: '面试1', link: '/frontend/interview/interview_02_28' },
                { text: '面试2', link: '/frontend/interview/interview_03_14' },
                { text: '面试3', link: '/frontend/interview/interview_03_28' }
              ]
          },
          {
            text: '其他',
            items: [
              { text: 'css', link: '/frontend/css/' },
              { text: '小程序', link: '/frontend/mini-program/' },
              { text: '算法', link: '/frontend/algorithm/' },
              { text: 'hybrid开发及原理分析', link: '/frontend/hybrid/hybrid' }
            ]
          },
          { 
            text: '后端', 
            items: [
                { text: 'nginx', link: '/backend/nginx' },
                { text: 'springboot', link: '/backend/springboot'}
            ] 
          }
        ],
        lastUpdated: 'Last Updated', // string | boolean
        sidebar: 'auto' 
    }
}