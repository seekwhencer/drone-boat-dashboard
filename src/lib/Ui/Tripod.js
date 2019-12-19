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

            this.target = document.getElementById('tripod');
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
                    return new Speed(this);
                })
                .then(speed => {
                    this.speed = speed;
                    return new Position(this);
                })
                .then(position => {
                    this.position = position;
                    return new Sensors(this);
                })
                .then(sensors => {
                    this.sensors = sensors;
                    this.emit('ready');
                });

            this.emit('ready');
        });
    }

    draw() {
        this.target.innerHTML = TripodTemplate();
        this.resize();
    }

    resize() {
        const screenHeight = window.innerHeight;
        const camerasHeight = document.getElementById('cameras').getBoundingClientRect().height;
        const tripodHeight = screenHeight - camerasHeight;
        this.target.style.height = `${tripodHeight}px`;
    }
}
