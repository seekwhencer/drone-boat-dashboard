import Module from "../Module.js";
import GridTemplate from './Templates/Grid.html';

export default class extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'GRID';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = document.getElementsByTagName('body')[0];
            this.draw();

            this.emit('ready');
        });
    }

    draw(){
        this.target.innerHTML = GridTemplate();
    }
}
