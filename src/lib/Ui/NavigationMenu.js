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

            this.emit('ready');
        });
    }
}
