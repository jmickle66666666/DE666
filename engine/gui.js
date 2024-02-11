(function() {
    var GUI = {};

    var style = {
        background: Color.blue,
        textColor: Color.yellow,
        padding: 2,
        shadow: Color.brown,
        highlight: Color.white,
        border: Color.maroon
    };

    function hover(x, y, width, height)
    {
        return (Input.mouseX >= x && Input.mouseX < x+width+style.padding*2 && Input.mouseY >= y && Input.mouseY < y+height+style.padding*2);
    }

    function background(x, y, width, height, color = null)
    {
        if (color == null) color = style.background;
        if (color != null) 
        {
            Draw.rect(x, y, width + style.padding*2, height + style.padding*2, color, true);
        }
    }

    function innerText(x, y, text)
    {
        Draw.text(text, x + style.padding, y + style.padding, style.textColor);
    }

    function label(x, y, text)
    {
        let width = text.length * Draw.font.width;
        let lines = text.split('\n');
        let height = lines.length * Draw.font.height;

        background(x, y, width, height);
        innerText(x, y, text);
    }

    function button(x, y, text)
    {
        let width = text.length * Draw.font.width;
        let lines = text.split('\n');
        let height = lines.length * Draw.font.height;
        let hovered = hover(x, y, width, height);
        let clicked = hovered && Input.mouse(0);

        let bgcol = style.background;
        if (hovered) bgcol = style.highlight;
        if (clicked) bgcol = style.shadow;
        background(x, y, width, height, bgcol);
        
        //Draw.rect(x, y, width+style.padding*2, height+style.padding*2, hovered?style.highlight:style.border, false);
        Draw.line(
            x, 
            clicked?y: 
            y + height + style.padding*2 -1, 
            x+width+style.padding*2,
            clicked?y: 
            y + height + style.padding*2 -1, 
            Color.black
        );

        Draw.line(
            clicked?x: 
            x + width + style.padding*2, 
            y,
            clicked?x: 
            x + width + style.padding*2,
            y+height+style.padding*2,
            Color.black
        );

        innerText(clicked?x+1:x, clicked?y+1:y, text);

        if (hovered && Input.mouseDown(0)) {
            return true;
        }
        return false;
    }

    function slider(x, y, width, height, value, min, max)
    {
        Draw.rect(x, y, width + style.padding*2, height + style.padding*2, style.shadow, true);

        let frac = (value - min) / (max-min);
        let fillWidth = Math.round(frac * (width + style.padding*2)); 

        Draw.rect(x, y, fillWidth, height + style.padding*2, style.background, true);
        
        let hovered = hover(x, y, width, height);
        if (hovered && Input.mouse(0)) { 
            return ((Input.mouseX - x) / (width+style.padding*2)) * (max-min);
        }
        return value;
    }

    GUI.label = label;
    GUI.button = button;
    GUI.slider = slider;
    GUI.style = style;
    window.GUI = GUI;
})();