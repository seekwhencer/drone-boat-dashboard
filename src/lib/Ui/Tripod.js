import Module from "../Module.js";

import Position from './Position.js';
import Speed from './Speed.js';
import Sensors from './Sensors.js';

import TripodTemplate from './Templates/Tripod.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'TRIPOD';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = toDOM(TripodTemplate());
            this.parent.target.append(this.target);
            this.draw();

            // resizing on window resize
            window.onresize = () => {
                this.resize();
            };
            window.resize = () => {
                this.resize();
            };

            // create thee speed component
            wait(0)
                .then(() => {
                    return new Sensors(this);
                })
                .then(sensors => {
                    this.sensors = sensors;
                    return new Speed(this);
                })
                .then(speed => {
                    this.speed = speed;
                    return new Position(this);
                })
                .then(position => {
                    this.position = position;
                    this.emit('ready');
                });

            this.emit('ready');
        });
    }

    draw() {
        this.resize();
    }

    resize() {
        const screenHeight = window.innerHeight;
        const camerasHeight = this.parent.cameras.target.getBoundingClientRect().height;
        const headerHeight = this.parent.parent.header.target.getBoundingClientRect().height;
        const tripodHeight = screenHeight - camerasHeight - headerHeight;
        this.target.style.height = `${tripodHeight}px`;
    }
}
