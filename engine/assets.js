var Assets = {};

Assets.textures = {};
Assets.texture = function(path) {
    if (!Assets.textures[path]) {
        var img = document.createElement("img");
        img.src = path;
        img.className = "hidden";
        document.body.appendChild(img);

        Assets.textures[path] = img;
    } 

    return Assets.textures[path];
}

Assets.imgDatas = {};
Assets.imgData = function(path) {
    if (!Assets.imgDatas[path]) {
        Assets.imgDatas[path] = {width:0, height:0, data:[]};
        
        var img = document.createElement("img");
        img.src = path;
        img.className = "hidden";
        document.body.appendChild(img);

        function loadit() {
            const temp_canvas = document.createElement("canvas");
            const temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = img.width;
            temp_canvas.height = img.height;
            temp_ctx.drawImage(img, 0, 0);
            Assets.imgDatas[path] = temp_ctx.getImageData(0, 0, img.width, img.height);
        };

        img.addEventListener('load', loadit);
    } 

    return Assets.imgDatas[path];
}