const config = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    login: __dirname +'/app/src/login.entry.js',
    main: __dirname +'/app/src/main.entry.js'
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
                            sourceMap: true,
                            camelCase: true,
                            minimize: true
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;
