import './globals.js';
import DataSource from './module/Datasource';
import Gamepad from './module/Gamepad/index.js';
import Mqtt from './module/Mqtt/index.js';
import Dashboard from './module/Dashboard/index.js';

new DataSource().then(datasource => {
    window.DATASOURCE = datasource;
    return new Mqtt();
}).then(mqtt => {
    window.MQTT = mqtt;
    return new Gamepad();
}).then(gamepad => {
    window.GAMEPAD = gamepad;
    return new Dashboard();
}).then(dashboard => {
    global.DASHBOARD = dashboard;
    console.log();
    console.log('>>> ALL READY');
});

