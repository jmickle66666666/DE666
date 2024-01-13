class INI {
    constructor(text) {
        this.lines = text.split('\n');
    }

    getProperty(property, fallback = null) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].startsWith(property)) {
                return this.lines[i].split('=')[1].trim();
            }
        }
        return fallback;
    }

    setProperty(property, value) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].startsWith(property)) {
                this.lines[i] = property + " = " + value;
                return;
            }
        }
        this.lines.push(property + " = " + value);
    }

    stringify() {
        return this.lines.join('\n');
    }
}
