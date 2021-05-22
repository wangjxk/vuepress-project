#!/bin/sh

git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:wangjxk/vuepress-project.git master
