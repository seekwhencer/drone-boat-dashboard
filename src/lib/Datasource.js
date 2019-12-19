export default class {
    constructor(app) {
        return new Promise((resolve, reject) => {
            this.app = app;
            this.label = 'DATASOURCE';

            console.log(this.label, 'INIT');

            this.secret = this.app.options.secret || 'simsalabim';
            this.storage_prefix = this.app.options.storage_prefix || 'dbd_';
            this.cache_age = this.app.options.cache_age || 60 * 60; // seconds * minutes = (one) hour(s)
            this.storage = localStorage;

            console.log(this.label, '>>> READY!');
            return resolve(this);
        });
    }

    get(field) {
        console.log(this.label, '>>> GETTING STORAGE FIELD:', field);
        const key = `${this.storage_prefix}${field}`;
        const now = parseInt(Date.now() / 1000);
        if (this.storage[`${key}`]) {
            const date = parseInt(this.storage[`${key}_date`]);
            if (date < now - this.cache_age) {
                return false;
            }
            try {
                return JSON.parse(this.storage[`${key}`]);
            } catch (e) {
                return [];
            }
        }
    }

    set(field, data, hash) {
        if (!field || !data)
            return false;

        const key = `${this.storage_prefix}${field}`;
        try {
            this.storage[`${key}`] = JSON.stringify(data);
            this.storage[`${key}_date`] = parseInt(Date.now() / 1000);
            hash ? this.storage[`${key}_hash`] = hash : null;
        } catch (e) {
            console.log(this.label, '>>> ERROR', e);
        }
    }

    update(field, value){
        this.set(field, value);
    }

}
