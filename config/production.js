const
    fs = require('fs-extra'),
    ConfigClass = require('./config.js');

module.exports = class extends ConfigClass {
    constructor() {
        super();

        this.config = {
            mode: 'production',
            entry: [
                './src/app.js',
                './src/scss/index.scss'
            ],
            output: {
                filename: 'js/bundle.js',
                path: `${this.appPath}/dist/prod`,
            },


            module: {
                rules: [
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },{
                        test: /.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'bundle.css',
                                    outputPath: '../../dist/prod/css/'
                                }
                            },
                            'extract-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: false,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                ],
            },

            plugins: [
                {
                    apply: (compiler) => {
                        compiler.hooks.afterEmit.tap('Complete', (compilation) => {
                            console.log('>>> HOOKED');
                            fs.removeSync(`${this.appPath}/docs`);
                            fs.mkdirSync(`${this.appPath}/docs`);
                            fs.mkdirSync(`${this.appPath}/docs/js`);
                            fs.mkdirSync(`${this.appPath}/docs/css`);

                            fs.copyFileSync(`${this.appPath}/dist/prod/js/bundle.js`, `${this.appPath}/docs/js/bundle.js`);
                            fs.copyFileSync(`${this.appPath}/dist/prod/css/bundle.css`, `${this.appPath}/docs/css/bundle.css`);
                            fs.copyFileSync(`${this.appPath}/public/index.html`, `${this.appPath}/docs/index.html`);
                        });
                    }
                }
            ]
        };
        return this.mergeConfig();
    };
};