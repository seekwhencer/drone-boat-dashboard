import Module from "../Module.js";
import PositionTemplate from './Templates/Position.html';
import PositionItemTemplate from './Templates/PositionItem.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'POSITION';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.latitude = 0;
            this.longitude = 0;
            this.speed = 0;
            this.time = false;

            this.target = document.getElementById('position');
            this.target.innerHTML = PositionTemplate();

            this.targets = {};
            ['latitude', 'longitude', 'speed', 'time'].forEach(i => {
                this.targets[i] = document.getElementById(`position-${i}`);
                const payload = {
                    scope: {
                        label: i,
                        value: ''
                    }
                };
                this.targets[i].innerHTML = PositionItemTemplate(payload);
            });

            this.subscribe();
            this.draw();

            this.emit('ready');
        });
    }

    draw() {
        const payload = {
            scope: {}
        };

    }

    update() {
        ['latitude', 'longitude', 'speed', 'time'].forEach(i => {
            const target = this.targets[i].getElementsByClassName(`value`)[0];
            target.innerHTML = this[i];
        });
    }

    subscribe() {
        this.mqtt.subscribe('gps');
        this.mqtt.on('gps', data => {
            this.latitude = data.lat;
            this.longitude = data.lon;
            this.speed = data.speed;
            this.time = data.time;
            this.update();
        });
    }

}
