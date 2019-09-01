import Module from "../../Module.js";

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'DEBUG';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.emit('ready');
        });
    }
};