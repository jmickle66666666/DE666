(function() {
    
    let Input = {};

    let keys = [];
    let keydowns = [];
    let keyups = [];
    Input.reset = function () {
        keydowns = [];
        keyups = [];
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

    window.addEventListener("keydown", (e) => {
        if (!Input.getKey(e.key)) keys.push(e.key);
        keydowns.push(e.key);
        if (Input.printKeypresses) console.log(e.key);
    });

    window.addEventListener("keyup", (e) => {
        keys.splice(keys.indexOf(e.key), 1);
        keyups.push(e.key);
    });

    window.addEventListener("mousemove", (e) => {

    });

    window.Input = Input;

})();