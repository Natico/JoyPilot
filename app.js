const joyPilot = new JoyPilot(0.1, 16,);

joyPilot.onPress = (buttonName, gamepadIndex, value) => {
    console.log(`${buttonName} pressed on Gamepad ${gamepadIndex} with value : ${value}`);
};

joyPilot.onRelease = (buttonName, gamepadIndex, value) => {
    console.log(`${buttonName} released on Gamepad ${gamepadIndex} with value : ${value}`);
};

joyPilot.onHold = (buttonName, gamepadIndex, value) => {
    console.log(`${buttonName} held on Gamepad ${gamepadIndex} with value : ${value}`);
};



joyPilot.onStickMove = (stickName, gamepadIndex, axesData) => {
    console.log(`Analog Stick ${stickName} moved on Gamepad ${gamepadIndex}`, axesData);
};

joyPilot.onStickRelease = (stickName, gamepadIndex, axesData) => {
    console.log(`Analog Stick ${stickName} released on Gamepad ${gamepadIndex}`, axesData);
};


// شروع تست با اتصال گیم‌پد
window.addEventListener("gamepadconnected", (event) => {
    joyPilot.connectGamepad(event.gamepad);
});

window.addEventListener("gamepaddisconnected", (event) => {
    joyPilot.disconnectGamepad(event.gamepad);
});




joyPilot.onConnect = (gamepadIndex) => {
    console.log(`Gamepad ${gamepadIndex} connected`);
};

joyPilot.onDisconnect = (gamepadIndex) => {
    console.log(`Gamepad ${gamepadIndex} disconnected`);
};