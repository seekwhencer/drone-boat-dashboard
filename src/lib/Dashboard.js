import '../scss/app.scss';
import './Globals.js';
import QueryString from 'qs';
import Module from './Module.js';
import DataSource from './Datasource.js';
import Gamepad from './Gamepad/index.js';
import Mqtt from './Mqtt/index.js';
import Ui from './Ui/index.js';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'DRONE BOAT DASHBOARD';
            this.options = args;
            this.options.debug = this.options.debug || false;
            this.options.language = this.options.language || 'de';
            this.options.target = this.options.target || document.querySelector('body');


            this.getParams();
            window.dashboardOptions = this.options;
            console.log(this.label, '>>> INIT', this.options);

            this.target = this.options.target;

            this.on('ready', () => {
                resolve(this);
            });

            // entry
            wait(0)
                .then(() => {
                    return new DataSource();
                })
                .then(datasource => {
                    this.datasource = datasource;
                    return new Mqtt(this);
                })
                .then(mqtt => {
                    this.mqtt = mqtt;
                    return new Gamepad(this);
                })
                .then(gamepad => {
                    this.gamepad = gamepad;
                    return new Ui(this);
                })
                .then(ui => {
                    this.ui = ui;
                    console.log('>>> ALL READY');
                    this.emit('ready');
                });
        });
    }

    getParams() {
        const query = (new URL(document.location)).searchParams.toString();
        const params = QueryString.parse(query, {plainObjects: true});
        this.options = RAMDA.mergeDeepLeft(params, this.options);
    }

    getWidth() {
        return this.target.getBoundingClientRect().width;
    }

    getHeight() {
        return this.target.getBoundingClientRect().height;
    }
}
