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

            this.target = toDOM(GridTemplate());
            this.app.target.append(this.target);
            this.app.target = this.target;

            this.emit('ready');
        });
    }
}
