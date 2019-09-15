import Module from "../../Module.js";

import Position from '../Compositions/Position.js';
import Speed from '../Components/Speed.js';
import Sensors from '../Compositions/Sensors.js';

import TripodTemplate from '../Compositions/Templates/Tripod.html';

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
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
            new Speed().then(speed => {
                this.speed = speed;
                return new Position();
            }).then(position=>{
                this.position = position;
                return new Sensors();
            }).then(sensors => {
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
};