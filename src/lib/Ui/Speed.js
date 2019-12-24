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
                left: this.target.querySelector(`.left`),
                throttle: this.target.querySelector(`.throttle`),
                right: this.target.querySelector(`.right`),
                direction: this.target.querySelector(`.direction`),
            };
            this.parent.resize();

            this.throttle = 0;
            this.left = 0;
            this.right = 0;
            this.direction = 0;
            this.drawDirection();

            this.subscribe();
            this.emit('ready');
        });
    }

    drawValue(field) {
        const target = this.targets[field];
        const valueField = target.querySelector('b');
        const bar = target.querySelector('.bar');
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

    drawDirection() {
        const maxAngle = 45;
        if (this.left > 0 || this.right > 0) {
            if (this.left > this.right) {
                this.direction = 180 - maxAngle - (maxAngle / this.left * this.right);
            }
            if (this.right > this.left) {
                this.direction = maxAngle + (maxAngle / this.right * this.left);
            }
        }
        if (this.left < 0 || this.right < 0) {
            if (this.left > this.right) {
                this.direction = 360 - maxAngle - (maxAngle / this.right * this.left);
            }

            if (this.right > this.left) {
                this.direction = 180 + maxAngle + (maxAngle / this.left * this.right);
            }
        }

        if (this.right === 0 &&  this.left === 0){
            this.direction = 90;
        }
    }

    subscribe() {
        this.mqtt.subscribe('movement');
        this.mqtt.on('movement', data => this.update(data));
    }

    update(data) {
        this.throttle = data.throttle;
        this.left = data.left;
        this.right = data.right;
        this.drawDirection();
    }

    get throttle() {
        return this._throttle;
    }

    set throttle(value) {
        if (this.throttle === value)
            return false;

        this._throttle = value;
        this.drawValue('throttle');
    }

    get left() {
        return this._left;
    }

    set left(value) {
        if (this.left === value)
            return false;

        this._left = value;
        this.drawValue('left');
    }

    get right() {
        return this._right;
    }

    set right(value) {
        if (this.right === value)
            return false;

        this._right = value;
        this.drawValue('right');
    }

    get direction() {
        return this._direction;
    }

    set direction(val) {
        this._direction = val;
        this.targets.direction.style.transform = `rotate(${this.direction - 90}deg)`;
    }
}
