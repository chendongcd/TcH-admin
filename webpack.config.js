
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (config, { webpack }) => {
  // if(process.env.NODE_ENV=='production') {
  //   config.plugins.push(new UglifyJSPlugin())
  // }
  if(process.env.NODE_ENV=='production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({           //清除打包后文件中的注释,和copyright信息
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    }))
  }
  return config
}
