// template for renderers

var SoftwareRenderer = { ctx: null, canvas: null , imgData: null};

SoftwareRenderer.init = function(width, height, targetElement) {
    SoftwareRenderer.canvas = document.createElement("canvas");
    SoftwareRenderer.canvas.width = width;
    SoftwareRenderer.canvas.height = height;

    SoftwareRenderer.ctx = SoftwareRenderer.canvas.getContext('2d');
    SoftwareRenderer.ctx.fillStyle = "black";
    SoftwareRenderer.ctx.fillRect(0, 0, width, height);

    targetElement.innerHTML = "";
    targetElement.appendChild(SoftwareRenderer.canvas);

    SoftwareRenderer.ctx.textBaseline = "top";

    SoftwareRenderer.imgData = SoftwareRenderer.ctx.getImageData(0, 0, width, height);
}
SoftwareRenderer.resize = function(width, height) {}
SoftwareRenderer.unload = function () {}
SoftwareRenderer.render = function() {
    SoftwareRenderer.ctx.putImageData(SoftwareRenderer.imgData, 0, 0);
}

SoftwareRenderer.type = "SoftwareRenderer";

SoftwareRenderer.mixColor = function(a, b, t) {
    return {
        red: Math.floor(a.red + (b.red - a.red) * t), 
        green: Math.floor(a.green + (b.green - a.green) * t), 
        blue: Math.floor(a.blue + (b.blue - a.blue) * t), 
        opacity: Math.floor(a.opacity + (b.opacity - a.opacity) * t)
    }
}

// 2D
SoftwareRenderer.clear = function() { console.log("Draw.clear not implemented"); }
SoftwareRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) {
    const c = w3color(color);
    if (!filled) {
        SoftwareRenderer.line(x1, y1, x2, y2, c);
        SoftwareRenderer.line(x2, y2, x3, y3, c);
        SoftwareRenderer.line(x3, y3, x1, y1, c);
    } else {
        console.log("Draw.triangle [filled] not implemented");
    }
}
SoftwareRenderer.rect = function(x, y, width, height, color, filled) {
    const wcol = w3color(color);
    var imgData = SoftwareRenderer.imgData;

    if (filled) {
        for (let j = y; j < y+height; j++) {
            for (let i = x; i < x+width; i++) {
                imgData.data[0 + ((j * imgData.width) + i) * 4] = wcol.red;
                imgData.data[1 + ((j * imgData.width) + i) * 4] = wcol.green;
                imgData.data[2 + ((j * imgData.width) + i) * 4] = wcol.blue;
                imgData.data[3 + ((j * imgData.width) + i) * 4] = wcol.opacity * 255;
            }
        }
    } else {
        for (let i = x; i < x+width; i++) {
            imgData.data[0 + (((y) * imgData.width) + i) * 4] = wcol.red;
            imgData.data[1 + (((y) * imgData.width) + i) * 4] = wcol.green;
            imgData.data[2 + (((y) * imgData.width) + i) * 4] = wcol.blue;
            imgData.data[3 + (((y) * imgData.width) + i) * 4] = wcol.opacity * 255;

            imgData.data[0 + (((y+height) * imgData.width) + i) * 4] = wcol.red;
            imgData.data[1 + (((y+height) * imgData.width) + i) * 4] = wcol.green;
            imgData.data[2 + (((y+height) * imgData.width) + i) * 4] = wcol.blue;
            imgData.data[3 + (((y+height) * imgData.width) + i) * 4] = wcol.opacity * 255;
        }
        for (let j = y; j < y+height; j++) {
            imgData.data[0 + ((j * imgData.width) + x) * 4] = wcol.red;
            imgData.data[1 + ((j * imgData.width) + x) * 4] = wcol.green;
            imgData.data[2 + ((j * imgData.width) + x) * 4] = wcol.blue;
            imgData.data[3 + ((j * imgData.width) + x) * 4] = wcol.opacity * 255;

            imgData.data[0 + ((j * imgData.width) + x+width) * 4] = wcol.red;
            imgData.data[1 + ((j * imgData.width) + x+width) * 4] = wcol.green;
            imgData.data[2 + ((j * imgData.width) + x+width) * 4] = wcol.blue;
            imgData.data[3 + ((j * imgData.width) + x+width) * 4] = wcol.opacity * 255;
        }
    }
}
SoftwareRenderer.circle = function (x, y, radius, color, filled) {
    let c = w3color(color);
    let d2 = radius * radius;
    for (let j = -radius; j <= radius+1; j++) {
        for (let i = -radius; i <= radius+1; i++) {
            let d = i*i + j*j;
            if ((filled && d < d2) || (!filled && Math.abs(d2 - d)<Math.sqrt(d)))  {
                const index = ((Math.round(j+y) * SoftwareRenderer.imgData.width) + Math.round(i+x)) * 4;
                SoftwareRenderer.imgData.data[index + 0] = c.red; 
                SoftwareRenderer.imgData.data[index + 1] = c.green; 
                SoftwareRenderer.imgData.data[index + 2] = c.blue; 
            }
        }
    }
    // todo: bresenham it up
}
SoftwareRenderer.line = function (x1, y1, x2, y2, color, colorEnd) {
    x1 = Math.floor(x1);
    x2 = Math.floor(x2);
    y1 = Math.floor(y1);
    y2 = Math.floor(y2);

    const width = x2 - x1;
    const height = y2 - y1;
    const horizontal = Math.abs(width) >= Math.abs(height);

    var c1 = w3color(color);
    var c2 = c;
    var c = c1;
    const staticColor = colorEnd == null || color == colorEnd;
    if (!staticColor) {
        c2 = w3color(colorEnd);
    }

    let a1, a2, longside, shortside, da;

    if (horizontal) {
        a1 = x1;
        a2 = x2;
        shortside = y2 - y1;
    } else {
        a1 = y1;
        a2 = y2;
        shortside = x2 - x1;
    }
    da = Math.sign(a2 - a1);
    longside = a2 - a1;

    for (let a = a1; a != a2; a+=da) {
        const perc = (a - a1)/longside;
        const b = perc*shortside;

        let x, y;
        if (horizontal) {
            x = a; y = Math.floor(y1 + b);
        } else {
            y = a; x = Math.floor(x1 + b);
        }

        const index = ((y * SoftwareRenderer.imgData.width) + Math.floor(x)) * 4;
        if (!staticColor) {
            c = SoftwareRenderer.mixColor(c1, c2, perc);
        }
        SoftwareRenderer.imgData.data[index + 0] = c.red; 
        SoftwareRenderer.imgData.data[index + 1] = c.green; 
        SoftwareRenderer.imgData.data[index + 2] = c.blue; 
    }
}

SoftwareRenderer.text = function (text, x, y, color) { console.log("Draw.text not implemented"); }
SoftwareRenderer.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
SoftwareRenderer.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
SoftwareRenderer.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }
SoftwareRenderer.texture = function (texturePath, x, y, rectangle, transformation) {
    x = Math.floor(x);
    y = Math.floor(y);
    var textureData = Assets.imgData(texturePath);
    if (rectangle == null) {
        rectangle = {x: 0, y: 0, w: textureData.width, h:textureData.height};
    }

    for (let j = rectangle.y; j < rectangle.y + rectangle.h; j++) {
        for (let i = rectangle.x; i < rectangle.x + rectangle.w; i++) {
            const index = ((j * textureData.width) + i) * 4;
            if (textureData.data[index + 3] == 0) continue;

            const b = j - rectangle.y;
            const a = i - rectangle.x;

            const t_index = (((y+b) * SoftwareRenderer.imgData.width)+ (x+a)) * 4;
            SoftwareRenderer.imgData.data[t_index + 0] = textureData.data[index + 0];
            SoftwareRenderer.imgData.data[t_index + 1] = textureData.data[index + 1];
            SoftwareRenderer.imgData.data[t_index + 2] = textureData.data[index + 2];
            //SoftwareRenderer.imgData[t_index + 3] = textureData[index + 3];
        }
    }
}
SoftwareRenderer.fontHeight = 16;
SoftwareRenderer.fontWidth = 16;

// 3D
SoftwareRenderer.line3d = function (start, end, color, colorEnd) { console.log("Draw.line3d not implemented"); }
SoftwareRenderer.worldToScreenPoint = function (position) { console.log("Draw.worldToScreenPoint not implemented"); }
SoftwareRenderer.wireframe = function (modelPath, position, rotation, color, backfaceCulling, drawDepth, filled) { console.log("Draw.wireframe not implemented"); }
SoftwareRenderer.model = function (modelPath, position, rotation, shaderPath, parameters) { console.log("Draw.model not implemented"); }
SoftwareRenderer.setCamera = function (position, rotation) { console.log("Draw.setCamera not implemented"); }
SoftwareRenderer.getCameraTransform = function () { console.log("Draw.getCameraTransform not implemented"); }