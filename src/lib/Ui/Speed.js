import Module from "../Module.js";
import SpeedTemplate from './Templates/Speed.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'SPEED';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = toDOM(SpeedTemplate());
            this.parent.target.append(this.target);

            this.targets = {
                left: document.getElementById(`speed-left`),
                throttle: document.getElementById(`speed-throttle`),
                right: document.getElementById(`speed-right`)
            };

            this.throttle = 0;
            this.left = 0;
            this.right = 0;
            window.resize();

            this.subscribe();
            this.emit('ready');
        });
    }

    drawValue(field) {
        const target = this.targets[field];
        const valueField = target.getElementsByTagName('b')[0];
        const bar = target.getElementsByClassName('bar')[0];
        valueField.innerHTML = this[field];

        if (this[field] > 0) {
            bar.style.transform = `rotateZ(180deg)`;
            bar.style.height = `${this[field] / 2}%`;
        }
        if (this[field] < 0) {
            bar.style.transform = `rotateZ(0deg)`;
            bar.style.height = `${this[field] / 2 * -1}%`;
        }
        if (this[field] === 0) {
            bar.style.transform = `rotateZ(180deg)`;
            bar.style.height = `0%`;
        }

    }

    subscribe() {
        this.mqtt.subscribe('movement');
        this.mqtt.on('movement', data => {
            this.throttle = data.throttle;
            this.left = data.left;
            this.right = data.right;
        });
    }

    get throttle() {
        return this._throttle;
    }

    set throttle(value) {
        if(this.throttle === value)
            return false;

        this._throttle = value;
        this.drawValue('throttle');
    }

    get left() {
        return this._left;
    }

    set left(value) {
        if(this.left === value)
            return false;

        this._left = value;
        this.drawValue('left');
    }

    get right() {
        return this._right;
    }

    set right(value) {
        if(this.right === value)
            return false;

        this._right = value;
        this.drawValue('right');
    }
}
