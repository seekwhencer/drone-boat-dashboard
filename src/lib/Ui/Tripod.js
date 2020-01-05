import Module from "../Module.js";

import Positions from './Positions.js';
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

            window.addEventListener('resize', () => this.resize());

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
                    return new Positions(this);
                })
                .then(position => {
                    this.position = position;
                    this.emit('ready');
                });
        });
    }

    draw() {
        this.resize();
    }

    resize() {
        if (!this.parent.cameras.frontCamera.fullscreen && !this.parent.cameras.rearCamera.fullscreen) {
            const screenHeight = window.innerHeight;
            const camerasHeight = this.parent.cameras.target.getBoundingClientRect().height;
            const headerHeight = this.parent.parent.header.target.getBoundingClientRect().height;
            const tripodHeight = screenHeight - camerasHeight - headerHeight - 2;
            this.target.style.height = `${tripodHeight}px`;
            console.log('>>>> SCREEN', screenHeight, 'CAMERAS', camerasHeight, 'HEADER', headerHeight);
        }

        if (this.parent.cameras.frontCamera.fullscreen || this.parent.cameras.rearCamera.fullscreen) {
            this.target.style.height = `calc(100% - 100px)`;
        }
    }
}
