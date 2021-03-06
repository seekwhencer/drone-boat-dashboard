const
    fs = require('fs-extra'),
    ConfigClass = require('./config.js'),
    spawn = require('child_process').spawn,
    Crypto = require('crypto');

module.exports = class extends ConfigClass {
    constructor() {
        super();

        this.salt = 'rambazamba';
        this.hash = Crypto.createHash('md5').update(this.salt).digest("hex");

        this.config = {
            mode: 'production',
            entry: {
                app: './src/app.js',
            },
            output: {
                filename: './js/[name].js',
                path: `${this.appPath}/dist/prod/`,
            },

            module: {
                rules: [
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /\.(png|svg|jpg|gif|jpe?g)$/,
                        use: [
                            {
                                options: {
                                    name: "[name].[ext]",
                                    outputPath: "../images/"
                                },
                                loader: "file-loader"
                            }
                        ]
                    },
                    {
                        test: /.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].css',
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
                            fs.copySync(`${this.appPath}/public/`, `${this.appPath}/dist/prod`);
                            fs.copySync(`${this.appPath}/dist/prod`, `${this.appPath}/docs`);

                            sedReplace('/css', '/drone-boat-dashboard/css', `${this.appPath}/docs/css/app.css`);
                            //sedReplace('/images', '/drone-boat-dashboard/images', `${this.appPath}/docs/css/app.css`);
                            sedReplace('?hash', `?${this.hash}`, `${this.appPath}/docs/index.html`);
                            sedReplace('debug: true', 'debug: false', `${this.appPath}/docs/index.html`);
                        });
                    }
                }
            ]
        };
        return this.mergeConfig();
    };
};

const sedReplace = (replaceFrom, replaceTo, replaceFile) => {
    const replaceCommand = `s#${replaceFrom}#${replaceTo}#g`;
    const spawnOptions = [
        '-i',
        replaceCommand,
        replaceFile
    ];
    setTimeout(() => {
        const proc = spawn('sed', spawnOptions);
        proc.on('error', (err) => {
            console.error('>>> ERROR', err);
        });
        proc.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        proc.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    }, 2000);
};
