function Transform(x = 0, y = 0, angle = 0, scale = 1, origin = "center", parent = null) {
    return {
        
        _x: x,
        _y: y,
        _angle: angle,
        _scale: scale,
        origin: origin,

        parent: parent,
        get x() {
            if (this.parent == null) return this._x;
            return this.parent.x + (Math.cos(this.parent.angle) * this._x + Math.sin(this.parent.angle) * this._y) * this.scale;
        },
        get y() {
            if (this.parent == null) return this._y;
            return this.parent.y + (Math.sin(this.parent.angle) * this._x + Math.cos(this.parent.angle) * this._y) * this.scale;
        },
        get angle() {
            if (this.parent == null) return this._angle;
            return this.parent.angle + this._angle;
        },
        get scale() {
            if (this.parent == null) return this._scale;
            return this.parent.scale * this._scale;
        },
        get transformation() {
            return {
                origin : this.origin,
                rotation : this.angle,
                scale : {x: this.scale, y: this.scale},
            }
        } 

    };
}