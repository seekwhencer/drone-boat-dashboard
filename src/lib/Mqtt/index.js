import Module from "../Module.js";
import * as Mqtt from 'mqtt';
import Crypto from 'crypto';

export default class extends Module {
    constructor(app) {
        super();
        return new Promise((resolve, reject) => {
            this.app = app;
            this.label = 'MQTT';
            console.log(this.label, 'INIT');

            this.options = {
                host: this.app.options.mqtt_host || '192.168.100.100',
                port:  this.app.options.mqtt_port || '9091',
                reconnectPeriod: this.app.options.reconnectPeriod || (1000 * 1),
                clientId: `browser_${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`,
                keepalive: 1,
                clean: false
            };

            this.subscriptions = [];
            this.connect();

            /**
             * receive a message
             * get the topic from it
             * use the topic as event name
             */
            this.on('message', (topic, message) => {
                this.emit(topic, JSON.parse(message));
            });

            this.on('connect', connection => {
                console.log(this.label, '>>> CONNECTED!', connection);
                this.emit('ready');
            });

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });
        });
    }

    connect() {
        this.emit('connecting');
        this.client = Mqtt.connect(this.options);

        this.client.on('connect', (connection) => {
            this.emit('connect', connection);
        });

        this.client.on('message', (topic, message, packet) => {
            message = message.toString();
            topic = topic.toString();
            this.emit('message', topic, message, packet);
        });

        this.client.on('error', err => {
            console.log('?????????', err);
        });
    }

    subscribe(topic) {
        if (this.subscriptions.includes(topic))
            return false;

        console.log(this.label, 'SUBSCRIBING', topic);
        this.subscriptions.push(topic);
        this.client.subscribe(topic);
    }

    unsubscribe(topic) {
        if (!this.subscriptions.includes(topic))
            return false;

        console.log(this.label, 'UNSUBSCRIBE', topic);
        this.subscriptions = this.subscriptions.filter(i => i !== topic);
        this.client.unsubscribe(topic);
    }

    publish(topic, payload) {
        let _payload = Buffer.from(JSON.stringify(payload));
        this.client.publish(topic, _payload);
    }
}
