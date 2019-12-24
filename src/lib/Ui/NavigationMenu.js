import Module from "../Module.js";
import NavigationMenuTemplate from './Templates/NavigationMenu.html';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = args.parent;
            this.app = this.parent.app;
            this.options = args.options;
            this.label = 'NAVIGATION MENU';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.field = this.options.field;
            this.target = toDOM(NavigationMenuTemplate({
                scope: {
                    field: this.field,
                    label: this.field,
                }
            }));
            this.parent.target.append(this.target);

            this.button = this.target;
            this.button.onclick = () => this.toggle();

            this.emit('ready');
        });
    }

    toggle() {
        this.active ? this.active = false : this.active = true;
        this.emit('click', this);
    }

    get active() {
        return this._active;
    }

    set active(val) {
        this._active = val;
        this.active ? this.button.classList.add('active') : this.button.classList.remove('active');
    }
}
