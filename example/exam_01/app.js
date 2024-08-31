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
    // console.log(`Analog Stick ${stickName} moved on Gamepad ${gamepadIndex}`, axesData);
    updateEle(axesData)
};

joyPilot.onStickRelease = (stickName, gamepadIndex, axesData) => {
    console.log(`Analog Stick ${stickName} released on Gamepad ${gamepadIndex}`, axesData);
    updateEle(axesData)
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

function updateEle(axesData) {
    // Update displayed axis values
    document.querySelector('#AXIS_0 span').innerHTML = axesData["Left Stick X"];
    document.querySelector('#AXIS_1 span').innerHTML = axesData["Left Stick Y"];
    document.querySelector('#AXIS_2 span').innerHTML = axesData["Right Stick X"];
    document.querySelector('#AXIS_3 span').innerHTML = axesData["Right Stick Y"];

    // Handle stick movement for both circles
    updateStickPosition('.circle-right', axesData["Right Stick X"], axesData["Right Stick Y"]);
    updateStickPosition('.circle-left', axesData["Left Stick X"], axesData["Left Stick Y"]);
}

function updateStickPosition(circleSelector, axisX, axisY) {
    const circle = document.querySelector(circleSelector);
    const point = circle.querySelector('.circle-point');

    const circleRadius = circle.clientWidth / 2; // Circle radius
    const pointRadius = point.clientWidth / 2;   // Point radius

    // Calculate final position of the point
    const finalX = circleRadius + (axisX * circleRadius) - pointRadius;
    const finalY = circleRadius + (axisY * circleRadius) - pointRadius;

    // Set the position of the point
    point.style.left = `${finalX}px`;
    point.style.top = `${finalY}px`;
}


