const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//关闭eslint语法检查，太难了
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './'
})
