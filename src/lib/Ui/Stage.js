import Module from "../Module.js";
import Cameras from "./Cameras.js";
import Tripod from "./Tripod.js";

import StageTemplate from './Templates/Stage.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'STAGE';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.target = toDOM(StageTemplate());
            this.app.target.append(this.target);

            wait(0)
                .then(() => {
                    return new Cameras(this);
                })
                .then(cameras => {
                    this.cameras = cameras;
                    return new Tripod(this);
                })
                .then(tripod => {
                    this.tripod = tripod;
                    this.emit('ready');
                });

        });
    }
}
