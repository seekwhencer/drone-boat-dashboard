import Module from "../../Module.js";
import Cameras from "../Compositions/Cameras.js";
import Tripod from "../Compositions/Tripod.js";

import StageTemplate from './Templates/Stage.html';

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'STAGE';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = document.getElementById('stage');
            this.draw();

            new Cameras().then(cameras => {
                this.cameras = cameras;
                return new Tripod();
            }).then(tripod => {
                this.tripod = tripod;
                this.emit('ready');
            });

        });
    }

    draw(){
        this.target.innerHTML = StageTemplate();
    }
};