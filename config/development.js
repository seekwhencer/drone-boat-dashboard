const
    ConfigClass = require('./config.js');

module.exports = class extends ConfigClass {
    constructor() {
        super();

        this.config = {
            mode: 'development',
            output: {
                filename: 'js/bundle.js',
                path: `${this.appPath}/dist/dev`,
                hotUpdateChunkFilename: `../../.hot/hot-update.js`,
                hotUpdateMainFilename: `../../.hot/hot-update.json`
            },

            module: {
                rules: [
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'bundle.css',
                                    outputPath: '../../dist/dev/css/'
                                }
                            },
                            'extract-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                        ],
                    },
                ],
            },

            devServer: {
                contentBase: ['public', 'dist/dev'],
                publicPath: '/',
                compress: true,
                port: 9000,
                hot: true,
                index: 'public/index.html',
                writeToDisk: true,
                watchOptions: {
                    poll: true
                },
                watchContentBase: true
            }
        };
        return this.mergeConfig();
    };
};