import Module from "../../Module.js";
import Camera from "../Components/Camera.js";

import CamerasTemplate from "./Templates/Cameras.html";

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'CAMERAS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = document.getElementById('cameras');
            this.draw();

            new Camera({
                id:'camera-front',
                url: 'http://192.168.100.177:8100/one'
            }).then(frontCamera => {
                this.frontCamera = frontCamera;
                return new Camera({
                    id:'camera-rear',
                    url: 'http://192.168.100.177:8100/two'
                });
            }).then(rearCamera => {
                this.rearCamera = rearCamera;
                this.emit('ready');
            });



        });
    }

    draw() {
        this.target.innerHTML = CamerasTemplate();
    }
};