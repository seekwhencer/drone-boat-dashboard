import Module from "../Module.js";
import NavigationTemplate from './Templates/Navigation.html';
import NavigationMenu from './NavigationMenu.js';

export default class extends Module {
    constructor(parent) {
        super(parent);
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.label = 'NAVIGATION';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.target = toDOM(NavigationTemplate());
            this.parent.target.append(this.target);
            this.fields = ['movement', 'recordings', 'snapshots', 'status','settings', 'mqtt monitor', 'logs'];

            this.fields.map(field => {
                new NavigationMenu({
                    parent: this,
                    options: {
                        field: field
                    }
                }).then(menu => this.items.push(menu));
            });

            this.emit('ready');
        });
    }
}
