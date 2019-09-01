import Module from "../../Module.js";

import CameraTemplate from './Templates/Camera.html'

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'CAMERA';
            this.options = args;
            console.log(this.label, 'INIT', this.options.id);

            this.target = document.getElementById(this.options.id);
            this.target.innerHTML = CameraTemplate({
                scope: {
                    id: this.options.id,
                    url: this.options.url
                }
            });

            this.on('ready', () => {
                resolve(this);
            });

            this.emit('ready');
        });
    }
};