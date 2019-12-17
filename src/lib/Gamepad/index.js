/**
 * input controller for a two motored boat.
 * connect as usb game controller
 *
 * - throttle slider as axis 2
 * - yaw on axis 0
 * - button 7 as button 6 as the enable button
 * - fire button as button 0 as the the button to rotate the boat on place
 *
 */

import Module from '../Module.js';
import Throttle from './Throttle.js';
import Yaw from './Yaw.js';
import Button from './Button.js';

export default class extends Module {
    constructor(app) {
        super();
        return new Promise((resolve, reject) => {
            this.app = app;
            this.label = 'GAMEPAD';

            console.log(this.label, 'INIT');

            this.haveEvents = 'GamepadEvent' in window;
            this.haveWebkitEvents = 'WebKitGamepadEvent' in window;

            this.controllers = [];

            // throttle joystick
            this.options = {
                throttleAxisNumber: 2,
                yawAxisNumber: 0,
                enableButtonNumber: 6,
                rotationButtonNumber: 0,
                yawScale: {
                    in: {
                        min: 2,
                        max: 0,
                    },
                    out: {
                        min: -100,
                        max: 100,
                    }
                },
                throttleScale: {
                    in: {
                        min: 2,
                        max: 0,
                    },
                    out: {
                        min: -100,
                        max: 100,
                    }
                }
            };

            this.on('connect', gamepad => {
                console.log(this.label, 'CONNECTED:', gamepad);
            });

            console.log(this.label, 'SEARCHING FOR A GAME CONTROLLER...');

            if (this.haveEvents) {
                window.addEventListener("gamepadconnected", (e) => {
                    this.connectHandler(e);
                });
                window.addEventListener("gamepaddisconnected", (e) => {
                    this.disconnectHandler(e);
                });
            } else if (this.haveWebkitEvents) {
                window.addEventListener("webkitgamepadconnected", (e) => {
                    this.connectHandler(e);
                });
                window.addEventListener("webkitgamepaddisconnected", (e) => {
                    this.disconnectHandler(e);
                });
            } else {
                setInterval(() => {
                    this.scanGamepads();
                    console.log('>>>>', this.controllers);
                }, 500);
            }

            console.log(this.label, '>>> READY!');
            return resolve(this);
        });
    }

    connectHandler(e) {
        this.emit('connect', e.gamepad);
        this.addGamepad(e.gamepad);
    }

    disconnectHandler(e) {
        this.removeGamepad(e.gamepad);
        this.emit('disconnect');
    }

    removeGamepad(gamepad) {
        delete this.controllers[gamepad.index];
    }

    addGamepad(gamepad) {
        this.controllers[gamepad.index] = gamepad;
        console.log('>>>> CONTROLLERS ADDED', this.controllers);

        this.controller = this.controllers[0];

        /**
         * The enable button is a press or switch button
         * to make the vehicle movable.
         * If this button is not pressed,
         * the vehicle wont move.
         */
        this.enableButton = new Button('enable', this.controller, this.options.enableButtonNumber);

        /**
         *  the rotation button is the button to
         *  reverse one motor to rotate the vehicle
         *  on the place
         */
        this.rotationButton = new Button('rotation', this.controller, this.options.rotationButtonNumber);

        this.yaw = new Yaw(
            this.controller,
            this.options.yawAxisNumber,
            this.options.yawScale
        );

        /**
         * this makes the mqtt stuff
         */
        this.throttle = new Throttle({
            parent: this,
            options: {
                controller : this.controller,
                axisNumber: this.options.throttleAxisNumber,
                throttleScale: this.options.throttleScale,
                yaw: this.yaw,
                enableButton: this.enableButton,
                rotationButton: this.rotationButton
            }
        });

        this.throttle.on('change', () => {
            this.emit('change', this.throttle);
        });

        this.yaw.on('change', () => {
            this.throttle.calculateSides();
            this.throttle.publish();
            this.emit('change', this.yaw);
        });

        this.enableButton.on('change', () => {
            if (this.enableButton.value !== true) {
                this.throttle.reset();
            } else {
                this.throttle.calculateSides();
            }
            this.throttle.publish();
            this.emit('change', this.enableButton);
        });
        this.rotationButton.on('change', () => {
            this.throttle.calculateSides();
            this.throttle.publish();
            this.emit('change', this.rotationButton);
        });

        this.on('change', (e) => {
            //console.log(this.label, e.name, 'L', this.throttle.left, 'R', this.throttle.right, 'TN', this.throttle.normalized, 'TV', this.throttle.value);
            //document.getElementById('debug').innerHTML = `${this.label}  ${e.name} 'L'  ${this.throttle.left} 'R' ${this.throttle.right} 'TN' ${this.throttle.normalized} 'TV' ${this.throttle.value}`;
        });

        window.requestAnimationFrame(() => {
            this.readValues();
        });
    }

    readValues() {
        this.scanGamepads();

        this.throttle.mapValue();
        this.yaw.mapValue();
        this.enableButton.mapValue();
        this.rotationButton.mapValue();

        window.requestAnimationFrame(() => {
            this.readValues();
        });
    }

    scanGamepads() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in this.controllers)) {
                    this.addGamepad(gamepads[i]);
                } else {
                    this.controllers[gamepads[i].index] = gamepads[i];
                }
            }
        }
    }
}
