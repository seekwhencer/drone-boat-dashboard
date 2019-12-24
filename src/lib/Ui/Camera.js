import Module from "../Module.js";
import Crypto from 'crypto';

import CameraTemplate from './Templates/Camera.html'

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = args.parent;
            this.app = this.parent.app;
            this.mqtt = this.parent.app.mqtt;
            this.options = args.options;

            this.label = 'CAMERA';
            console.log(this.label, 'INIT', this.options.id);

            this.id = this.options.id;
            this.device = this.options.device;
            this.url = this.options.url;

            this.recording = false;
            this.snapshot = false;
            this.detection = false;

            this.target = toDOM(CameraTemplate({
                scope: {
                    id: this.id,
                    url: `${this.url}?${Crypto.createHash('md5').update(`${this.id}_${Date.now()}`).digest("hex")}`,
                    device: this.device
                }
            }));

            this.parent.target.append(this.target);

            this.video = this.target.querySelector('video');
            this.recordButton = this.target.querySelector('button[data-id=record]');
            this.snapshotButton = this.target.querySelector('button[data-id=snapshot]');
            this.detectionButton = this.target.querySelector('button[data-id=detection]');
            this.recordingState = this.target.getElementsByClassName('recording-state')[0];
            this.detectionState = this.target.getElementsByClassName('detection-state')[0];

            this.recordButton.onclick = () => {
                this.recording = !this.recording;
                this.publish({
                    device: this.device,
                    recording: this.recording
                });
                console.log(this.label, 'TOGGLE RECORDING:', this.recording);
            };

            this.snapshotButton.onclick = () => {
                this.publish({
                    device: this.device,
                    snapshot: true
                });
                setTimeout(() => {
                    this.publish({
                        device: this.device,
                        snapshot: false
                    });
                }, 500);

                console.log(this.label, 'SNAPSHOT');
            };

            this.detectionButton.onclick = () => {
                this.detection = !this.detection;
                this.publish({
                    device: this.device,
                    detection: this.detection
                });
                console.log(this.label, 'TOGGLE DETECTION:', this.detection);
            };

            this.video.onloadedmetadata = metadata => {
                this.video.play();
            };

            this.video.onended = () => {
                console.log(this.label, '>>>>>>>>>>>> ENDED', this.url);
            };

            this.video.onerror = () => {
                console.log(this.label, '>>>>>>>>>>>> ERRORED', this.url);
            };

            this.video.onpause = () => {
                console.log(this.label, '>>>>>>>>>>>> PAUSED', this.url);
            };

            this.video.onwaiting = () => {
                console.log(this.label, '>>>>>>>>>>>> WAITNG', this.url);
            };

            this.video.autoplay = false;
            this.video.src = this.url;

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.emit('ready');
        });
    }

    detect() {
        console.log('>>> DETECTING');
    }

    reload() {
        this.video.load();
    }

    publish(payload) {
        try {
            this.mqtt.publish(`camera`, payload);
        } catch (error) {
            console.log(this.label, error);
        }
    }

    get recording() {
        return this._recording;
    }

    set recording(value) {
        this._recording = value;
        try {
            if (this.recording === true) {
                this.recordButton.classList.add('active');
                this.recordingState.classList.add('active');
            } else {
                this.recordButton.classList.remove('active');
                this.recordingState.classList.remove('active');
            }
        } catch (e) {
            ///...
        }
    }

    get snapshot() {
        return this._snapshot;
    }

    set snapshot(value) {
        this._snapshot = value;
        try {
            if (this.snapshot === true) {
                this.snapshotButton.classList.add('active');
            } else {
                this.snapshotButton.classList.remove('active');
            }
        } catch (e) {
            //..
        }
    }

    get detection() {
        return this._detection;
    }

    set detection(value) {
        this._detection = value;
        try {
            if (this.detection === true) {
                this.detectionButton.classList.add('active');
                this.detectionState.classList.add('active');
            } else {
                this.detectionButton.classList.remove('active');
                this.detectionState.classList.remove('active');
            }
        } catch (e) {
            //..
        }
    }
}
