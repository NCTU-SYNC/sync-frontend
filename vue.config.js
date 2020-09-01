module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles.scss";
        `
      }
    }
  }
}
