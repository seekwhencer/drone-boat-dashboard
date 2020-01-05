import Axis from './Axis.js';

export default class Throttle extends Axis {
    constructor(args) {
        super('throttle', args.options.controller, args.options.axisNumber, args.options.throttleScale);
        this.parent = args.parent;
        this.app = this.parent.app;
        this.mqtt = this.app.mqtt;

        this.name = 'throttle';
        this.yaw = args.options.yaw;
        this.enableButton = args.options.enableButton;
        this.rotationButton = args.options.rotationButton;
        this.left = 0.0;
        this.right = 0.0;
    }

    calculateSides() {
        if (!this.enableButton || !this.rotationButton)
            return false;

        if (this.enableButton.value !== true) {
            this.reset();
            return;
        }

        let source = this.normalized;

        this.left = source;
        this.right = source;

        let percent = this.yaw.normalized / 100;

        // left
        if (percent > 0) {
            percent = 1 - percent;
            this.left = parseInt(this.right * percent);

        }
        // right
        if (percent < 0) {
            percent = 1 + percent;
            this.right = parseInt((this.left * percent));
        }

        // flip the other side with same throttle to rotate on place
        if (this.rotationButton.value === true) {
            if (source > 0) {
                if (this.right > this.left) {
                    this.left = this.right * -1;
                }
                if (this.left > this.right) {
                    this.right = this.left * -1;
                }
            }
            if (source < 0) {
                if (this.right < this.left) {
                    this.left = this.right * -1;
                }
                if (this.left < this.right) {
                    this.right = this.left * -1;
                }
            }
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        //document.getElementById('throttle').innerHTML = `${this.name} ${value}`;

        if (value === this.value)
            return;

        this._value = parseFloat(value);
        this.normalize();
        this.calculateSides();
        this.publish();
        this.emit('change');
    }

    reset() {
        this.normalized = 0;
        this.left = 0;
        this.right = 0;
    }

    publish() {
        if(!this.app.client.is_mover)
            return;

        const payload = {
            throttle: this.normalized,
            left: this.left,
            right: this.right
        };
        try {
            this.mqtt.publish(`movement`, payload);
        } catch (error) {
            console.log(error);
        }
    }
}
