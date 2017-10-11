require('babel-polyfill');

module.exports = {
  entry: {
    bundle : [
      'babel-polyfill',
      'whatwg-fetch',
      './front/entry/'
    ],
  },
  output: {
    path: './front/build/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.yaml'],
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /(\.js$|\.jsx$)/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['react', 'es2015', 'stage-0'],
        },
      },
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.yaml$/,
        loader: 'yaml',
      },
    ],
  },
};

