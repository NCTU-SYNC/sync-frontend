module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/main.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'SYNC 新聞同步'
        return args
      })
  }
}
