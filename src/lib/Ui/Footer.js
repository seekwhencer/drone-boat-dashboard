import Module from "../Module.js";
import FooterTemplate from './Templates/Footer.html';

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'FOOTER';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.target = toDOM(FooterTemplate());
            this.app.target.append(this.target);

            this.emit('ready');
        });
    }
}
