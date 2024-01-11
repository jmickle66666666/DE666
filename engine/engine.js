(function () {
    var Engine = {}
    
    Engine.getTime = function () {
        return Date.now() / 1000;
    }

    function ipcMessage(object) {
        window.ipc.postMessage(JSON.stringify(object));
    }

    Engine.setFullscreen = function(enabled) { ipcMessage({type:"window", fullscreen: enabled}); }
    Engine.toggleFullscreen = function() { ipcMessage({type:"window", fullscreen: "toggle"}); }
    Engine.setResizable = function(enabled) { ipcMessage({type:"window", resizable: enabled}); }
    Engine.setTitle = function(title) { ipcMessage({type:"window", title: title}); }
    Engine.setSize = function(x, y) { ipcMessage({type:"window", size: {x:x, y:y}}); }

    window.Engine = Engine;
})();



