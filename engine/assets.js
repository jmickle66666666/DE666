(function(){
    window.Assets = {};

    textures = {};
    Assets.texture = function(path) {
        if (!textures[path]) {
            var img = document.createElement("img");
            img.src = path;
            img.className = "hidden";
            document.body.appendChild(img);

            textures[path] = img;
        } 

        return textures[path];
    }

    imgDatas = {};
    Assets.imgData = function(path) {
        if (!imgDatas[path]) {
            imgDatas[path] = {width:0, height:0, data:[]};
            
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
                imgDatas[path] = temp_ctx.getImageData(0, 0, img.width, img.height);
            };

            img.addEventListener('load', loadit);
        } 

        return imgDatas[path];
    }
})();
