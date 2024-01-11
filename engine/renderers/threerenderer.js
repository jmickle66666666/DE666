var ThreeRenderer = { ctx: null, canvas: null, scene: null, camera: null, renderer: null, lights: null, width: 0, height: 0 };

ThreeRenderer.init = function(width, height, targetElement) {
    ThreeRenderer.scene = new THREE.Scene();
    ThreeRenderer.camera = new THREE.OrthographicCamera(0, width, 0, height, -1, 1000);
    // ThreeRenderer.camera.x = width;
    // ThreeRenderer.camera.y = height;
    ThreeRenderer.renderer = new THREE.WebGLRenderer();
    ThreeRenderer.renderer.setSize( width, height );
    ThreeRenderer.canvas = ThreeRenderer.renderer.domElement;

    ThreeRenderer.width = width;
    ThreeRenderer.height = height;

    targetElement.appendChild(ThreeRenderer.canvas);

    let dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.x = -1;
    dirLight.position.y = -2;
    dirLight.position.z = -2;

    let dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.x = 1;
    dirLight2.position.y = 2;
    dirLight2.position.z = -2;

    let ambLight = new THREE.AmbientLight(0xffffff, 0.0);

    ThreeRenderer.lights = new THREE.Group();
    ThreeRenderer.lights.add(dirLight);
    ThreeRenderer.lights.add(dirLight2);
    ThreeRenderer.lights.add(ambLight);

    ThreeRenderer.scene.add(ThreeRenderer.lights);
}
ThreeRenderer.resize = function(width, height) {}
ThreeRenderer.unload = function () {}
ThreeRenderer.render = function() {
    ThreeRenderer.renderer.render(ThreeRenderer.scene, ThreeRenderer.camera);
}

ThreeRenderer.type = "none";

// 2D
ThreeRenderer.clear = function() {
    ThreeRenderer.scene.clear();
    ThreeRenderer.scene.add(ThreeRenderer.lights);
}
ThreeRenderer.triangle = function(x1, y1, x2, y2, x3, y3, color, filled) {
    filled = true;
    if (!filled) {
        ThreeRenderer.line(x1, y1, x2, y2, color);
        ThreeRenderer.line(x2, y2, x3, y3, color);
        ThreeRenderer.line(x3, y3, x1, y1, color);
    } else {
        
        const shape = new THREE.Shape();
        shape.moveTo(x1, y1);
        shape.lineTo(x2, y2);
        shape.lineTo(x3, y3);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshPhongMaterial({color:w3color(color).toHexString()});
        material.side = THREE.DoubleSide;
        const mesh = new THREE.Mesh(geometry, material);
        ThreeRenderer.scene.add(mesh);
    }
}
ThreeRenderer.rect = function(x, y, width, height, color, filled) { console.log("Draw.rect not implemented"); }
ThreeRenderer.circle = function (x, y, radius, color, filled) {
    if (filled) {
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshPhongMaterial({color:w3color(color).toHexString()});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = x;
        sphere.position.y = y;
        ThreeRenderer.scene.add(sphere);
    } else {
        let segLength = Math.PI/16;
        for (let a = 0; a < Math.PI * 2; a += segLength) {
            let ang1x = x + Math.sin(a) * radius;
            let ang1y = y + Math.cos(a) * radius;
            let ang2x = x + Math.sin(a+segLength) * radius;
            let ang2y = y + Math.cos(a+segLength) * radius;
            ThreeRenderer.line(ang1x, ang1y, ang2x, ang2y, color);
        }
    }
}
ThreeRenderer.line = function (x1, y1, x2, y2, color, colorEnd) {
    const material = new THREE.MeshPhongMaterial({color:w3color(color).toHexString()});
    const geometry = new THREE.CylinderGeometry(1, 1, Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)), 8);
    const line = new THREE.Mesh(geometry, material);
    line.position.x = (x1+x2)/2;
    line.position.y = (y1+y2)/2;
    line.rotateZ(Math.atan2(y2-y1, x2-x1) + Math.PI/2);
    ThreeRenderer.scene.add(line);
}
ThreeRenderer.text = function (text, x, y, color) { console.log("Draw.text not implemented"); }
ThreeRenderer.colorBuffer = function (colors, x, y, width) { console.log ("Draw.colorBuffer not implemented"); }
ThreeRenderer.startBuffer = function (width, height) { console.log ("Draw.startBuffer not implemented"); }
ThreeRenderer.endBuffer = function () { console.log ("Draw.endBuffer not implemented"); }
ThreeRenderer.texture = function (texturePath, x, y, rectangle, transformation) { console.log("Draw.texture not implemented"); }
ThreeRenderer.fontHeight = 16;
ThreeRenderer.fontWidth = 16;