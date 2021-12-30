class Swipe {
    constructor(element, options = {}) {
        this.element = (typeof(element) == 'string' ? document.querySelector(element) : element);
        this.cursor = false;
        this.options = {
            threshold: (options.hasOwnProperty('threshold') ? options.threshold : 100),
            duration: (options.hasOwnProperty('duration') ? options.duration : 0),
            position: (options.hasOwnProperty('position') ? options.position : 'full'),
            device: (options.hasOwnProperty('device') ? options.device : 'mobile'),
            test: (options.hasOwnProperty('test') ? options.test : false)
        };
        switch (this.options.device) {
            case 'mobile':
                this.element.addEventListener('touchstart', function(e) { this.handleTouchStart(e); }.bind(this), false);
                this.element.addEventListener('touchmove', function(e) { this.handleTouchMove(e); }.bind(this), false);
            break;
            case 'desktop':
                this.element.addEventListener('mousedown', function(e) { this.handleTouchStart(e); }.bind(this), false);
                this.element.addEventListener('mousemove', function(e) { this.handleTouchMove(e); }.bind(this), false);
                this.cursor = true;
            break;
            case 'both':
                this.element.addEventListener('touchstart', function(e) { this.handleTouchStart(e); }.bind(this), false);
                this.element.addEventListener('touchmove', function(e) { this.handleTouchMove(e); }.bind(this), false);
                this.element.addEventListener('mousedown', function(e) { this.handleTouchStart(e); }.bind(this), false);
                this.element.addEventListener('mousemove', function(e) { this.handleTouchMove(e); }.bind(this), false);
                this.cursor = true;
            break;
        }
    }

    run() {
        switch (this.options.device) {
            case 'mobile':
                this.element.addEventListener('touchend', function(e) { this.handleTouchEnd(); }.bind(this), false);
            break;
            case 'desktop':
                this.element.addEventListener('mouseup', function(e) { this.handleTouchEnd(); }.bind(this), false);
            break;
            case 'both':
                this.element.addEventListener('touchend', function(e) { this.handleTouchEnd(); }.bind(this), false);
                this.element.addEventListener('mouseup', function(e) { this.handleTouchEnd(); }.bind(this), false);
            break;
        }
    }

    left(callback) {
        this.onLeft = callback;
        return(this);
    }

    right(callback) {
        this.onRight = callback;
        return(this);
    }

    up(callback) {
        this.onUp = callback;
        return(this);
    }

    down(callback) {
        this.onDown = callback;
        return(this);
    }

    allowedPosition(position) {
        position = position.split(':');
        var side = position[0];
        var percentage = (typeof position[1] != 'undefined' ? position[1] : 100);
        var pWidth, pHeight;
        if (this.element == document) {
            pWidth = window.screen.width;
            pHeight = window.screen.height;
        }
        else {
            pWidth = this.element.offsetWidth;
            pHeight = this.element.offsetHeight;
        }
        switch (side) {
            case 'left':
                return(this.xDown <= Math.round(pWidth - (pWidth * percentage / 100)));
            case 'right':
                return(this.xDown > Math.round(pWidth - (pWidth * percentage / 100)));
            case 'top':
                return(this.yDown <= Math.round(pHeight - (pHeight * percentage / 100)));
            case 'bottom':
                return(this.yDown > Math.round(pHeight - (pHeight * percentage / 100)));
            default:
                return true;
        }
    }

    getX(e) {
        if (!!e.touches) {
            return(e.touches[0].clientX);
        }
        else {
            return(e.offsetX);
        }
    }

    getY(e) {
        if (!!e.touches) {
            return(e.touches[0].clientY);
        }
        else {
            return(e.offsetY);
        }
    }

    handleTouchStart(e) {
        if (this.cursor) { this.element.classList.add('cursor-grabbing'); }
        this.durationDown = Date.now();
        this.durationDiff = 0; 
        this.xDown = this.getX(e);
        this.yDown = this.getY(e);
        this.xDiff = 0;
        this.yDiff = 0;
        if (this.options.test) { this.drawStart(e); }
    }

    handleTouchMove(e) {
        if (!this.xDown || !this.yDown) { return; }
        this.durationDiff = Date.now() - this.durationDown;
        this.xDiff = this.xDown - this.getX(e);
        this.yDiff = this.yDown - this.getY(e);
        if (this.options.test) { this.drawEnd(e); }
    }

    handleTouchEnd() {
        if (this.cursor) { this.element.classList.remove('cursor-grabbing'); }
        var direction = '';
        if (this.allowedPosition(this.options.position)) {
            if ((Math.abs(this.xDiff) > Math.abs(this.yDiff))) {
                if (Math.abs(this.xDiff) > this.options.threshold && (this.options.duration === 0 || this.durationDiff < this.options.duration)) {
                    direction = (this.xDiff > 0 ? 'left' : 'right');
                }
            } 
            else {
                if (Math.abs(this.yDiff) > this.options.threshold && (this.options.duration === 0 || this.durationDiff < this.options.duration)) {
                    direction = (this.yDiff > 0 ? 'up' : 'down');
                }
            }
        }
        this.durationDiff = 0;
        this.xDiff = 0;
        this.yDiff = 0;
        switch (direction) {
            case 'left':
                if (!!this.onLeft) {
                    this.onLeft();
                }
            break;
            case 'right':
                if (!!this.onRight) {
                    this.onRight();
                }
            break;
            case 'up':
                if (!!this.onUp) {
                    this.onUp();
                }
            break;
            case 'down':
                if (!!this.onDown) {
                    this.onDown();
                }
            break;
        }
    }

    drawStart(e) {
        $(document.body).append(`<span style="background-color: red; width: 6px; height: 6px; position: absolute; top: ${this.yDown}px; left: ${this.xDown}px; z-index: 10000;"></span>`);
    }

    drawEnd(e) {
        if ((Math.abs(this.xDiff) > Math.abs(this.yDiff))) {
            if (Math.abs(this.xDiff) > this.options.threshold) {
                $(document.body).append(`<span style="background-color: green; width: 8px; height: 8px; position: absolute; top: ${this.yDown}px; left: ${this.getX(e)}px; z-index: 10000;"></span>`);
            }
            if (this.durationDiff > this.options.duration) {
                $(document.body).append(`<span style="background-color: blue; width: 5px; height: 5px; position: absolute; top: ${this.yDown}px; left: ${this.getX(e)}px; z-index: 10000;"></span>`);
            }
        }
        else {
            if (Math.abs(this.yDiff) > this.options.threshold) {
                $(document.body).append(`<span style="background-color: green; width: 8px; height: 8px; position: absolute; top: ${this.getY(e)}px; left: ${this.xDown}px; z-index: 10000;"></span>`);
            }
            if (this.durationDiff > this.options.duration) {
                $(document.body).append(`<span style="background-color: blue; width: 5px; height: 5px; position: absolute; top: ${this.getY(e)}px; left: ${this.xDown}px; z-index: 10000;"></span>`);
            }
        }
    }
}
