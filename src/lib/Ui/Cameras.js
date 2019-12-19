import Module from "../Module.js";
import Camera from "./Camera.js";
import CamerasTemplate from "./Templates/Cameras.html";

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;

            this.label = 'CAMERAS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.items = [];

            this.target = toDOM(CamerasTemplate());
            this.parent.target.append(this.target);

            wait(0)
                .then(() => {
                    return new Camera({
                        parent: this,
                        options: {
                            id: 'camera-front',
                            url: 'http://192.168.100.177:8100/one',
                            device: '/dev/video1'
                        }
                    });
                })
                .then(frontCamera => {
                    this.frontCamera = frontCamera;
                    this.items.push(frontCamera);

                    return new Camera({
                        parent: this,
                        options: {
                            id: 'camera-rear',
                            url: 'http://192.168.100.177:8100/two',
                            device: '/dev/video0'
                        }
                    });
                })
                .then(rearCamera => {
                    this.rearCamera = rearCamera;
                    this.items.push(rearCamera);
                    this.subscribe();
                    this.emit('ready');
                });
        });
    }

    subscribe() {
        this.mqtt.subscribe('camera');
        this.mqtt.on('camera', data => {
            console.log(this.label, 'RECEIVING', data);

            const camera = this.getF('device', data.device);
            ['recording', 'snapshot', 'detection'].forEach(i => {
                if (data[i] !== undefined) {
                    camera[i] = data[i];
                    console.log('>>>>', i, camera[i]);
                }
            })
        });
    }
}
