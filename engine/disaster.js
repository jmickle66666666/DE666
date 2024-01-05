function load_renderer(renderer) {
    if (Draw != null) Draw.unload();
    Draw = renderer;
    Draw.init(320, 240, document.body);
    fit_canvas(Draw.canvas);
}

function fit_canvas(canvas)
{
    let xscale = Math.max(1, Math.floor(window.innerWidth / canvas.width));
    let yscale = Math.max(1, Math.floor(window.innerHeight / canvas.height));

    let scale = Math.min(xscale, yscale);

    canvas.style.width = (scale * canvas.width)+"px";
    canvas.style.height = (scale * canvas.height)+"px";

    canvas.style.left = ((window.innerWidth - (scale * canvas.width))/2)+"px";
    canvas.style.top = ((window.innerHeight - (scale * canvas.height))/2)+"px";
}

window.onload = () => {
    load_renderer(CanvasRenderer);

    window.setInterval(tick, 1000/60);
    window.addEventListener("click", () => {
        load_renderer(Draw.type=="CanvasRenderer"?SoftwareRenderer:CanvasRenderer);
    });
}

function tick() {
    //Draw.clear();
    Draw.rect(0, 0, 320, 240, "black", true);
    Draw.text("Disaster Engine 666", 20 + Math.sin(Engine.getTime() * 1.0) * 10, 10, "#ffbb00");

    Draw.triangle(
        20 + Math.sin(Engine.getTime() * 1.0) * 10, 30, 
        30, 30 + Math.sin(1 + Engine.getTime() * 0.8) * 20,
        50, 50,
        "#ffbb00", Engine.getTime() % 1.0 < 0.5
    );

    Draw.circle(160, 120, 60 + Math.sin(Engine.getTime() * 0.49) * 50, "#fb0", Engine.getTime() % 2.5 < 1.25);

    Draw.line(100, 100, 50, 200, "#f0b", "#0fb");
    Draw.line(30, 100, 80, 120, "#fb0");

    for (let i = 0; i < 10; i++) {
        Draw.texture("engine/disaster.png", 20 + 20 * i, 50 + Math.cos(Engine.getTime() + i) * 20);
    }

    // Draw.line(20 + 0, 30 + 0, 20 + 20, 30 + 25, "#fb0");  // x1 < x2,   y1 < y2
    // Draw.line(50 + 0, 30 + 0, 50 + 20, 30 - 25, "#fb0");  // x1 < x2,   y1 > y2
    // Draw.line(80 + 20, 30 + 0, 80 + 0, 30 + 25, "#fb0");  // x1 > x2,   y1 < y1
    // Draw.line(110 + 20, 30 + 0, 110 + 0, 30 - 25, "#fb0");// x1 > x2,   y1 > y2

    Draw.render();
}

window.onresize = () => {fit_canvas(Draw.canvas);};