module.exports = {
    entry: {
        player: __dirname + "/public/player/js/app.js",
        admin: __dirname + "/public/admin/js/app.js"
    },
    output: {
        filename: "[name]/js/app-bundle.js",
        path: __dirname + "/public"
    },
    module: {
        loader: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["es2015", "react"]
            }
        }, {
            test: /\.scss$/,
            loader: "style!css!sass"
        }],
        resolve: {
            extensions: ["", ".js", ".jsx"]
        },
        devServer: {
            historyApiFallback: true,
            contentBase: "./"
        }
    }
};