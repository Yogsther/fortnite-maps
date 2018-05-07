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
var globalScale = .85;
var camera = {x: 0, y: 0};

var mouseDown = false;
var distances = new Array();
var currentHoverPoint = -1;
var currentMidPoint = -1; // Only positive if the user is hovering over a mid-point.
var drawGrid = true;
var drawMidpoints = true;


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
        x: x / globalScale,
        y: y / globalScale
    };

    currentHoverPoint = getClosestPoint();

    if (currentHoverPoint !== false) {
        /* User is hovering over a point */
        canvas.style.cursor = "move"
    } else {
        /* User is not hovering over a point */
        canvas.style.cursor = "pointer"
    }

    currentMidPoint = getClosestMidPoint();

    if (mouseDown) {
        /* If the mouse is down, continuously place the marker to update it's location to give it the drag feel. */
        placeMarker(pos.x, pos.y, activePoint)
    }
})

canvas.oncontextmenu = function(e) {
    e.preventDefault();
};

function getClosestPoint() {
    for (let i = 0; i < points.length; i++) {
        var pointDistance = distanceBetweenTwoPoints(pos.x, pos.y, points[i].x, points[i].y);
        if (pointDistance < 50) return i; /* Return what point the user is hovering over. */
    }
    return false; /* User is not hovering over a point */
}

function getClosestMidPoint(){
    if(points.length > 1){ /* Only check for mid-points if there are more than 1 point */
    for(let i = 1; i < points.length; i++){
        pinCenter = {
            x: ((points[i].x + points[i - 1].x) / 2),
            y: ((points[i].y + points[i - 1].y) / 2)
        }
        var distanceFromCursor = distanceBetweenTwoPoints(pinCenter.x, pinCenter.y, pos.x, pos.y);
        if(distanceFromCursor < 50) return i;
        }
    return false;
    }
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
    activePoint = 0;
    calculateDistance();
}

canvas.addEventListener("mousedown", e => {
	var closestPoint = getClosestPoint();
	if(e.button != 2) {
      mouseDown = true;
      if(points.length < 1){
          // Allow draw out points if there are none placed.
          points.push({x: pos.x, y: pos.y});
          points.push({x: pos.x, y: pos.y});
          activePoint++;
          return;
      }
      if(closestPoint !== false) {
          activePoint = closestPoint;
      }
      else if(currentMidPoint !== false) {
          // !== needed, since !currentMidPoint will return true if the current mid-point is 0!
          points.splice(currentMidPoint, 0, {x: pos.x, y: pos.y});
          activePoint = currentMidPoint;
      }
      else if (closestPoint === false) {
        	points.push({
        		  x: pos.x,
        		  y: pos.y
          });
        	activePoint = points.length - 1;
        }
      } else {
          if (closestPoint !== false) {
              points.splice(closestPoint, 1);
          }
      }
})

canvas.addEventListener("mouseup", e => {
    /* Place the marker once mouse has been released. */
	if(e.button != 2) {
		mouseDown = false;
		placeMarker(pos.x, pos.y, activePoint)
	}
})

canvas.addEventListener("wheel", e => {
    globalScale+=e.deltaY * .01
    if(globalScale < .85) globalScale = .85;
})


function calculateDistance() {
    var distance = 0;
    distances = []; // Clear
    console.log("------------");
    for (let i = 1; i < points.length; i++) {
        var d = distanceBetweenTwoPoints(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y)
        distance += d
        console.log(d);
        distances.push(d);
    }
    console.log("="+distance);
    distance = (distance * .85) / globalScale;

    window.time = (distance / squareSize) * 45; // Seconds
    window.meters = (distance / squareSize) * 250; // Meters
}

function toggleGrid(bool) {
    drawGrid = bool;
}

function showMidpoints(bool) {
    drawMidpoints = bool;
}


function draw() {
    ctx.drawImage(map, 0, 0, map.width * globalScale, map.height * globalScale); /* Draw map */

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
    for (let i = 0; i < points.length; i++) ctx.lineTo(points[i].x * globalScale, points[i].y * globalScale);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    /* Draw points */
    paddingX = -25; // Dirty way of aligning to cursor
    paddingY = -39; // Dirty way of aligning to cursor

    pinScale = .05;
    for (let i = 0; i < points.length; i++) {
        pinCenter = {
            x: points[i].x + ((pin.width / 2) * pinScale),
            y: points[i].y + (pin.height * pinScale)
        }
        var texture = pin;
        /* Draw selected version of texture it the point is selected or close to cursor */
        if ((currentHoverPoint === i && !mouseDown) || (mouseDown && i == activePoint)) texture = pinSelected;
        ctx.drawImage(texture, (pinCenter.x + paddingX) * globalScale, (pinCenter.y + paddingY) * globalScale, pin.width * pinScale, pin.height * pinScale);
    }

	/* Midpoints */
	if(drawMidpoints) {
		pinScale = .025;
		for(let i = 1; i < points.length; i++) {
			pinCenter = {
				x: ((points[i].x + points[i - 1].x) / 2) + (1.5 * pin.width * pinScale),
				y: ((points[i].y + points[i - 1].y) / 2) + (2.5 * pin.height * pinScale)
			}
			var texture = pin;
            var shadowDistance = 1.8; // px
            ctx.textAlign = "center";
            ctx.font = "18px 'Roboto', sans-serif";
            ctx.fillStyle = "#111"; // Shadow

            //console.log(distances);
            var text =  (Math.round((distances[i - 1] / squareSize )* 250)) + "m";
            ctx.fillText(text, (pinCenter.x * globalScale) + paddingX + shadowDistance, (pinCenter.y * globalScale) + paddingY - 5 ) // Draw shadow for the text
            ctx.fillStyle = "white";
            ctx.fillText(text, (pinCenter.x * globalScale) + paddingX, (pinCenter.y * globalScale) + paddingY - 5) // Draw individual distance between points


            //Could obviously throw in a different texture here.
            if(currentMidPoint == i) texture = pinSelected;
			ctx.drawImage(texture, (pinCenter.x + paddingX) * globalScale, (pinCenter.y + paddingY) * globalScale, pin.width * pinScale, pin.height * pinScale);
		}
	}

    ctx.textAlign = "left";
    ctx.font = "24px 'Roboto', sans-serif";

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 750, 300, 300);

    ctx.fillStyle = "white";
    ctx.fillText("Distance (meters): " + Math.round(meters), 10, 830);
    //append 0 before seconds if neccessary
    var formattedSeconds = ("0" + Math.round(time % 60)).slice(-2);
    ctx.fillText("Time to run: " + Math.floor(time / 60) + ":" + formattedSeconds, 10, 790);

    requestAnimationFrame(draw);
}
