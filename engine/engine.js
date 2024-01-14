(function () {
    var Engine = {}
    
    Engine.getTime = function () {
        return Date.now() / 1000;
    }

    function ipcMessage(object) {
        window.ipc.postMessage(JSON.stringify(object));
    }

    Engine.setFullscreen = function(enabled) { ipcMessage({fullscreen: enabled}); }
    Engine.toggleFullscreen = function() { ipcMessage({fullscreen: "toggle"}); }
    Engine.setResizable = function(enabled) { ipcMessage({resizable: enabled}); }
    Engine.setTitle = function(title) { ipcMessage({title: title}); }
    Engine.setSize = function(x, y) { ipcMessage({size: {x:x, y:y}}); }
    Engine.quit = function() { ipcMessage({quit:"please"}); }

    window.Engine = Engine;
})();
