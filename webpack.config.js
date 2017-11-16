module.exports = {
    entry: './js/main.js',
    output: {
        filename: './static/js/bundle.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
};

