import Module from "../Module.js";
import Grid from './Compositions/Grid.js';
import Header from './Compositions/Header.js';
import Stage from './Compositions/Stage.js';


export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'DASHBOARD';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            new Grid().then(grid => {
                this.grid = grid;
                return new Header();
            }).then(header => {
                this.header = header;
                return new Stage();
            }).then(stage => {
                this.stage = stage;
                this.emit('ready');
            });

        });
    }
};