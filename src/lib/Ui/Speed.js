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
                spinner: this.target.querySelector('.spinner')
            };

            this.targets.direction.onclick = () => {
                this.app.client.is_mover ? this.app.client.is_mover = false : this.app.client.is_mover = true;
            };

            this.app.client.on('got_movement', () => {
                console.log(this.label, '>>> IS MOVER');
                this.targets.direction.classList.add('is_mover');
            });
            this.app.client.on('lost_movement', () => {
                console.log(this.label, '>>> LOST MOVEMENT');
                this.targets.direction.classList.remove('is_mover');
            });

            this.parent.resize();

            this.throttle = 0;
            this.left = 0;
            this.right = 0;
            this.direction = 0;
            this.rotation = false;
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

        if (this.right === 0 && this.left === 0) {
            this.rotation = false;
            this.direction = 90;
            return;
        }

        // forward
        if (this.throttle >= 0) {
            if (this.left >= 0 && this.right >= 0) {
                if (this.left > this.right) {
                    this.direction = 180 - maxAngle - (maxAngle / this.left * this.right);
                }
                if (this.right > this.left) {
                    this.direction = maxAngle + (maxAngle / this.right * this.left);
                }
                if (this.right === this.left) {
                    this.direction = 90;
                }
                this.rotation = false;
            }

            // rotate right on place
            if (this.right > this.left && this.left < 0) {
                this.rotation = 'left';
                this.direction = 0;
            }
            // rotate left on place
            if (this.left > this.right && this.right < 0) {
                this.rotation = 'right';
                this.direction = 180;
            }
            return;
        }

        // backward
        if (this.throttle <= 0) {
            if (this.left <= 0 && this.right <= 0) {
                if (this.left > this.right) {
                    this.direction = 360 - maxAngle - (maxAngle / this.right * this.left);
                }
                if (this.right > this.left) {
                    this.direction = 180 + maxAngle + (maxAngle / this.left * this.right);
                }
                if (this.right === this.left) {
                    this.direction = 270;
                }
                this.rotation = false;
            }

            // rotate right on place
            if (this.right < this.left && this.left > 0) {
                this.rotation = 'right';
                this.direction = 0;
            }
            // rotate left on place
            if (this.left < this.right && this.right > 0) {
                this.rotation = 'left';
                this.direction = 180;
            }
            return;
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

    get rotation() {
        return this._rotation;
    }

    set rotation(val) {
        this._rotation = val;
        this.targets.spinner.classList.remove('left');
        this.targets.spinner.classList.remove('right');
        if (this.rotation) {
            this.targets.spinner.classList.add(this.rotation);
            this.targets.direction.classList.add(this.rotation);
        } else {
            this.targets.direction.classList.remove('left');
            this.targets.direction.classList.remove('right');
        }
    }
}
