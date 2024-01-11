(function() {
    Math.lerp = function(a, b, t) {
        return b * t + (a * (1.0-t));
    };

    Math.quantize = function(a, q) {
        return Math.round(a * q) / q;
    }
})();