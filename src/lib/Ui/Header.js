import Module from "../Module.js";
import Navigation from "./Navigation.js";
import HeaderTemplate from './Templates/Header.html';

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'HEADER';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            this.target = toDOM(HeaderTemplate());
            this.app.target.append(this.target);

            new Navigation(this).then(navigation => this.navigation = navigation);

            this.emit('ready');
        });
    }
}
