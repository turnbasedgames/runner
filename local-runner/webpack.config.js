const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // this is specific to jsx... separate into a paths file?
  // js, jsx, ts, tsx...
  entry: path.resolve(__dirname, '../frontend/src/index.jsx'),
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../frontend/dist'),
    clean: true
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};