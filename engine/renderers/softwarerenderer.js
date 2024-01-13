(function() {
    
    let canvas = null;
    let ctx = null;
    let imgData = null;
    let font = {characters:[], width:0, height:0, img:null};
    let SoftwareRenderer = { name: "SoftwareRenderer", canvas: null , font:font};
    window.SoftwareRenderer = SoftwareRenderer;

    SoftwareRenderer.init = function(width, height, targetElement) {
        if (SoftwareRenderer.canvas != null) SoftwareRenderer.canvas.remove();
        
        canvas = document.createElement("canvas");
        SoftwareRenderer.canvas = canvas;
        canvas.width = width;
        canvas.height = height;

        ctx = SoftwareRenderer.canvas.getContext('2d');
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        targetElement.appendChild(canvas);

        ctx.textBaseline = "top";

        imgData = ctx.getImageData(0, 0, width, height);

        loadFont("engine/fontsmall.png");
    }

    function loadFont(texturePath) {
        if (font.img != null) font.img.remove()
        let img = document.createElement("img");
        font.img = img;
        img.src = texturePath;
        img.className = "hidden";
        document.body.appendChild(img);
        function loadit() {
            const temp_canvas = document.createElement("canvas");
            const temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = img.width;
            temp_canvas.height = img.height;
            temp_ctx.drawImage(img, 0, 0);
            var fontImgData = temp_ctx.getImageData(0, 0, img.width, img.height);

            font.width = img.width / 16;
            font.height = img.height / 8;

            for (let j = 0; j < 8; j++) {
                for (let i = 0; i < 16; i++) {
                    var character_index = i + j * 16;
                    var character = [];

                    for (let b = 0; b < font.height; b++) {
                        for (let a = 0; a < font.width; a++) {
                            var px = fontImgData.data[3 + ((a + i * font.width) + (b + j * font.height) * img.width) * 4];

                            character[a+b*font.width] = px > 10;
                        }
                    }

                    font.characters[character_index] = character;
                }
            }
        };

        img.addEventListener('load', loadit);
    }

    SoftwareRenderer.resize = function(width, height) {}
    SoftwareRenderer.unload = function () {
        canvas.remove();
        if (font.img != null) font.img.remove();
    }
    SoftwareRenderer.render = function() {
        ctx.putImageData(imgData, 0, 0);
    }

    SoftwareRenderer.mixColor = function(a, b, t) {
        return {
            red: Math.floor(a.red + (b.red - a.red) * t), 
            green: Math.floor(a.green + (b.green - a.green) * t), 
            blue: Math.floor(a.blue + (b.blue - a.blue) * t), 
            opacity: Math.floor(a.opacity + (b.opacity - a.opacity) * t)
        }
    }

    SoftwareRenderer.clear = function() {
        imgData.data = new Uint8ClampedArray(imgData.data.length);
    }

    SoftwareRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) {
        filled = false;
        if (!filled) {
            SoftwareRenderer.line(x1, y1, x2, y2, color);
            SoftwareRenderer.line(x2, y2, x3, y3, color);
            SoftwareRenderer.line(x3, y3, x1, y1, color);
        } else {
            console.log("Draw.triangle [filled] not implemented");
        }
    }

    SoftwareRenderer.rect = function(x, y, width, height, color, filled) {
        var w = imgData.width;

        if (filled) {
            for (let j = y; j < y+height; j++) {
                for (let i = x; i < x+width; i++) {
                    imgData.data[0 + ((j * w) + i) * 4] = color.red;
                    imgData.data[1 + ((j * w) + i) * 4] = color.green;
                    imgData.data[2 + ((j * w) + i) * 4] = color.blue;
                    imgData.data[3 + ((j * w) + i) * 4] = color.opacity * 255;
                }
            }
        } else {
            for (let i = x; i <= x+width; i++) {
                imgData.data[0 + (((y) * w) + i) * 4] = color.red;
                imgData.data[1 + (((y) * w) + i) * 4] = color.green;
                imgData.data[2 + (((y) * w) + i) * 4] = color.blue;
                imgData.data[3 + (((y) * w) + i) * 4] = color.opacity * 255;

                imgData.data[0 + (((y+height) * w) + i) * 4] = color.red;
                imgData.data[1 + (((y+height) * w) + i) * 4] = color.green;
                imgData.data[2 + (((y+height) * w) + i) * 4] = color.blue;
                imgData.data[3 + (((y+height) * w) + i) * 4] = color.opacity * 255;
            }
            for (let j = y; j <= y+height; j++) {
                imgData.data[0 + ((j * w) + x) * 4] = color.red;
                imgData.data[1 + ((j * w) + x) * 4] = color.green;
                imgData.data[2 + ((j * w) + x) * 4] = color.blue;
                imgData.data[3 + ((j * w) + x) * 4] = color.opacity * 255;

                imgData.data[0 + ((j * w) + x+width) * 4] = color.red;
                imgData.data[1 + ((j * w) + x+width) * 4] = color.green;
                imgData.data[2 + ((j * w) + x+width) * 4] = color.blue;
                imgData.data[3 + ((j * w) + x+width) * 4] = color.opacity * 255;
            }
        }
    }

    SoftwareRenderer.circle = function (x, y, radius, color, filled) {
        let d2 = radius * radius;
        for (let j = -radius; j <= radius+1; j++) {
            for (let i = -radius; i <= radius+1; i++) {
                let d = i*i + j*j;
                if ((filled && d < d2) || (!filled && Math.abs(d2 - d)<Math.sqrt(d)))  {
                    const index = ((Math.round(j+y) * imgData.width) + Math.round(i+x)) * 4;
                    imgData.data[index + 0] = color.red; 
                    imgData.data[index + 1] = color.green; 
                    imgData.data[index + 2] = color.blue; 
                    imgData.data[index + 3] = color.opacity * 255; 
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

        var c1 = color;
        var c2 = c;
        var c = c1;
        const staticColor = colorEnd == null || color == colorEnd;
        if (!staticColor) {
            c2 = colorEnd;
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

            if (x < 0 || x >= imgData.width) continue;
            if (y < 0 || y >= imgData.height) continue;
            
            const index = ((y * imgData.width) + Math.floor(x)) * 4;
            if (!staticColor) {
                c = SoftwareRenderer.mixColor(c1, c2, perc);
            }
            imgData.data[index + 0] = c.red; 
            imgData.data[index + 1] = c.green; 
            imgData.data[index + 2] = c.blue; 
            imgData.data[index + 3] = c.opacity * 255; 
        }
    }

    SoftwareRenderer.text = function (text, x, y, color) {
        let _x = x;
        let _y = y;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == "\n") {
                _x = x;
                _y += font.height;
                continue;
            }
            SoftwareRenderer.character(text[i], _x, _y, color);
            _x += font.width;
        }
    }

    SoftwareRenderer.character = function(char, x, y, color) {
        var characterIndex = char.charCodeAt(0);
        var character = font.characters[characterIndex];
        for (let j = 0; j < font.height; j++) {
            for (let i = 0; i < font.width; i++) {
                if (character[i + j * font.width]) {
                    var index = (Math.floor(x+i) + Math.floor(y+j) * imgData.width) * 4;
                    imgData.data [index + 0] = color.red;
                    imgData.data [index + 1] = color.green;
                    imgData.data [index + 2] = color.blue;
                    imgData.data [index + 3] = color.opacity * 255;
                }
            }
        }
    }

    SoftwareRenderer.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
    SoftwareRenderer.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
    SoftwareRenderer.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }

    SoftwareRenderer.texture = function (texturePath, x, y, rectangle, transformation) {
        var textureData = Assets.imgData(texturePath);
        if (rectangle == null) {
            rectangle = {x: 0, y: 0, w: textureData.width, h:textureData.height};
        }

        if (transformation != null) {
            if (transformation.origin == "center") {
                transformation.origin = {
                    x: textureData.width/2,
                    y: textureData.height/2,
                }
            }

            if (transformation.origin != null) {
                x -= transformation.origin.x;
                y -= transformation.origin.y;
            } else {
                transformation.origin = {
                    x: 0,
                    y: 0,
                }
            }
        } else {
            transformation = {origin:{x:0, y:0}};
        }

        x = Math.floor(x);
        y = Math.floor(y);
        let twidth = textureData.width;
        let swidth = imgData.width

        for (let j = rectangle.y; j < rectangle.y + rectangle.h; j++) {
            for (let i = rectangle.x; i < rectangle.x + rectangle.w; i++) {
                const index = ((j * twidth) + i) * 4;
                if (textureData.data[index + 3] == 0) continue;

                let b = j - rectangle.y;
                let a = i - rectangle.x;

                if (transformation.rotation != null) {
                    let rad = Math.quantize(transformation.rotation, 100);

                    while (rad < 0) { rad += (Math.PI * 2); }
                    rad %= Math.PI * 2;
                    
                    a -= transformation.origin.x;
                    b -= transformation.origin.y;

                    if (rad > Math.PI/2 && rad < 3*Math.PI/2) {
                        // quick rotation by 180 to avoid artifacts
                        rad -= Math.PI;
                        b = -b;
                        a = -a;
                    }

                    // shear 1
                    let tangent = Math.tan(rad/2);
                    let _xr = Math.floor(a - b*tangent);
                    let _yr = b;

                    // shear 2
                    _yr = Math.ceil(_xr*Math.sin(rad)+_yr);

                    // shear 3
                    _xr = Math.round(_xr-_yr*tangent);

                    a = _xr + transformation.origin.x;
                    b = _yr + transformation.origin.y;
                }

                function pixel (_x, _y) {
                    if (_x >= SoftwareRenderer.width || _x < 0 || _y >= SoftwareRenderer.height || _y < 0) return; 

                    const t_index = (_x + _y * swidth) * 4;
                    imgData.data[t_index + 0] = textureData.data[index + 0];
                    imgData.data[t_index + 1] = textureData.data[index + 1];
                    imgData.data[t_index + 2] = textureData.data[index + 2];
                    imgData.data[t_index + 3] = 255;
                }

                if (transformation.scale != null) {
                    a -= transformation.origin.x;
                    b -= transformation.origin.y;

                    transformation.scale.x = Math.quantize(transformation.scale.x, 100);
                    transformation.scale.y = Math.quantize(transformation.scale.y, 100);

                    let a1 = Math.round((a-0.5) * transformation.scale.x);
                    let a2 = Math.round((a+0.5) * transformation.scale.x);
                    let b1 = Math.round((b-0.5) * transformation.scale.y);
                    let b2 = Math.round((b+0.5) * transformation.scale.y);

                    a1 += transformation.origin.x;
                    b1 += transformation.origin.y;
                    a2 += transformation.origin.x;
                    b2 += transformation.origin.y;

                    for (let _b = b1; _b < b2; _b++) {
                        for (let _a = a1; _a < a2; _a++) {
                            let _x = Math.round(x+_a);
                            let _y = Math.round(y+_b);
                            pixel(_x, _y);
                        }
                    }
                } else {
                    let _x = Math.floor(x+a);
                    let _y = Math.floor(y+b);
                    pixel(_x, _y);
                }
            }
        }
    }
    fontHeight = 16;
    fontWidth = 16;
})();
