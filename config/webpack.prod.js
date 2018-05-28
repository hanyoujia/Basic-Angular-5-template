const path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV || 'production'; // setting environment variables to be useed in main.ts to configure Angular
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;
const metadata = {
  env: ENV,
  host: HOST,
  port: PORT
};

module.exports = {
  devServer: { // section related to webpack built in server, used for development
    contentBase: './../src', // setting the base path for the code to be served by webpack built in server
    historyApiFallback: true,
    port: metadata.port, //setting port from variables defined in the file above
  },
  entry: {
    'polyfills': './src/polyfills.ts',
    'app': './src/main.ts'
  },

  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['to-string-loader', 'css-loader', 'postcss-loader']
    },
    {
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader'
      },
      {
        loader: 'angular2-template-loader'
      }
      ]
    },
    {
      test: /\.html$/,
      use: [{
        loader: 'raw-loader'
      }]
    }
    ]
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
      path.join(__dirname, "./src")
    ),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'polyfills']
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'] // if no extension is defined, consider files with .ts and .js extension
  }
};
