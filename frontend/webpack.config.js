import webpack from "webpack";

module.exports = (env) => {
  return {
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
    plugins: [
      new webpack.EnvironmentPlugin({
        REACT_APP_STRAVA_ACCESS_TOKEN,
        DEBUG: false,
      }),
      new webpack.EnvironmentPlugin({
        REACT_APP_STRAVA_CLIENT_ID,
        DEBUG: false,
      }),
      new webpack.EnvironmentPlugin({
        REACT_APP_STRAVA_CLIENT_SECRET,
        DEBUG: false,
      }),
      new webpack.EnvironmentPlugin({
        REACT_APP_STRAVA_REDIRECT_URI,
        DEBUG: false,
      }),
    ],
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    // addition - add source-map support
    devtool: "source-map",
  };
};
