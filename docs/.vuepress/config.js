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
              { text: '面试1', link: '/front-end-course/interview_02_28' },
              { text: '面试2', link: '/front-end-course/interview_03_14' },
              { text: '面试3', link: '/front-end-course/interview_03_28' },
              { text: 'Promise规范和应用', link: '/front-end-course/course_04_03' },
              { text: '模块化整体规范', link: '/front-end-course/course_04_04' },
              { text: '浏览器对象详解', link: '/front-end-course/course_04_11' },
              { text: 'ts初探', link: '/front-end-course/course_04_12' },
              { text: '前端工程化详解', link: '/front-end-course/course_04_17' },
              { text: '面向对象编程', link: '/front-end-course/course_04_18' },
              { text: 'ES6ESNext规范详解', link: '/front-end-course/course_04_24' }
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