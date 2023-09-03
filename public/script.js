const socket = io("http://localhost:3000/", { transports: ["websocket"] });
let strokes = [];
document.getElementById("playerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;

  socket.emit("newRoom", { name });
  socket.on("newRoom", (data) => console.log(data));
});

// script for canvas
const paintCanvas = document.querySelector(".js-paint");
const context = paintCanvas.getContext("2d");
context.lineCap = "round";

const colorPicker = document.querySelector(".js-color-picker");

colorPicker.addEventListener("change", (event) => {
  context.strokeStyle = event.target.value;
});

const lineWidthRange = document.querySelector(".js-line-range");
const lineWidthLabel = document.querySelector(".js-range-value");

lineWidthRange.addEventListener("input", (event) => {
  const width = event.target.value;
  lineWidthLabel.innerHTML = width;
  context.lineWidth = width;
});
const eraseButton = document.getElementById("eraseButton");
eraseButton.addEventListener("click", () => {
  eraseButton.classList.add("clicked");
  setTimeout(() => {
    eraseButton.classList.remove("clicked");
  }, 100);
  context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
});

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", () => {
  undoButton.classList.add("clicked");
  setTimeout(() => {
    undoButton.classList.remove("clicked");
  }, 200); // Adjust the duration (in milliseconds) as needed
  undoLastStroke();
});
let x = 0,
  y = 0;
let isMouseDown = false;

const stopDrawing = () => {
  isMouseDown = false;
};
const startDrawing = (event) => {
  isMouseDown = true;
  [x, y] = [event.offsetX, event.offsetY];
};

function redrawCanvas() {
  context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);

  strokes.forEach((stroke) => {
    context.beginPath();
    context.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      context.lineTo(stroke[i].x, stroke[i].y);
    }
    context.stroke();
  });
}
function undoLastStroke() {
  if (strokes.length > 0) {
    strokes.pop(); // Remove the last stroke from the array
    redrawCanvas();
  }
}

const drawLine = (event) => {
  if (isMouseDown) {
    const newX = event.offsetX;
    const newY = event.offsetY;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(newX, newY);
    
    context.stroke();
    //[x, y] = [newX, newY];
    x = newX;
    y = newY;

    const currentStroke = strokes[strokes.length - 1];
    currentStroke.push({ x: newX, y: newY });
  }
};

paintCanvas.addEventListener("mousedown", startDrawing);
paintCanvas.addEventListener("mousemove", drawLine);
paintCanvas.addEventListener("mouseup", () => {
  stopDrawing();
  strokes.push([]);
});
paintCanvas.addEventListener("mouseout", stopDrawing);


// update the game settings here