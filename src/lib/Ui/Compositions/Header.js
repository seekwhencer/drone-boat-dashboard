import Module from "../../Module.js";

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'HEADER';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.emit('ready');
        });
    }
}
