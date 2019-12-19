import Module from "../Module.js";
import Grid from './Grid.js';
import Header from './Header.js';
import Stage from './Stage.js';

export default class extends Module {
    constructor(app) {
        super();
        return new Promise((resolve, reject) => {
            this.app = app;
            this.label = 'UI';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY!');
                resolve(this);
            });

            wait(0)
                .then(() => {
                    return new Grid(this);
                })
                .then(grid => {
                    this.grid = grid;
                    return new Header(this);
                })
                .then(header => {
                    this.header = header;
                    return new Stage(this);
                })
                .then(stage => {
                    this.stage = stage;
                    this.emit('ready');
                });

        });
    }
}
