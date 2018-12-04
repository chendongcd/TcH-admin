import {resolve} from 'path';

export default {
  theme: "./theme.config.js",
  publicPath: "/",
  extraBabelPlugins: [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": true
    }]
  ],
  env: {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  alias: {
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname, "./src/components"),
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    services: resolve(__dirname, "./src/services"),
    models: resolve(__dirname, "./src/models"),
    routes: resolve(__dirname, "./src/routes"),
    common:resolve(__dirname,'./src/common')
  },
  urlLoaderExcludes: [
    /\.svg$/,
  ],
  ignoreMomentLocale: true,
}
