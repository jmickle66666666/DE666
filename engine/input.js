(function() {
    
    let Input = {};

    let keys = [];
    let keydowns = [];
    let keyups = [];
    Input.reset = function () {
        keydowns = [];
        keyups = [];
        buttonDowns = [];
        buttonUps = [];
    }

    Input.getKeyDown = function(key) {
        return keydowns.indexOf(key) != -1;
    }

    Input.getKeyUp = function(key) {
        return keyups.indexOf(key) != -1;
    }

    Input.getKey = function(key) {
        return keys.indexOf(key) != -1;
    }

    Input.keys = keys;
    Input.keyups = keyups;
    Input.keydowns = keydowns;
    Input.printKeypresses = false;

    Input.mouseX = 0;
    Input.mouseY = 0;
    let buttons = [];
    let buttonDowns = [];
    let buttonUps = [];

    Input.mouseDown = function(button) {
        return buttonDowns[button];
    }

    Input.mouseUp = function(button) {
        return buttonUps[button];
    }

    Input.mouse = function(button) {
        return buttons[button];
    }

    window.addEventListener("keydown", (e) => {
        if (!Input.getKey(e.key)) keys.push(e.key);
        keydowns.push(e.key);
        if (Input.printKeypresses) console.log(e.key);
    });

    window.addEventListener("keyup", (e) => {
        keys.splice(keys.indexOf(e.key), 1);
        keyups.push(e.key);
    });

    let mainElement = null;

    window.addEventListener("load", () => {
        mainElement = document.getElementById("main");
    });

    window.addEventListener("mousemove", (e) => {
        Input.mouseX = (e.clientX - parseInt(mainElement.style.left)) / parseInt(mainElement.style.width) * Draw.canvas.width;
        Input.mouseY = (e.clientY - parseInt(mainElement.style.top)) / parseInt(mainElement.style.height) * Draw.canvas.height;
    });

    window.addEventListener("mousedown", (e) => {
        buttonDowns[e.button] = true;
        buttons[e.button] = true;
    });

    window.addEventListener("mouseup", (e) => {
        buttonUps[e.button] = true;
        buttons[e.button] = false;
    });
    
    window.Input = Input;

})();