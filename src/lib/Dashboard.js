import '../scss/app.scss';
import './Globals.js';
import QueryString from 'qs';
import Module from './Module.js';
import DataSource from './Datasource.js';
import Gamepad from './Gamepad';
import Mqtt from './Mqtt';
import Ui from './Ui';
import Client from './Client';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'DRONE BOAT DASHBOARD';
            this.options = args;

            this.options.debug = this.options.debug || false;
            this.options.language = this.options.language || 'de';
            this.options.secret = this.options.secret || 'simsalabimbam';
            this.options.storage_prefix = this.options.storage_prefix || 'dbd_';
            this.options.cache_age = this.options.cache_age || 60 * 60;

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
                    return new DataSource(this);
                })
                .then(datasource => {
                    this.datasource = datasource;
                    return new Client(this);
                })
                .then(client => {
                    this.client = client;
                    return new Mqtt(this);
                })
                .then(mqtt => {
                    this.mqtt = mqtt;
                    this.client.mqtt = this.mqtt;
                    this.client.subscribe();
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
