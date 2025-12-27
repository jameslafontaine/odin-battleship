const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// If you want to customize TerserPlugin later:
// const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimize: true, // enables JS minification by default (Terser)
        minimizer: [
            "...", // preserves Webpack's default JS minifier
            new CssMinimizerPlugin(), // optional CSS minification
            // If you ever want to customize JS minification:
            // new TerserPlugin({ /* custom options here */ }),
        ],
    },
});
