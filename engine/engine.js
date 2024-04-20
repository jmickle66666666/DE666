(function () {
    var Engine = {}
    
    Engine.getTime = function () {
        return Date.now() / 1000;
    }

    function ipcMessage(object) {
        window.ipc.postMessage(JSON.stringify(object));
    }

    Engine.echo = function(message)  {ipcMessage({message:"echo", data:message})};

    Engine.setFullscreen = function(enabled) { ipcMessage({message: "fullscreen", fullscreen: enabled}); }
    Engine.toggleFullscreen = function() { ipcMessage({message: "fullscreen", fullscreen: "toggle"}); }
    Engine.setTitle = function(title) { ipcMessage({message: "title", title: title}); }
    Engine.setSize = function(x, y) { ipcMessage({message: "size", size: {x:x, y:y}}); }
    Engine.setResizable = function(enabled) { ipcMessage({message: "resizable", resizable: enabled}); }
    Engine.quit = function() { ipcMessage({message:"quit"}); }

    Engine.fileWriteText = function(path, data) { ipcMessage({message:"file_write", path:path, data:data}); }
    Engine.fileReadText = function(path, callback) {
        let listener = function(e) {
            callback(e.detail);
            window.removeEventListener("fileread", listener);
        };
        window.addEventListener("fileread", listener);
        
        ipcMessage({message:"file_read", path:path}); 
    }
    Engine.listFilesInDir = function(path, callback) {
        let listener = function(e) {
            callback(e.detail.split(','));
            window.removeEventListener("pathlist", listener);
        };
        window.addEventListener("pathlist", listener);
        
        ipcMessage({message:"path_list", path:path}); 
    }
    // Engine.fileExists = function(path) { ipcMessage({message:"file_exists", path:path}); }
    // Engine.fileDelete = function(path) { ipcMessage({message:"file_delete", path:path}); }

    window.Engine = Engine;
})();
