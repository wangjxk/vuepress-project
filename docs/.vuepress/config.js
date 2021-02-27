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
              { text: '工具', link: '/front-end/tools/tools' },
              { text: '算法', link: '/front-end/algorithm/' },
              { text: '面试', link: '/front-end/interview/' },
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