﻿(function () {

    var colorDevisor, width, height, largeHeader, canvas, ctx, points, target, animateHeader = true, animated = false;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        colorDevisor = (width + height) / 1020; 
        target = { x: width / 2, y: height / 2 };

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        ctx

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
            for (var y = 0; y < height; y = y + height / 20) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j];
                if (!(p1 === p2)) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] === undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var l = 0; l < 5; l++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[l])) {
                                closest[l] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (var point in points) {
            var c = new Circle(points[point], 2 + Math.random() * 2, 'rgba(66,137,169,.9)');
            points[point].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for (var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
            requestAnimationFrame(animate);
        }
    }

    function shiftPoint(p) {
        let rand = Math.random();
        TweenLite.to(p,
            10
            , {
                //x: p.originX - 50 + Math.random() * 100,
                //    y: p.originY - 50 + Math.random() * 100,

                x: p.originX + rand * (target.x - p.originX) / 1.2,
                y: p.originY + rand * (target.y - p.originY) / 1.2,

                ease: Circ.easeInOut,

                onComplete: function () {
                    shiftPoint(p);
                }
            });
    }

    function calculateColor(x, y) {
        let number = ((x + y) / colorDevisor)*2;
        //console.log(number);
        let r = 0, g = 0, b = 0;
        if (number > 0) {
            r = number;
        }
        if (number > 255) {
            r = 255;
            b = number - 255;
        }
        if (number > 510) {
            r = 765 - number;
            b = 255;
        }
        if (number > 765) {
            b = 255;
            g = number - 765
        }
        if (number > 1020) {
            b = 1020 - number;
            g = 255;
        }
        if (number > 1275) {
            g = 255;
            r = number - 1275;
        }
        if (number > 1530) {
            r = 255;
            g = 1785 - number;
        }

        return {
            r,
            g,
            b
        }
    }

    // Canvas manipulation
    function drawLines(p) {
        //if (!p.active) return;
        for (var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            var color = calculateColor(p.x, p.y);

            var gradient = ctx.createLinearGradient(0, 0, 170, 0);
            gradient.addColorStop("0",
                'rgba(' +
                color.r +
                ',' +
                color.g +
                ',' +
                color.b +
                ',' +
                (p.active * 1.50 + .10)
                +
                ')'
            );
            ctx.strokeStyle = gradient;

            //ctx.strokeStyle = 'rgba(' +
            //    color.r +
            //    ',' +
            //    color.g +
            //    ',' +
            //    color.b +
            //    ',' +
            //    (p.active * 1.50 + .35)
            //    +
            //    ')';

            //TweenLite.to(ctx, 10, {
            //    strokeStyle: 'rgba(' +
            //        (color.r)
            //        +
            //        ',' +
            //        (color.g)
            //        +
            //        ',' +
            //        (color.b)
            //        +
            //        ',' +
            //        (p.active * 1.50 + .35)
            //        +
            //        ')', ease: Cubic.easeOut
            //});
            
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function () {
            //if (!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,' +
                //(_this.active)
                .8
                + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();