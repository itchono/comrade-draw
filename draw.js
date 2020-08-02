/*
Drawing module
*/

var canvas
var ctx
var drawingboard

var mouseX
var mouseY

var colour = "#222222"
var weight = 2

let strokes = [] // List of strokes made by the user.

class Point {
    constructor(x,y) {
        this.x = x;
        // NOTE: use percentage value
        this.y = y;
        //this.r = r;
    }
  }

class Stroke {
    constructor(strokecolour, strokeweight) {
        this.points = []
        this.colour = strokecolour
        this.weight = strokeweight
    }
}

/*
EVENT TRIGGERS
*/

// wizardy stupid JS code
var mouseDown = 0

document.body.onmousedown = function() { 
    rect = canvas.getBoundingClientRect()
    mouseDown = 1

    if (inRect(rect, mouseX, mouseY)) {
        strokes.push(new Stroke(colour.repeat(1), weight)) // add new strokes 
    }
    
}
document.body.onmouseup = function() {
    rect = canvas.getBoundingClientRect()
    mouseDown = 0

    // check for empty lists
    if (!strokes[strokes.length-1].points.length) {
        strokes.pop() // remove old strokes
    }
}

onmousemove = function(e){
    mouseX = e.clientX
    mouseY = e.clientY

    rect = canvas.getBoundingClientRect()

    if (mouseDown && inRect(rect, mouseX, mouseY)) { 
        strokes[strokes.length-1].points.push(new Point((mouseX - rect.left)/rect.width, (mouseY - rect.top)/rect.height)) 
    }

}

onresize = function() {
    canvas.width = 0
    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width
    draw()
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
      undo()
    }
  });

function changecolour(input) { colour = input.value }

function changeweight(input) { weight = input.value }



function newCanvas() {

    canvas = document.createElement("canvas")

    drawingboard = document.getElementById("drawingboard")

    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width
    canvas.style="border:1px solid #222222;"

    ctx = canvas.getContext('2d')

    drawingboard.appendChild(canvas)

    setInterval(draw, 20); // creates a routine to run the draw function
}




function draw() {
    // Called once every 20 ms to update the screen
    strokes.forEach(function(stroke, index, arr) {
        points = stroke.points

        if (points[0]) {
            ctx.beginPath()

            ctx.strokeStyle = stroke.colour
            ctx.lineWidth = stroke.weight;

            ctx.moveTo(points[0].x*ctx.canvas.width, points[0].y*ctx.canvas.height)

            points.forEach(function(point, index, arr) {
                ctx.lineTo(point.x*ctx.canvas.width, point.y*ctx.canvas.height)
                ctx.stroke();
            })

            ctx.closePath()
        }
    })
}

function inRect(rect, x, y) {
    return (x > rect.left && x < rect.left + rect.width && y > rect.top && y < rect.top + rect.height)
}

function clearcanvas() {
    // Clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes = []
}

function undo() {
    // Undoes a step
    strokes.pop()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw()
}

function exportdrawing() {
    img = new Image()
    img.src = canvas.toDataURL("image/png")
    exportbox = document.getElementById("exportbox")
    exportbox.appendChild(img)

    // Downloads the image
    link = document.createElement("a")
    link.href = img.src
    link.setAttribute("download", "Comrade Drawing")
    link.click()
}

function exportdrawingcopy() {
    copyToClipboard(canvas.toDataURL("image/jpeg", 0.1)) // 0.5 compression on jpg
    copybutton = document.getElementById("copybutton")
}




const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };