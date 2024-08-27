const gamepadManager = new JoyPilot(0.1, 16,);

gamepadManager.onPress = (buttonName, gamepadIndex) => {
    console.log(`${buttonName} pressed on Gamepad ${gamepadIndex}`);
};

gamepadManager.onRelease = (buttonName, gamepadIndex) => {
    console.log(`${buttonName} released on Gamepad ${gamepadIndex}`);
};

gamepadManager.onHold = (buttonName, gamepadIndex) => {
    console.log(`${buttonName} held on Gamepad ${gamepadIndex}`);
};

gamepadManager.onStickMove = (stickName, gamepadIndex, axesData) => {
    console.log(`Analog Stick ${stickName} moved on Gamepad ${gamepadIndex}`, axesData);
};

gamepadManager.onStickRelease = (stickName, gamepadIndex, axesData) => {
    console.log(`Analog Stick ${stickName} released on Gamepad ${gamepadIndex}`, axesData);
};


// شروع تست با اتصال گیم‌پد
window.addEventListener("gamepadconnected", (event) => {
    gamepadManager.connectGamepad(event.gamepad);
});

window.addEventListener("gamepaddisconnected", (event) => {
    gamepadManager.disconnectGamepad(event.gamepad);
});