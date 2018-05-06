/** 
 * FortniteMaps
 * Created by Yogsther 06/08-18
 * Fortnite Distance and ETA calculator 
 */

/* 
    Measurements: (From image)
    One square: 3.42cm 
    Entire map: 35.28cm
    
    Canvas size: 1000px
    (35,28 / 3,45 = 10,31 => 1000 / 10,31 = 96,99 => 97)
    Square resized: 97px
    Run-time square width: 45 seconds

    Scale .85;

*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const squareSize = 97;
const globalScale = .85;

var mouseDown = false;
var currentHoverPoint = -1;
var drawGrid = true;

window.onload = function () {
    /* Current active point */
    window.activePoint = 0;
    /* Preset points */
    window.points = [{"x":234,"y":267},{"x":312,"y":438},{"x":441,"y":507}];
    window.map = new Image();
    window.pin = new Image();
    window.pinSelected = new Image();
    map.src = "img/map.jpg"
    pin.src = "img/pin.png";
    pinSelected.src = "img/pin_selected.png";
    /* Pre calculate to make sure all variables are loaded. */
    calculateDistance();
    /* Initiate render */
    draw();
}

canvas.addEventListener("mousemove", e => {
    /* Get X and Y coordinates for the mouse */
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(e.clientX - rect.left);
    var y = Math.round(e.clientY - rect.top);

    window.pos = {
        x: x,
        y: y
    };
    currentHoverPoint = getClosestPoint()
    if (currentHoverPoint !== false) {
        /* User is hovering over a point */
        canvas.style.cursor = "move"
    } else {
        /* User is not hovering over a point */
        canvas.style.cursor = "pointer"
    }

    if (mouseDown) {
        /* If the mouse is down, continuously place the marker to update it's location to give it the drag feel. */
        placeMarker(pos.x, pos.y, activePoint)
    }
})

function getClosestPoint() {
    for (let i = 0; i < points.length; i++) {
        var pointDistance = distanceBetweenTwoPoints(pos.x, pos.y, points[i].x, points[i].y);
        if (pointDistance < 50) return i; /* Return what point the user is hovering over. */
    }
    return false; /* User is not hovering over a point */
}

function distanceBetweenTwoPoints(x1, y1, x2, y2) {
    /* Simple pythagorean theorem */
    var deltaX = Math.abs(x1 - x2);
    var deltaY = Math.abs(y1 - y2);
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

function placeMarker(x, y, id) {
    points[id % points.length] = {
        x: x,
        y: y
    };
    calculateDistance();
}

function clear() {
    /* Clear all points */
    points = [];
}


canvas.addEventListener("mousedown", e => {
    mouseDown = true;
    var closestPoint = getClosestPoint();
    if (closestPoint === false) {
        points.push({
            x: pos.x,
            y: pos.y
        });
        activePoint = points.length - 1;
    } else {
        activePoint = closestPoint;
    }
})
canvas.addEventListener("mouseup", e => {
    mouseDown = false;
    /* Place the marker once mouse has been released. */
    placeMarker(pos.x, pos.y, activePoint)
})


function calculateDistance() {
    //var deltaX = Math.abs(points[0].x - points[1].x);
    //var deltaY = Math.abs(points[0].y - points[1].y);
    //var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    var distance = 0;
    for (let i = 1; i < points.length; i++) {
        distance += distanceBetweenTwoPoints(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y)
    }
    distance /= globalScale;

    window.time = (distance / squareSize) * 45; // Seconds
    window.meters = (distance / squareSize) * 250; // Meters
}

function toggleGrid(bool) {
    drawGrid = bool;
}

function draw() {
    ctx.drawImage(map, 0, 0, map.width * globalScale, map.height * globalScale);

    if (drawGrid) {
        /* Grid */
        var gridOffsetX = 15 * globalScale;
        var gridOffsetY = 26 * globalScale;
        for (let i = gridOffsetX; i < canvas.width; i += squareSize * globalScale) {
            ctx.fillStyle = "rgba(50,50,50,0.6)";
            ctx.fillRect(i, 0, 1, canvas.height);
            ctx.fillRect(0, i + gridOffsetY, canvas.width, 1);
        }
    }


    /* Stroke */
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    /* Draw pins */
    paddingX = -23.5; // Dirty way of aligning to cursor
    paddingY = -51; // Dirty way of aligning to cursor
    for (let i = 0; i < points.length; i++) {
        pinScale = .05;
        pinCenter = {
            x: points[i].x + ((pin.width / 2) * pinScale),
            y: points[i].y + (pin.height * pinScale)
        }
        var texture = pin;
        /* Draw selected version of texture it the point is selected or close to cursor */
        if ((currentHoverPoint === i && !mouseDown) || (mouseDown && i == activePoint)) texture = pinSelected;
        ctx.drawImage(texture, pinCenter.x + paddingX, pinCenter.y + paddingY, pin.width * pinScale, pin.height * pinScale);
    }

    ctx.textAlign = "left";
    ctx.font = "24px 'Roboto', sans-serif";

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 700, 350, 500);

    ctx.fillStyle = "white";
    ctx.fillText("Distance (meters): " + Math.round(meters), 10, 830);
    ctx.fillText("Time to run (minutes): " + Math.round((time / 60) * 10) / 10, 10, 790);
    ctx.fillText("Time to run (seconds): " + Math.round((time) * 10) / 10, 10, 750);

    requestAnimationFrame(draw);
}