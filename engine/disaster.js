function load_renderer(renderer) {
    if (Draw != null) Draw.unload();
    Draw = renderer;
    Draw.init(320, 240, document.getElementById("main"));
}

let bad_scaling = false;

function fit_canvas(canvas)
{
    let xscale = Math.max(1, Math.floor(window.innerWidth / Draw.canvas.width));
    let yscale = Math.max(1, Math.floor(window.innerHeight / Draw.canvas.height));

    if (bad_scaling) {
        xscale = Math.max(1, (window.innerWidth / Draw.canvas.width));
        yscale = Math.max(1, (window.innerHeight / Draw.canvas.height));
    }

    let scale = Math.min(xscale, yscale);

    canvas.style.width = (scale * Draw.canvas.width)+"px";
    canvas.style.height = (scale * Draw.canvas.height)+"px";

    canvas.style.left = ((window.innerWidth - (scale * Draw.canvas.width))/2)+"px";
    canvas.style.top = ((window.innerHeight - (scale * Draw.canvas.height))/2)+"px";
}

window.onload = () => {
    load_renderer(CanvasRenderer);
    fit_canvas(document.getElementById("main"));
    window.setInterval(tick, 1000/60);

    fetch("disaster.ini").then(response => response.text()).then((data) =>{
        let config = new INI(data);

        let resolution = config.getProperty("resolution");
        if (resolution != null && resolution.indexOf("x") != -1) {
            Engine.setSize(
                parseInt(resolution.split('x')[0]),
                parseInt(resolution.split('x')[1])
            );
        }

        let renderer = config.getProperty("renderer").toLowerCase();
        if (renderer == "software") load_renderer(SoftwareRenderer);
        if (renderer == "canvas") load_renderer(CanvasRenderer);
        
        Engine.setFullscreen(config.getProperty("fullscreen") == "true");
    });
}

let lasttick = 0;

function tick() {
    lasttick = Date.now();
    if (Input.getKeyDown("1")) load_renderer(SoftwareRenderer);
    if (Input.getKeyDown("2")) load_renderer(CanvasRenderer);
    if (Input.getKeyDown("3")) load_renderer(ThreeRenderer);

    if (Input.getKey("Alt") && Input.getKeyDown("Enter")) {
        Engine.toggleFullscreen();
    }
    test_render(Draw);
    Input.reset();
    frametime = Date.now() - lasttick;
}

let angle = 0;
let target_angle = 0;

let scale = 1;
let target_scale = 1;

let bodyPos = Transform(160, 193, 0, 1, {x:44, y:60},null);
let headPos = Transform(5, -55, 0, 1, {x:36, y:64},bodyPos);
let armPos = Transform(45, -22, 0, 1, {x:4, y:52},bodyPos);

let talkout = {
    text:"what the fuck is she wearing? \ni need a drink \nlets get out of here", 
    words: 0, 
    next:function() { this.words += 1;}, 
    get:function(){return this.text.split(' ').slice(0, this.words).join(' ');}
}
function test_render(draw) {
    //draw.clear();
    // draw.rect(0, 0, 320, 240, "gray", true);

    draw.texture("sasha/bg.png", 0, 0);
    
    draw.text("Disaster Engine 666\n"+draw.name, 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10-1, Color.brown);
    draw.text("Disaster Engine 666\n"+draw.name, 1+ 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10, Color.brown);
    draw.text("Disaster Engine 666\n"+draw.name, 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10+1, Color.brown);
    draw.text("Disaster Engine 666\n"+draw.name, -1+20 + Math.sin(Engine.getTime() * 1.0) * 10, 10, Color.brown);
    draw.text("Disaster Engine 666\n"+draw.name, -1+20 + Math.sin(Engine.getTime() * 1.0) * 10, 10-1, Color.black);
    draw.text("Disaster Engine 666\n"+draw.name, 1+ 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10-1, Color.black);
    draw.text("Disaster Engine 666\n"+draw.name, 1+20 + Math.sin(Engine.getTime() * 1.0) * 10, 10+1, Color.black);
    draw.text("Disaster Engine 666\n"+draw.name, -1+20 + Math.sin(Engine.getTime() * 1.0) * 10, 10+1, Color.black);

    

    draw.text("Disaster Engine 666\n"+draw.name, 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10, Color.yellow);

    // for (let i = 0; i < 8; i++) {
    //     draw.texture("face.png", 20 + 40*i, 120, null, {
    //         origin : "center",
    //         rotation : i * 45,
    //     });
    // }

    draw.texture("sasha/body.png", bodyPos.x, bodyPos.y, null, bodyPos.transformation);
    draw.texture("sasha/head.png", headPos.x, headPos.y, null, headPos.transformation);
    draw.texture("sasha/arm.png", armPos.x, armPos.y, null, armPos.transformation);

    armPos._angle = Math.lerp(armPos._angle, 0, 0.15);
    headPos._angle = Math.lerp(headPos._angle, 0, 0.15);
    armPos._scale = Math.lerp(armPos._scale, 1, 0.15);
    headPos._scale = Math.lerp(headPos._scale, 1, 0.15);
    bodyPos._scale = Math.lerp(headPos._scale, 1, 0.15);

    if (Input.getKeyDown(" ")) {
        armPos._angle = (Math.random() < 0.5? 1 : -1)*0.2;
        headPos._angle = (Math.random() < 0.5? 1 : -1)*0.2;
        armPos._scale = (Math.random() < 0.5? 1.05 : 0.95);
        headPos._scale = (Math.random() < 0.5? 1.05 : 0.95);
        headPos._scale = (Math.random() < 0.5? 1.05 : 0.95);
        talkout.next();
    }

    if (talkout.words > 0) {
        draw.rect(30, 192, 200, 40, Color.black, false);
        draw.rect(30, 190, 200, 40, Color.maroon, true);
        draw.rect(30, 190, 200, 40, Color.black, false);
    }
    

    for(let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            draw.text(talkout.get(), 40+i, 200+j, Color.black);
        }
    }
    draw.text(talkout.get(), 40, 200, Color.yellow);

    let mcolor = Color.yellow;
    if (Input.mouse(0)) mcolor = Color.red;
    if (Input.mouseUp(0)) mcolor = Color.black;
    if (Input.mouseDown(0)) mcolor = Color.white;
    if (Input.mouse(2)) mcolor = Color.brown;
    if (Input.mouseUp(2)) mcolor = Color.maroon;
    if (Input.mouseDown(2)) mcolor = Color.blue;

    draw.line(Input.mouseX, 0, Input.mouseX, 240, mcolor);
    draw.line(0, Input.mouseY, 320, Input.mouseY, mcolor);

    // draw.texture("face.png", transformOne.x, transformOne.y, null, transformOne.transformation);

    // draw.texture("face.png", transformTwo.x, transformTwo.y, null, transformTwo.transformation);

    // if (Input.getKey("ArrowLeft")) target_angle -= Math.PI/100;
    // if (Input.getKey("ArrowRight")) target_angle += Math.PI/100;
    
    // transformOne._angle = Math.lerp(transformOne._angle, target_angle, 0.25);
    // transformTwo._angle = Math.lerp(transformTwo._angle, target_angle, 0.25);

    // if (Input.getKeyDown("ArrowUp")) target_scale += 0.5;
    // if (Input.getKeyDown("ArrowDown")) target_scale -= 0.5;
    // transformOne._scale = Math.lerp(transformOne._scale, target_scale, 0.25);

    // draw.triangle(
    //     20 + Math.sin(Engine.getTime() * 1.0) * 10, 30, 
    //     30, 30 + Math.sin(1 + Engine.getTime() * 0.8) * 20,
    //     50, 50,
    //     "#ffbb00", Engine.getTime() % 1.0 < 0.5
    // );

    // draw.circle(200, 120, 60 + Math.sin(Engine.getTime() * 0.49) * 50, "#fb0", Engine.getTime() % 2.5 < 1.25);

    // draw.line(100, 100, 50, 200, "#f0b", "#0fb");
    // draw.line(30, 100, 80, 120, "#fb0");

    // for (let i = 0; i < 10; i++) {
    //     draw.texture("engine/disaster.png", 20 + 20 * i, 50 + Math.cos(Engine.getTime() + i) * 20);
    // }

    // draw.texture("engine/disaster.png", 20 + 20, 70 + Math.cos(Engine.getTime()) * 20, {x:8, y:8, w:8, h:8});

    //draw.text(`${frametime}`, 0, 0, Color.yellow);
    draw.line(0, 0, 16, 0, Color.black);
    draw.line(0, 0, frametime, 0, frametime>16?Color.red:Color.yellow);
    draw.render();
}

let frametime = 0;

window.onresize = () => {fit_canvas(document.getElementById("main"));};