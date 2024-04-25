const fs = require("fs");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/public/index.html',
      //filename: 'index.html',
    }),
  ],
  devServer: {
    server: {
      type: "https",
      options: {
        key: fs.readFileSync(path.resolve(__dirname, "./ssl/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "./ssl/cert.pem")),
      },
    },
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    proxy: [
      {
        context: "/api",
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
        secure: true,
        changeOrigin: true,
      },
    ],
  },
};
