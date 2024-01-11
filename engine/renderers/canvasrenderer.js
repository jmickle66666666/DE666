var CanvasRenderer = { name: "CanvasRenderer", ctx: null, canvas: null, font: {img: null, width:0, height:0, ctx:null, cnv:null, cnv_r:null, cnv_g:null, cnv_b:null} };

CanvasRenderer.init = function(width, height, targetElement) {
    if (CanvasRenderer.canvas != null) CanvasRenderer.canvas.remove();

    CanvasRenderer.canvas = document.createElement("canvas");
    CanvasRenderer.canvas.width = width;
    CanvasRenderer.canvas.height = height;
    //CanvasRenderer.canvas.style.position = "relative";

    CanvasRenderer.ctx = CanvasRenderer.canvas.getContext('2d');
    // CanvasRenderer.ctx.fillStyle = "black";
    // CanvasRenderer.ctx.fillRect(0, 0, width, height);

    targetElement.appendChild(CanvasRenderer.canvas);

    CanvasRenderer.ctx.textBaseline = "top";

    CanvasRenderer.ctx.imageSmoothingEnabled = false;
    CanvasRenderer.ctx.font = "bold 9px monospace";
    CanvasRenderer.ctx.textRendering = "optimizeSpeed";

    CanvasRenderer.loadFont("engine/fontsmall.png");
}

CanvasRenderer.loadFont = function(path) {
    if (CanvasRenderer.font.img != null) CanvasRenderer.font.img.remove();
    var img = document.createElement("img");
    img.src = path;
    img.className = "hidden";
    document.body.appendChild(img);
    function loadit() {
        var font = CanvasRenderer.font;
        font.width = img.width / 16;
        font.height = img.height / 8;
        
        CanvasRenderer.font.cnv = document.createElement("canvas");
        CanvasRenderer.font.cnv.width = font.width;
        CanvasRenderer.font.cnv.height = font.height;
        CanvasRenderer.font.ctx = CanvasRenderer.font.cnv.getContext('2d');

        CanvasRenderer.font.cnv_r = document.createElement("canvas");
        CanvasRenderer.font.cnv_g = document.createElement("canvas");
        CanvasRenderer.font.cnv_b = document.createElement("canvas");

        CanvasRenderer.font.cnv_r.width = img.width;
        CanvasRenderer.font.cnv_g.width = img.width;
        CanvasRenderer.font.cnv_b.width = img.width;

        CanvasRenderer.font.cnv_r.height = img.height;
        CanvasRenderer.font.cnv_g.height = img.height;
        CanvasRenderer.font.cnv_b.height = img.height;
        
        let ctx_r = CanvasRenderer.font.cnv_r.getContext('2d');
        let ctx_g = CanvasRenderer.font.cnv_g.getContext('2d');
        let ctx_b = CanvasRenderer.font.cnv_b.getContext('2d');

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
    CanvasRenderer.font.img = img;
}

CanvasRenderer.resize = function(width, height) {
    CanvasRenderer.canvas.width = width;
    CanvasRenderer.canvas.height = height;
}

CanvasRenderer.render = function() {
    // not necessary
}

CanvasRenderer.unload = function() {
    CanvasRenderer.canvas.remove();
    if (CanvasRenderer.font.img != null) CanvasRenderer.font.img.remove();
}

CanvasRenderer.type = "CanvasRenderer";

// 2D
CanvasRenderer.clear = function() { CanvasRenderer.ctx.clearRect(0, 0, CanvasRenderer.canvas.width, CanvasRenderer.canvas.height); }
CanvasRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) { 
    color = color.toRgbString();
    CanvasRenderer.ctx.beginPath();
    CanvasRenderer.ctx.moveTo(x1, y1);
    CanvasRenderer.ctx.lineTo(x2, y2);
    CanvasRenderer.ctx.lineTo(x3, y3);
    CanvasRenderer.ctx.closePath();

    if (filled) {
        CanvasRenderer.ctx.fillStyle = color;
        CanvasRenderer.ctx.fill();
    } else {
        CanvasRenderer.ctx.strokeStyle = color;
        CanvasRenderer.ctx.stroke();
    }
}
CanvasRenderer.rect = function(x, y, width, height, color, filled) { 
    color = color.toRgbString();
    if (filled) {
        CanvasRenderer.ctx.fillStyle = color; 
        CanvasRenderer.ctx.fillRect(x+0.5, y+0.5, width, height);
    } else {
        CanvasRenderer.ctx.strokeStyle = color;
        CanvasRenderer.ctx.strokeRect(x+0.5, y+0.5, width, height);
    } 
}
CanvasRenderer.circle = function (x, y, radius, color, filled) {
    color = color.toRgbString();
    CanvasRenderer.ctx.beginPath();
    CanvasRenderer.ctx.ellipse(x, y, radius, radius, 0, 0, 360);
    CanvasRenderer.ctx.closePath();
    if (filled) {
        CanvasRenderer.ctx.fillStyle = color; 
        CanvasRenderer.ctx.fill();
    } else {
        CanvasRenderer.ctx.strokeStyle = color;
        CanvasRenderer.ctx.stroke();
    } 
}
CanvasRenderer.line = function (x1, y1, x2, y2, color, colorEnd) {
    
    if (colorEnd == null) colorEnd = color;
    color = color.toRgbString();
    colorEnd = colorEnd.toRgbString();

    y1 += 0.5;
    y2 += 0.5;
    
    CanvasRenderer.ctx.beginPath();
    CanvasRenderer.ctx.moveTo(x1, y1);
    CanvasRenderer.ctx.lineTo(x2, y2);

    CanvasRenderer.ctx.strokeStyle = color;
    if (color != colorEnd) {
        const gradient = CanvasRenderer.ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color); 
        gradient.addColorStop(1, colorEnd);
        CanvasRenderer.ctx.strokeStyle = gradient; 
    }
    CanvasRenderer.ctx.stroke();
}
// CanvasRenderer.text = function (text, x, y, color) { 
//     color = color.toRgbString();
//     CanvasRenderer.ctx.fillStyle = color;
//     let lines = text.split('\n');
//     for (let i = 0; i < lines.length; i++) {
//         CanvasRenderer.ctx.fillText(lines[i], x, y + i*8);
//     }   
// }

CanvasRenderer.text = function (text, x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    function a(img, alpha) {
        CanvasRenderer.ctx.globalAlpha = alpha;
        let _x = x;
        let _y = y;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == "\n") {
                _x = x;
                _y += CanvasRenderer.font.height;
                continue;
            }

            if (text[i] != ' ') {
                CanvasRenderer.character(img, text[i].charCodeAt(0), _x, _y, color);
            }

            _x += CanvasRenderer.font.width;
        }
    }

    a(CanvasRenderer.font.img, 1.0);
    CanvasRenderer.ctx.globalCompositeOperation = "lighter";
    if (color.red > 0) a(CanvasRenderer.font.cnv_r, color.red/255);
    if (color.green > 0) a(CanvasRenderer.font.cnv_g, color.green/255);
    if (color.blue > 0) a(CanvasRenderer.font.cnv_b, color.blue/255);
    CanvasRenderer.ctx.globalAlpha = 1;
    CanvasRenderer.ctx.globalCompositeOperation = "source-over";
}

CanvasRenderer.character = function(img, char, x, y, color) {
    CanvasRenderer.ctx.drawImage(
        img, 
        (char % 16) * CanvasRenderer.font.width, 
        Math.floor(char / 16) * CanvasRenderer.font.height, 
        CanvasRenderer.font.width, CanvasRenderer.font.height,
        x, y, 
        CanvasRenderer.font.width, CanvasRenderer.font.height
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
            CanvasRenderer.ctx.translate(-transformation.origin.x, -transformation.origin.y);
        } else {
            transformation.origin = {x: 0, y: 0}
        }

        if (transformation.scale != null) {
            CanvasRenderer.ctx.translate(x, y);
            CanvasRenderer.ctx.translate(transformation.origin.x, transformation.origin.y);
            CanvasRenderer.ctx.scale(transformation.scale.x, transformation.scale.y);
            CanvasRenderer.ctx.translate(-x, -y);
            CanvasRenderer.ctx.translate(-transformation.origin.x, -transformation.origin.y);
        }

        if (transformation.rotation != null) {
            CanvasRenderer.ctx.translate(x, y);
            CanvasRenderer.ctx.translate(transformation.origin.x, transformation.origin.y);
            CanvasRenderer.ctx.rotate(transformation.rotation, transformation.rotation);
            CanvasRenderer.ctx.translate(-x, -y);
            CanvasRenderer.ctx.translate(-transformation.origin.x, -transformation.origin.y);
        }
        
    }
    if (rectangle != null) {
        CanvasRenderer.ctx.drawImage(texture, rectangle.x, rectangle.y, rectangle.w, rectangle.h, x, y, rectangle.w, rectangle.h);
    } else {
        CanvasRenderer.ctx.drawImage(texture, x, y);
    }
    CanvasRenderer.ctx.setTransform(1, 0, 0, 1, 0, 0);
}
CanvasRenderer.fontHeight = 16;
CanvasRenderer.fontWidth = 16;
CanvasRenderer.screenWidth = function() { return CanvasRenderer.ctx.width; }
