import Module from "../Module.js";
import MqttMonitorTemplate from './Templates/MqttMonitor.html';
import MqttMonitorItemTemplate from './Templates/MqttMonitorItem.html';

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'MQTT MONITOR';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = toDOM(MqttMonitorTemplate());
            this.parent.target.append(this.target);

            // listen here for any mqtt message
            this.app.mqtt.on('message', (topic, message) => this.message(topic, message));

            window.addEventListener('resize', () => this.resize());
            this.resize();
            this.emit('ready');
        });
    }

    message(topic, message) {
        const row = toDOM(MqttMonitorItemTemplate({
            scope: {
                topic: topic,
                message: message
            }
        }));
        this.target.prepend(row);
    }

    resize() {
        const height = this.parent.cameras.target.getBoundingClientRect().height;
        this.target.style.height = `${height}px`;
    }
}
