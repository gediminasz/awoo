module.exports = {
    entry: './static/js/main.js',
    output: {
        filename: './static/dist/bundle.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
};

