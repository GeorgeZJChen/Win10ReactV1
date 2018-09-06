const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const config = {
  mode: 'production',
  // devtool: 'source-map',
  entry: {
    main: __dirname +'/app/src/main.js',
  },
  output: {
    path: __dirname +'/public',
    filename: "[name].bundle.js"
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    inline: true
  },
  module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env", "react"
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            // sourceMap: true,
                            camelCase: true,
                            minimize: true
                        }
                    }
                ]
            }
        ]
  },
  plugins: [
    new UglifyJsPlugin({
      // sourceMap: true
    })
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      //   // cache: true,
      //   parallel: true,
      //   // sourceMap: true // set to true if you want JS source maps
      // }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};

module.exports = config;
