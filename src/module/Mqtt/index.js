import Module from "../Module.js";
import * as Mqtt from 'mqtt';
import Crypto from 'crypto';

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'MQTT';
            console.log(this.label, 'INIT');

            this.subscriptions = [];
            this.connect();

            this.on('message', (topic, message) => {
                this.emit(topic, JSON.parse(message));
            });

            this.on('ready', () => {
                resolve(this);
            });
        });
    }

    connect() {
        this.options = {
            host: '192.168.100.100',
            port: '9091',
            clientId: `browser_${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`,
            keepalive: 1,
            clean: false,
            reconnectPeriod: 1000 * 1
        };

        this.client = Mqtt.connect(this.options);

        this.client.on('connect', (conn) => {
            console.log(this.label, 'CONNECTED', conn);
            this.emit('ready');
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