class JoyPilot {
    constructor(tolerance = 0.1, updateRate = 16) {
        this.tolerance = tolerance;
        this.updateRate = updateRate;
        this.gamepads = [];
        this.onPress = null;
        this.onRelease = null;
        this.onHold = null;
        this.onStickMove = null;
        this.onStickRelease = null;
        this.previousAxes = {};
        this.previousButtons = {};
        this.buttonMap = {
            0: 'A',
            1: 'B',
            2: 'X',
            3: 'Y',
            4: 'LB',
            5: 'RB',
            6: 'LT',
            7: 'RT',
            8: 'Back',
            9: 'Start',
            10: 'LS',
            11: 'RS',
            12: 'DPad Up',
            13: 'DPad Down',
            14: 'DPad Left',
            15: 'DPad Right'
        };
        this.stickMap = {
            0: 'Left Stick X',
            1: 'Left Stick Y',
            2: 'Right Stick X',
            3: 'Right Stick Y'
        };
    }

    connectGamepad(gamepad) {
        this.gamepads[gamepad.index] = gamepad;
        this.startLoop();
    }

    disconnectGamepad(gamepad) {
        delete this.gamepads[gamepad.index];
        if (Object.keys(this.gamepads).length === 0) {
            this.stopLoop();
        }
    }

    startLoop() {
        this.loopId = setInterval(this.update.bind(this), this.updateRate);
    }

    stopLoop() {
        clearInterval(this.loopId);
    }

    update() {
        this.updateGamepadState();
    }

    updateGamepadState() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        gamepads.forEach((gamepad, gamepadIndex) => {
            if (gamepad) {
                // بررسی دکمه‌ها
                gamepad.buttons.forEach((button, buttonIndex) => {
                    const pressed = button.pressed;
                    const buttonName = this.buttonMap[buttonIndex] || `Button ${buttonIndex}`;
                    if (pressed && !this.previousButtons[gamepadIndex]?.[buttonIndex]) {
                        if (this.onPress) this.onPress(buttonName, gamepadIndex);
                    } else if (!pressed && this.previousButtons[gamepadIndex]?.[buttonIndex]) {
                        if (this.onRelease) this.onRelease(buttonName, gamepadIndex);
                    } else if (pressed) {
                        if (this.onHold) this.onHold(buttonName, gamepadIndex);
                    }
                    this.previousButtons[gamepadIndex] = this.previousButtons[gamepadIndex] || [];
                    this.previousButtons[gamepadIndex][buttonIndex] = pressed;
                });

                // بررسی محورهای اهرم
                const axesData = {};
                gamepad.axes.forEach((axisValue, axisIndex) => {
                    const stickName = this.stickMap[axisIndex] || `Stick ${axisIndex}`;
                    axesData[stickName] = axisValue;
                    
                    if (Math.abs(axisValue) > this.tolerance) {
                        if (this.onStickMove) {
                            this.onStickMove(stickName, gamepadIndex, axesData);
                        }
                        this.previousAxes[gamepadIndex] = this.previousAxes[gamepadIndex] || {};
                        this.previousAxes[gamepadIndex][axisIndex] = axisValue;
                    } else {
                        if (this.onStickRelease && this.previousAxes[gamepadIndex]?.[axisIndex] !== undefined) {
                            this.onStickRelease(stickName, gamepadIndex, axesData);
                            this.previousAxes[gamepadIndex][axisIndex] = undefined;
                        }
                    }
                });
            }
        });
    }
}
