import Module from "../Module.js";
import MqttMonitorTemplate from './Templates/MqttMonitor.html';
import MqttMonitorItemTemplate from './Templates/MqttMonitorItem.html';

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.ui = this.parent.parent;
            this.label = 'MQTT MONITOR';
            console.log(this.label, 'INIT', this.ui);

            this.on('ready', () => {
                resolve(this);
            });

            this.target = toDOM(MqttMonitorTemplate());
            this.parent.target.append(this.target);

            // listen here for all mqtt messages
            this.app.mqtt.on('message', (topic, message) => this.message(topic, message));

            // listen on a navigation menu click
            this.menuButton = this.ui.header.navigation.getF('field', 'mqtt monitor');
            this.menuButton.on('click', () => this.toggle());

            // listen to the window resize
            window.addEventListener('resize', () => this.resize());
            this.resize();

            this.emit('ready');
        });
    }

    message(topic, message) {
        if (!this.menuButton.active)
            return;

        const row = toDOM(MqttMonitorItemTemplate({
            scope: {
                topic: topic,
                message: message
            }
        }));
        this.target.prepend(row);
    }

    resize() {
        const height = this.parent.cameras.frontCamera.video.getBoundingClientRect().height;
        this.target.style.height = `${height}px`;
    }

    toggle() {
        this.menuButton.active ? this.target.classList.add('active') : this.target.classList.remove('active');
    }
}
