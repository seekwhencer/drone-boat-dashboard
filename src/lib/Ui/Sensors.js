import Module from "../Module.js";
import Sensor from "./Sensor.js";
import SensorsTemplate from './Templates/Sensors.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'SENSORS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.fields = ['temperature', 'co2', 'nh3', 'o3', 'kPa', 'dust', 'dust2'];
            this.target = toDOM(SensorsTemplate());
            this.parent.target.append(this.target);

            this.fields.map(field => {
                new Sensor({
                    parent: this,
                    options: {
                        field: field,
                        label: field,
                        value: ''
                    }
                }).then(sensor => this.items.push(sensor));
            });

            this.subscribe();
            this.emit('ready');
        });
    }

    update(data) {
        this.fields.map(field => this.one(field).value = data[field]);
    }

    subscribe() {
        this.mqtt.subscribe('sensors');
        this.mqtt.on('sensors', data => this.update(data));
    }

    one(field) {
        return this.getF('field', field);
    }
}
