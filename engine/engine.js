(function () {
    var Engine = {}
    
    Engine.getTime = function () {
        return Date.now() / 1000;
    }

    function ipcMessage(object) {
        window.ipc.postMessage(JSON.stringify(object));
    }

    Engine.setFullscreen = function(enabled) { ipcMessage({message: "fullscreen", fullscreen: enabled}); }
    Engine.toggleFullscreen = function() { ipcMessage({message: "fullscreen", fullscreen: "toggle"}); }
    Engine.setResizable = function(enabled) { ipcMessage({message: "resizable", resizable: enabled}); }
    Engine.setTitle = function(title) { ipcMessage({message: "title", title: title}); }
    Engine.setSize = function(x, y) { ipcMessage({message: "size", size: {x:x, y:y}}); }
    Engine.quit = function() { ipcMessage({message:"quit"}); }

    Engine.writeFileText = function(path, data) { ipcMessage({message:"write_file", path:path, data:data}); }

    window.Engine = Engine;
})();
