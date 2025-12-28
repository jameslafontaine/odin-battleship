const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: "./dist",
        port: 8080,
        open: true,
        watchFiles: ["./src/index.html"],
    },
});
