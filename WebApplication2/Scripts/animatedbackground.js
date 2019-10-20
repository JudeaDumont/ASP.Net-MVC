(function () {

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
                    points[i].active = 0.17;
                    points[i].circle.active = 1;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.10;
                    points[i].circle.active = 0.98;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.05;
                    points[i].circle.active = 0.97;
                } else {
                    points[i].active = 0.01;
                    points[i].circle.active = 0.96;
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
        let number = ((x + y) / colorDevisor) * 1.75;
        if (number > 1785) {
            console.log(number);
        }
        let r = 0, g = 0, b = 0, a = 0;
        if (number > 1530) {
            r = 255;
            g = (1785 - number) * 1.7;
        }
        else if (number > 1275) {
            g = 255;
            r = (number - 1275) * 1.7;
        }
        else if (number > 1020) {
            b = (1275 - number) * 1.3;
            g = 255;
        }
        else if (number > 765) {
            b = 255;
            g = (number - 765);
        }
        else if (number > 510) {
            r = (765 - number) * 1.3;
            b = 255;
        }
        else if (number > 255) {
            r = 255;
            b = (number - 255) * 0.8;
        }
        else if (number > 0) {
            r = number;
        }



        if (r > 255) {
            r = 255;
        }
        else if (r < 0) {
            r = 0;
        }
        if (g > 255) {
            g = 255;
        }
        else if (g < 0) {
            g = 0;
        }
        if (b > 255) {
            b = 255;
        }
        else if (b < 0) {
            b = 0;
        }

        //a = 1 - (g/(r+b));
        if (g) {
            a = (g / 255) * 0.5;
        }
        else {
        }
        if (b > 200 && g < 150) {
            a = 1 - ((b * 0.9) / 255);
        }
        //console.log(`r:${r}, g:${g}, b:${b}, a:${a}`);
        return {
            r,
            g,
            b,
            a
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
                (p.active * 1.3 + .1 + (color.a)*0.3)
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
            ctx.fillStyle = 'rgba(0,0,8,' +
                //(_this.active)
                .4
                + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();