module.exports = {
  entry: __dirname + '/app/entry.js',
  output: {
    path: __dirname +'/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
};
