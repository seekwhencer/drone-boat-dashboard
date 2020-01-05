import Module from "../Module.js";
import Crypto from 'crypto';

export default class extends Module {
    constructor(app) {
        super();
        return new Promise((resolve, reject) => {
            this.app = app;
            this.mqtt = this.app.mqtt;
            this.data = this.app.datasource;
            this.label = 'CLIENT';

            console.log(this.label, 'INIT');

            this.id = this.data.get('client.id');
            this.is_mover = false;

            this.options = {};

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.emit('ready');

        });
    }

    subscribe() {
        this.mqtt.subscribe('client');
        this.mqtt.on('client', data => {
            if (data.mover !== this.id) {
                this.is_mover = false;
            }
        });
    }

    publish(payload) {
        try {
            this.mqtt.publish(`client`, payload);
        } catch (error) {
            console.log(this.label, error);
        }
    }

    // refreshing the field date
    update() {
        this.data.update('client.id', this.id);
    }

    get id() {
        return this._id;
    }

    set id(val) {
        console.log(this.label, '>>> GOT CLIENT ID:', val);
        if (val) {
            this._id = val;
            this.update();
        } else {
            this._id = `browser_${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`;
            this.data.set('client.id', this.id);
            console.log(this.label, '>>> SET NEW CLIENT ID:', this.id);
        }
    }

    get is_mover() {
        return this._is_mover;
    }

    set is_mover(val) {
        this._is_mover = val;
        if (this.is_mover === true) {
            this.emit('got_movement', this);
            this.publish({
                mover: this.id
            });
        } else {
            this.emit('lost_movement', this);
        }
    }


}
