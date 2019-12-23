import Module from "../Module.js";
import PositionItemTemplate from './Templates/PositionItem.html';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = args.parent;
            this.app = this.parent.app;
            this.mqtt = this.app.mqtt;
            this.options = args.options;

            this.label = 'POSITION';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.field = this.options.field;
            this.target = toDOM(PositionItemTemplate({
                scope: {
                    field: this.field,
                    label: this.field,
                    value: 'n/a'
                }
            }));
            this.parent.target.append(this.target);
            this.emit('ready');
        });
    }

    update() {
        this.target.querySelector('.value').innerHTML = this.value;
    }

    set value(val) {
        this._value = val;
        this.update();
    }

    get value() {
        return this._value;
    }

    set field(val) {
        this._field = val;
    }

    get field() {
        return this._field;
    }


}
