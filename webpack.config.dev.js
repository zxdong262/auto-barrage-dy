
const webpack = require('webpack')
const sysConfigDefault = require('./config.default')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const packThreadCount = sysConfigDefault.devCPUCount // number
const HappyPack = require('happypack')
const happyThreadPool = packThreadCount === 0 ? null : HappyPack.ThreadPool({ size: packThreadCount })
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const pack = require('./package.json')
const git = require('git-rev-sync')

const happyConf = {
  loaders: ['babel-loader'],
  threadPool: happyThreadPool,
  verbose: true
}
let version = pack.version + '-' + git.long()

const stylusSettingPlugin =  new webpack.LoaderOptionsPlugin({
  test: /\.styl$/,
  stylus: {
    preferPathResolver: 'webpack'
  }
})

const url = `http://localhost:${sysConfigDefault.devPort}`

const pug = {
  loader: 'pug-html-loader',
  options: {
    data: {
      version,
      _global: {
        version
      }
    }
  }
}

var config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './src/app/index.pug',
    app: './src/js/index.jsx'
  },
  output: {
    path: __dirname + '/app',
    filename: '[name].bundle.js',
    publicPath: '/',
    chunkFilename: '[name].[hash].js',
    libraryTarget: 'var'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  watch: true,
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  resolveLoader: {
    modules: [
      path.join(process.cwd(), 'node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          packThreadCount === 0
            ? 'babel-loader?cacheDirectory'
            : 'happypack/loader?cacheDirectory'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: ['url-loader?limit=10192&name=images/[hash].[ext]']
      },
      {
        test: /\.pug$/,
        use: [
          'file-loader?name=index.html',
          'concat-loader',
          'extract-loader',
          'html-loader',
          pug
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    packThreadCount === 0 ? null : new HappyPack(happyConf),
    stylusSettingPlugin,
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true
    }),
    new OpenBrowserPlugin({
      url
    })
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    contentBase: path.join(__dirname, 'app/'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: sysConfigDefault.devPort
  }
}

if (process.env.NODE_ENV === 'production') {
  delete config.devServer
  delete config.devtool
  delete config.watch
  config.plugins = config.plugins.slice(0, config.plugins.length - 1)
}
module.exports = config

