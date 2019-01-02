import {resolve} from 'path';

export default {
  hash: true,
  theme: "./theme.config.js",
  entry: {
    index: './src/index.js',
    vendor: ['moment', 'react', 'react-dom', 'lodash', 'react-helmet', 'classnames'],
    antd: [
      'antd/lib/button',
      'antd/lib/icon',
      'antd/lib/table',
      'antd/lib/date-picker',
      'antd/lib/form',
      'antd/lib/modal',
      'antd/lib/grid',
      'antd/lib/input',
      'antd/lib/row',
      'antd/lib/col',
      'antd/lib/card'
    ],
  },
  commons: [{
    names: ['vendor', 'antd'],
    minChunks: Infinity,
  }],
  html: {
    "template": "./public/index.ejs"
  },
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
    common: resolve(__dirname, './src/common')
  },
  urlLoaderExcludes: [
    /\.svg$/,
  ],
  ignoreMomentLocale: true,
  es5ImcompatibleVersions: true,
}
