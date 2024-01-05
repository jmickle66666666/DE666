var CanvasRenderer = { ctx: null, canvas: null };

CanvasRenderer.init = function(width, height, targetElement) {
    CanvasRenderer.canvas = document.createElement("canvas");
    CanvasRenderer.canvas.width = width;
    CanvasRenderer.canvas.height = height;

    CanvasRenderer.ctx = CanvasRenderer.canvas.getContext('2d');
    CanvasRenderer.ctx.fillStyle = "black";
    CanvasRenderer.ctx.fillRect(0, 0, width, height);

    targetElement.innerHTML = "";
    targetElement.appendChild(CanvasRenderer.canvas);

    CanvasRenderer.ctx.textBaseline = "top";
}

CanvasRenderer.resize = function(width, height) {
    CanvasRenderer.canvas.width = width;
    CanvasRenderer.canvas.height = height;
}

CanvasRenderer.render = function() {
    // not necessary
}

CanvasRenderer.unload = function() {

}

CanvasRenderer.type = "CanvasRenderer";

// 2D
CanvasRenderer.clear = function() { CanvasRenderer.ctx.clearRect(0, 0, CanvasRenderer.canvas.width, CanvasRenderer.canvas.height); }
CanvasRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) { 
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
    if (filled) {
        CanvasRenderer.ctx.fillStyle = color; 
        CanvasRenderer.ctx.fillRect(x, y, width, height);
    } else {
        CanvasRenderer.ctx.strokeStyle = color;
        CanvasRenderer.ctx.strokeRect(x, y, width, height);
    } 
}
CanvasRenderer.circle = function (x, y, radius, color, filled) {
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
    x1 += 0.5;
    x2 += 0.5;
    y1 += 0.5;
    y2 += 0.5;
    if (colorEnd == null) colorEnd = color;

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
CanvasRenderer.text = function (text, x, y, color) { 
    CanvasRenderer.ctx.fillStyle = color;
    CanvasRenderer.ctx.fillText(text, x, y);
}
CanvasRenderer.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
CanvasRenderer.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
CanvasRenderer.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }
CanvasRenderer.texture = function (texturePath, x, y, rectangle, transformation) {
    var texture = Assets.texture(texturePath);
    // if (!texture) return;
    CanvasRenderer.ctx.drawImage(texture, x, y);
}
CanvasRenderer.fontHeight = 16;
CanvasRenderer.fontWidth = 16;
CanvasRenderer.screenWidth = function() { return CanvasRenderer.ctx.width; }

// 3D
CanvasRenderer.line3d = function (start, end, color, colorEnd) { console.log("Draw.line3d not implemented"); }
CanvasRenderer.worldToScreenPoint = function (position) { console.log("Draw.worldToScreenPoint not implemented"); }
CanvasRenderer.wireframe = function (modelPath, position, rotation, color, backfaceCulling, drawDepth, filled) { console.log("Draw.wireframe not implemented"); }
CanvasRenderer.model = function (modelPath, position, rotation, shaderPath, parameters) { console.log("Draw.model not implemented"); }
CanvasRenderer.setCamera = function (position, rotation) { console.log("Draw.setCamera not implemented"); }
CanvasRenderer.getCameraTransform = function () { console.log("Draw.getCameraTransform not implemented"); }