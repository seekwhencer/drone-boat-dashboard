export default class Log {
    constructor() {
        window.consoleLog = console.log;
        console.log = this.log;
    }

    log() {
        if (!window.dashboardOptions)
            return;

        if (!window.dashboardOptions.debug)
            return;

        window.consoleLog.apply(this, arguments);
    }
}
new Log();
