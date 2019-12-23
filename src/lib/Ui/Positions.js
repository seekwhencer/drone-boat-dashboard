import Module from "../Module.js";
import Position from "./Position.js";
import PositionsTemplate from './Templates/Positions.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'POSITIONS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.fields = ['lat', 'lon', 'speed', 'time'];
            this.target = toDOM(PositionsTemplate());
            this.parent.target.append(this.target);

            this.fields.map(field => {
                new Position({
                    parent: this,
                    options: {
                        field: field,
                        label: field,
                        value: ''
                    }
                }).then(position => this.items.push(position));
            });

            this.subscribe();
            this.emit('ready');
        });
    }

    update(data) {
        this.online = true;
        this.fields.map(field => this.one(field).value = data[field]);
    }

    updateStatus(data) {
        if (data.clientId !== 'gps')
            return false;

        data.connected === 1 ? this.online = true : this.online = false;
    }

    subscribe() {
        this.mqtt.subscribe('gps');
        this.mqtt.on('gps', data => this.update(data));
        this.mqtt.on('network', data => this.updateStatus(data));
    }

    one(field) {
        return this.getF('field', field);
    }

    get online() {
        return this._online;
    }

    set online(val) {
        this._online = val;
        this.online ? this.target.classList.add('online') : this.target.classList.remove('online');
    }

}
