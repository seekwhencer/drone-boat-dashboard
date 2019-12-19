import Module from "../Module.js";
import Crypto from 'crypto';

export default class extends Module {
    constructor(app) {
        super();
        return new Promise((resolve, reject) => {
            this.app = app;
            this.data = this.app.datasource;
            this.label = 'CLIENT';

            console.log(this.label, 'INIT');

            this.id = this.app.datasource.get('client.id');
            console.log(this.label, '>>> GOT CLIENT ID', this.id);

            this.options = {};

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.emit('ready');

        });
    }

    // refreshing the field date
    update() {
        this.app.datasource.update('client.id', this.id);
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
            this.app.datasource.set('client.id', this.id);
            console.log(this.label, '>>> SET NEW CLIENT ID:', this.id);
        }
    }


}
