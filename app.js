/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const colorButton = document.querySelectorAll('button[id^=button]');


const CELL_SIDE_COUNT = 100;
const cellPixelLength = canvas.width / CELL_SIDE_COUNT;
const colorHistory = {};


// Set onClick Event on All Buttons
let selectedColor;
for (let i = 0; i < colorButton.length; i++) {
    colorButton[i].addEventListener("click", (event) => {
        let currentBGColor = event.target.style.backgroundColor;
        let rgbToHex = '#' + currentBGColor.substr(4, currentBGColor.indexOf(')') - 4).split(',').map((color) => parseInt(color).toString(16).padStart(2, '0')).join('');
        selectedColor = rgbToHex;
        console.log("Current Bg Color in RGB: " + currentBGColor);
        console.log("Current Bg Color in Hex: " + rgbToHex);
    });
}


// Initialize the canvas background
drawingContext.fillStyle = "#fff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

// Setup the guide
{
    guide.style.width = `${canvas.width}px`;
    guide.style.height = `${canvas.height}px`;
    guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
    guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

    [...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
        guide.insertAdjacentHTML("beforeend", "<div></div>")
    );
}

function handleCanvasMousedown(e) {
    // Ensure user is using their primary mouse button
    if (e.button !== 0) {
        return;
    }

    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasBoundingRect.left;
    const y = e.clientY - canvasBoundingRect.top;
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);

    fillCell(cellX, cellY);
}

function handleClearButtonClick() {
    const yes = confirm("Are you sure you wish to clear the canvas?");

    if (!yes) return;

    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function handleToggleGuideChange() {
    guide.style.display = toggleGuide.checked ? null : "none";
}

function fillCell(cellX, cellY) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    if (!colorHistory.hasOwnProperty(`${cellX}_${cellY}`)) {
        drawingContext.fillStyle = selectedColor;
        console.log("Fill Style: " + drawingContext.fillStyle);
        drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
        colorHistory[`${cellX}_${cellY}`] = selectedColor;
        console.log("Color History: " + JSON.stringify(colorHistory));
    } else {
        console.log("Color is filled");
    }
}

canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
