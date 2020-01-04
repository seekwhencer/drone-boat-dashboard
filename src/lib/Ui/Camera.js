import Module from "../Module.js";
import Crypto from 'crypto';
import flvjs from 'flv.js';

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
            this.url = `${this.options.url}?${Crypto.createHash('md5').update(`${this.id}_${Date.now()}`).digest("hex")}`;

            this.recording = false;
            this.snapshot = false;
            this.detection = false;

            this.reconnectTimer = false;

            if (flvjs.isSupported()) {
                console.log('>>>>>>>>>>>>> YAY');
            }


            this.target = toDOM(CameraTemplate({
                scope: {
                    id: this.id,
                    url: '',
                    device: this.device
                }
            }));

            this.parent.target.append(this.target);

            this.recordButton = this.target.querySelector('button[data-id=record]');
            this.snapshotButton = this.target.querySelector('button[data-id=snapshot]');
            this.detectionButton = this.target.querySelector('button[data-id=detection]');
            this.recordingState = this.target.querySelector('.recording-state');
            this.detectionState = this.target.querySelector('.detection-state');

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

            this.video = this.target.querySelector('video');
            this.player = flvjs.createPlayer({
                type: 'webm',
                isLive: true,
                url: this.url
            });

            this.video.onended = () => {
                console.log(this.label, '>>>>>>>>>>>> ENDED', this.url);
                this.target.classList.remove('playing');
                this.retry();
            };
            this.video.onerror = () => {
                console.log(this.label, '>>>>>>>>>>>> ERRORED', this.url);
                this.retry();
            };
            this.video.onpause = () => {
                console.log(this.label, '>>>>>>>>>>>> PAUSED', this.url);
                this.target.classList.remove('playing');
            };
            this.video.onwaiting = () => {
                console.log(this.label, '>>>>>>>>>>>> WAITNG', this.url);
            };
            this.video.onplay = () => {
                console.log(this.label, '>>>>>>>>>>>> PLAYING', this.url);
                this.target.classList.add('playing');
            };
            this.video.onstop = () => {
                console.log(this.label, '>>>>>>>>>>>> STOPPED', this.url);
                this.target.classList.remove('playing');
            };

            this.player.attachMediaElement(this.video);
            this.player.load();
            this.player.play();

            window.addEventListener('resize', () => this.resize());
            this.resize();

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

    load() {
        this.player.load();
        this.player.play();
    }

    play() {
        console.log(this.label, '>>>>>>>>>>>> PLAYING', this.url);
        this.video.play();
    }

    retry() {
        clearTimeout(this.reconnectTimer);
        console.log(this.label, '>>>>> RETRYING');
        this.reconnectTimer = setTimeout(() => {
            this.load();
        }, 1000);
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

    resize() {
        const width = this.target.getBoundingClientRect().width;
        const height = width / 1.77778;
        this.video.style.height = `${height}px`;
    }
}
