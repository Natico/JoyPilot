class JoyPilot {
    constructor(tolerance = 0.1, updateRate = 16, buttonMap, stickMap) {
        this.tolerance = tolerance;
        this.updateRate = updateRate;
        this.gamepads = [];
        this.onPress = null;
        this.onRelease = null;
        this.onHold = null;
        this.onStickMove = null;
        this.onStickRelease = null;
        this.onConnect = null;
        this.onDisconnect = null;
        this.previousAxes = {};
        this.previousButtons = {};
        this.isStickReleased = {}; // برای ردیابی وضعیت رها شدن استیک
        this.buttonMap = buttonMap || {
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
            12: 'DPad_Up',
            13: 'DPad_Down',
            14: 'DPad_Left',
            15: 'DPad_Right',
        };
        this.stickMap = stickMap || {
            0: 'Left_Stick_X',
            1: 'Left_Stick_Y',
            2: 'Right_Stick_X',
            3: 'Right_Stick_Y'
        };
    }

    connectGamepad(gamepad) {
        this.gamepads[gamepad.index] = gamepad;
        this.previousAxes[gamepad.index] = this._initializeAxesData();
        this.isStickReleased[gamepad.index] = false;
        if (this.onConnect) this.onConnect(gamepad.index);
        this.startLoop();
    }

    disconnectGamepad(gamepad) {
        delete this.gamepads[gamepad.index];
        if (this.onDisconnect) this.onDisconnect(gamepad.index);
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

    _initializeAxesData() {
        const axesData = {};
        for (const key in this.stickMap) {
            axesData[this.stickMap[key]] = 0;
        }
        return axesData;
    }

    updateGamepadState() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        gamepads.forEach((gamepad, gamepadIndex) => {
            if (gamepad) {
                // بررسی دکمه‌ها
                gamepad.buttons.forEach((button, buttonIndex) => {
                    const pressed = button.pressed;
                    const value = button.value;  // مقدار فشار
                    const buttonName = this.buttonMap[buttonIndex] || `Button ${buttonIndex}`;
                    if (pressed && !this.previousButtons[gamepadIndex]?.[buttonIndex]) {
                        if (this.onPress) this.onPress(buttonName, gamepadIndex, value);
                    } else if (!pressed && this.previousButtons[gamepadIndex]?.[buttonIndex]) {
                        if (this.onRelease) this.onRelease(buttonName, gamepadIndex, value);
                    } else if (pressed) {
                        if (this.onHold) this.onHold(buttonName, gamepadIndex, value);
                    }
                    this.previousButtons[gamepadIndex] = this.previousButtons[gamepadIndex] || [];
                    this.previousButtons[gamepadIndex][buttonIndex] = pressed;
                });

                // بررسی محورهای اهرم
                const axesData = this.previousAxes[gamepadIndex];
                let isStickMoved = false;

                gamepad.axes.forEach((axisValue, axisIndex) => {
                    const stickName = this.stickMap[axisIndex] || `Stick ${axisIndex}`;
                    if (Math.abs(axisValue) > this.tolerance) {
                        axesData[stickName] = axisValue;
                        isStickMoved = true;
                        this.isStickReleased[gamepadIndex] = false;
                    } else if (axesData[stickName] !== 0) {
                        axesData[stickName] = 0;
                    }
                });

                if (isStickMoved) {
                    if (this.onStickMove) {
                        this.onStickMove(null, gamepadIndex, { ...axesData });
                    }
                } else if (!this.isStickReleased[gamepadIndex]) {
                    if (this.onStickRelease) {
                        this.onStickRelease(null, gamepadIndex, { ...axesData });
                    }
                    this.isStickReleased[gamepadIndex] = true; // ثبت وضعیت رها شدن
                }
            }
        });
    }
}
