module.exports = {
  // change to .tsx if necessary
  mode: "development",
  entry: "./src/app.tsx",
  output: {
    filename: "./dist/bundle.js",
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
      {
        test: /\.(t|j)sx?$/,
        use: { loader: "ts-loader" },
        exclude: /node_modules/,
      },

      // addition - add source-map support
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "source-map-loader",
      },

      // use a css loader for css ;)
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  // addition - add source-map support
  devtool: "source-map",
};
