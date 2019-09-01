import Module from "../../Module.js";
import SensorsTemplate from './Templates/Sensors.html';

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'SENSORS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.lat = 0;
            this.lon = 0;
            this.delta = 0;

            this.target = document.getElementById('sensors');
            this.subscribe();
            this.draw();

            this.emit('ready');
        });
    }

    draw() {
        const payload = {
            scope: {
                // map here the data
            }
        };
        this.target.innerHTML = SensorsTemplate(payload);
    }

    subscribe() {
        MQTT.subscribe('sensors');
        MQTT.on('sensors', data => {
            console.log('>>> GPS DATA', data);
            this.draw();
        });
    }

};