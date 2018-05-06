const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* 
    Measurements:
    One square: 3.42cm 
    Entire map: 35.28cm
    
    Canvas size: 1000px
    (35,28 / 3,45 = 10,31 => 1000 / 10,31 = 96,99 => 97)
    Square resized: 97px
    Run-time square width: 45 seconds

*/

window.onload = function () {
    window.activePoint = 0;
    window.points = [{
        "x": 829,
        "y": 313
    }, {
        "x": 367,
        "y": 522
    }];
    window.map = new Image();
    window.pin = new Image();
    map.src = "map.jpg"
    pin.src = "pin.png";
    calculateDistance();
    draw();
}

canvas.addEventListener("mousemove", e => {
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(e.clientX - rect.left);
    var y = Math.round(e.clientY - rect.top);
    // Add point
    window.pos = {x: x, y: y};
    if(getClosestPoint() !== false) canvas.style.cursor = "move"
        else canvas.style.cursor = "pointer"
    
    if(mouseDown){
        placeMarker(pos.x, pos.y, activePoint)
    }
})

function getClosestPoint(){
    for(let i = 0; i < points.length; i++){
        var pointDistance = distanceBetweenTwoPoints(pos.x, pos.y, points[i].x, points[i].y);
        if(pointDistance < 50) return i;
    }
    return false;
}

function distanceBetweenTwoPoints(x1, y1, x2, y2){
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

function clear(){
    points = [];
}


var mouseDown = false;
canvas.addEventListener("mousedown", e => {
    mouseDown = true;
    var closestPoint = getClosestPoint();
    if(closestPoint === false){
        points.push({x: pos.x, y: pos.y});
        activePoint = points.length-1;
    } else {
        activePoint = closestPoint;
    }
})
canvas.addEventListener("mouseup", e => {
    mouseDown = false;
    placeMarker(pos.x, pos.y, activePoint)
})


function calculateDistance() {
    //var deltaX = Math.abs(points[0].x - points[1].x);
    //var deltaY = Math.abs(points[0].y - points[1].y);
    //var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    var distance = 0;
    for(let i = 1; i < points.length; i++){
        distance += distanceBetweenTwoPoints(points[i-1].x, points[i-1].y, points[i].x, points[i].y)
        console.log("---------------------------");
        console.log("points[i-1].x, points[i-1].y, points[i].x, points[i].y", i, i-1);
        console.log(points[i-1].x, points[i-1].y, points[i].x, points[i].y);
        console.log(points);
    }

    window.time = (distance / 97) * 45; // Seconds
    window.meters = (distance / 97) * 250; // Meters
}

function draw() {
    ctx.drawImage(map, 0, 0);

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
    paddingX = -23.5;
    paddingY = -51;
    for (let i = 0; i < points.length; i++) {
        pinScale = .05;
        pinCenter = {
            x: points[i].x + ((pin.width / 2) * pinScale),
            y: points[i].y + (pin.height * pinScale)
        }
        ctx.drawImage(pin, pinCenter.x + paddingX, pinCenter.y + paddingY, pin.width * pinScale, pin.height * pinScale);
    }

    ctx.textAlign = "left";
    ctx.font = "25px 'Roboto', sans-serif";

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 850, 350, 500);

    ctx.fillStyle = "white";
    ctx.fillText("Distance (meters): " + Math.round(meters), 10, 980);
    ctx.fillText("Time to run (minutes): " + Math.round((time / 60) * 10) / 10, 10, 940);
    ctx.fillText("Time to run (seconds): " + Math.round((time) * 10) / 10, 10, 900);


    requestAnimationFrame(draw);
}