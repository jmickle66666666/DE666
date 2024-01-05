// template for renderers

var Draw = { ctx: null, canvas: null };

Draw.init = function(width, height, targetElement) {}
Draw.resize = function(width, height) {}
Draw.unload = function () {}
Draw.render = function() {}

Draw.type = "none";

// 2D
Draw.clear = function() { console.log("Draw.clear not implemented"); }
Draw.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) { console.log("Draw.triangle not implemented"); }
Draw.rect = function(x, y, width, height, color, filled) { console.log("Draw.rect not implemented"); }
Draw.circle = function (x, y, radius, color, filled) { console.log("Draw.circle not implemented"); }
Draw.line = function (x1, y1, x2, y2, color, colorEnd) { console.log("Draw.line not implemented"); }
Draw.text = function (text, x, y, color) { console.log("Draw.text not implemented"); }
Draw.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
Draw.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
Draw.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }
Draw.texture = function (texturePath, x, y, rectangle, transformation) { console.log("Draw.texture not implemented"); }
Draw.fontHeight = 16;
Draw.fontWidth = 16;

// 3D
Draw.line3d = function (start, end, color, colorEnd) { console.log("Draw.line3d not implemented"); }
Draw.worldToScreenPoint = function (position) { console.log("Draw.worldToScreenPoint not implemented"); }
Draw.wireframe = function (modelPath, position, rotation, color, backfaceCulling, drawDepth, filled) { console.log("Draw.wireframe not implemented"); }
Draw.model = function (modelPath, position, rotation, shaderPath, parameters) { console.log("Draw.model not implemented"); }
Draw.setCamera = function (position, rotation) { console.log("Draw.setCamera not implemented"); }
Draw.getCameraTransform = function () { console.log("Draw.getCameraTransform not implemented"); }