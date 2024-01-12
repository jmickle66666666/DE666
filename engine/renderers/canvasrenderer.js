(function() {

    let ctx = null;
    let canvas = null;
    let font = {img: null, width:0, height:0, ctx:null, cnv:null, cnv_r:null, cnv_g:null, cnv_b:null};

    let CanvasRenderer = { name: "CanvasRenderer", canvas: canvas, font: font};
    window.CanvasRenderer = CanvasRenderer;

    CanvasRenderer.init = function(width, height, targetElement) {
        if (CanvasRenderer.canvas != null) CanvasRenderer.canvas.remove();

        CanvasRenderer.canvas = document.createElement("canvas");
        canvas = CanvasRenderer.canvas;

        canvas.width = width;
        canvas.height = height;
        //CanvasRenderer.canvas.style.position = "relative";

        ctx = CanvasRenderer.canvas.getContext('2d');
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, width, height);

        targetElement.appendChild(canvas);

        ctx.textBaseline = "top";

        ctx.imageSmoothingEnabled = false;
        ctx.font = "bold 9px monospace";
        ctx.textRendering = "optimizeSpeed";

        loadFont("engine/fontsmall.png");
    }

    function loadFont(path) {
        if (font.img != null) font.img.remove();
        var img = document.createElement("img");
        img.src = path;
        img.className = "hidden";
        document.body.appendChild(img);
        function loadit() {
            font.width = img.width / 16;
            font.height = img.height / 8;
            
            font.cnv = document.createElement("canvas");
            font.cnv.width = font.width;
            font.cnv.height = font.height;
            font.ctx = font.cnv.getContext('2d');

            font.cnv_r = document.createElement("canvas");
            font.cnv_g = document.createElement("canvas");
            font.cnv_b = document.createElement("canvas");

            font.cnv_r.width = img.width;
            font.cnv_g.width = img.width;
            font.cnv_b.width = img.width;

            font.cnv_r.height = img.height;
            font.cnv_g.height = img.height;
            font.cnv_b.height = img.height;
            
            let ctx_r = font.cnv_r.getContext('2d');
            let ctx_g = font.cnv_g.getContext('2d');
            let ctx_b = font.cnv_b.getContext('2d');

            ctx_r.fillStyle = "#ff0000";
            ctx_r.fillRect(0, 0, img.width, img.height);
            ctx_r.globalCompositeOperation = "destination-atop"
            ctx_r.drawImage(img, 0, 0);
            ctx_g.fillStyle = "#00ff00";
            ctx_g.fillRect(0, 0, img.width, img.height);
            ctx_g.globalCompositeOperation = "destination-atop"
            ctx_g.drawImage(img, 0, 0);
            ctx_b.fillStyle = "#0000ff";
            ctx_b.fillRect(0, 0, img.width, img.height);
            ctx_b.globalCompositeOperation = "destination-atop"
            ctx_b.drawImage(img, 0, 0);
        };

        img.addEventListener('load', loadit);
        font.img = img;
    }

    CanvasRenderer.resize = function(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    CanvasRenderer.render = function() {
        // not necessary
    }

    CanvasRenderer.unload = function() {
        canvas.remove();
        if (font.img != null) font.img.remove();
    }

    // 2D
    CanvasRenderer.clear = function() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
    CanvasRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) { 
        color = color.toRgbString();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        if (filled) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    CanvasRenderer.rect = function(x, y, width, height, color, filled) { 
        color = color.toRgbString();
        if (filled) {
            ctx.fillStyle = color; 
            ctx.fillRect(x+0.5, y+0.5, width, height);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x+0.5, y+0.5, width, height);
        } 
    }

    CanvasRenderer.circle = function (x, y, radius, color, filled) {
        color = color.toRgbString();
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius, 0, 0, 360);
        ctx.closePath();
        if (filled) {
            ctx.fillStyle = color; 
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        } 
    }

    CanvasRenderer.line = function (x1, y1, x2, y2, color, colorEnd) {
        if (colorEnd == null) colorEnd = color;
        color = color.toRgbString();
        colorEnd = colorEnd.toRgbString();

        x1 = Math.round(x1);
        x2 = Math.round(x2);
        y1 = Math.round(y1);
        y2 = Math.round(y2);

        y1 += 0.5;
        y2 += 0.5;
        x1 += 0.5;
        x2 += 0.5;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = color;
        if (color != colorEnd) {
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, color); 
            gradient.addColorStop(1, colorEnd);
            ctx.strokeStyle = gradient; 
        }
        ctx.stroke();
    }

    CanvasRenderer.text = function (text, x, y, color) {
        x = Math.round(x);
        y = Math.round(y);
        function a(img, alpha) {
            ctx.globalAlpha = alpha;
            let _x = x;
            let _y = y;
            for (let i = 0; i < text.length; i++) {
                if (text[i] == "\n") {
                    _x = x;
                    _y += font.height;
                    continue;
                }

                if (text[i] != ' ') {
                    CanvasRenderer.character(img, text[i].charCodeAt(0), _x, _y);
                }

                _x += font.width;
            }
        }

        a(font.img, 1.0);
        ctx.globalCompositeOperation = "lighter";
        if (color.red > 0) a(font.cnv_r, color.red/255);
        if (color.green > 0) a(font.cnv_g, color.green/255);
        if (color.blue > 0) a(font.cnv_b, color.blue/255);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
    }

    CanvasRenderer.character = function(img, char, x, y) {
        if (!img) return;
        ctx.drawImage(
            img, 
            (char % 16) * font.width, 
            Math.floor(char / 16) * font.height, 
            font.width, font.height,
            x, y, 
            font.width, font.height
        );
    }

    CanvasRenderer.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
    CanvasRenderer.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
    CanvasRenderer.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }
    CanvasRenderer.texture = function (texturePath, x, y, rectangle, transformation) {
        var texture = Assets.texture(texturePath);
        x = Math.floor(x);
        y = Math.floor(y);
        if (transformation != null) {
            if (transformation.origin == "center") transformation.origin = {x : texture.width/2, y: texture.height/2};
            
            
            if (transformation.origin != null) {
                ctx.translate(-transformation.origin.x, -transformation.origin.y);
            } else {
                transformation.origin = {x: 0, y: 0}
            }

            if (transformation.scale != null) {
                ctx.translate(x, y);
                ctx.translate(transformation.origin.x, transformation.origin.y);
                ctx.scale(transformation.scale.x, transformation.scale.y);
                ctx.translate(-x, -y);
                ctx.translate(-transformation.origin.x, -transformation.origin.y);
            }

            if (transformation.rotation != null) {
                ctx.translate(x, y);
                ctx.translate(transformation.origin.x, transformation.origin.y);
                ctx.rotate(transformation.rotation, transformation.rotation);
                ctx.translate(-x, -y);
                ctx.translate(-transformation.origin.x, -transformation.origin.y);
            }
            
        }
        if (rectangle != null) {
            ctx.drawImage(texture, rectangle.x, rectangle.y, rectangle.w, rectangle.h, x, y, rectangle.w, rectangle.h);
        } else {
            ctx.drawImage(texture, x, y);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    fontHeight = 16;
    fontWidth = 16;
    CanvasRenderer.screenWidth = function() { return ctx.width; }

})();
