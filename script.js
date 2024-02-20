document.addEventListener("DOMContentLoaded", function() {
    switchTab('visualize'); // Default to visualize tab
});

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        visualizeGrid(data.hashes);
    };
    reader.readAsText(file);
});


    function visualizeGrid(hashes) {
        const grid = document.getElementById('grid');
        grid.innerHTML = ''; // Clear existing grid
        let totalCells = Object.values(hashes).reduce((acc, val) => acc + val, 0);
        let gridSize = 2;
        while (gridSize * gridSize < totalCells && gridSize <= 64) {
            gridSize *= 2;
        }
        const gridSizePx = `${gridSize * 20}px`; // Example, assuming each cell is 20px
        grid.style.width = gridSizePx;
        grid.style.height = gridSizePx;
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
        const colorList = document.getElementById('colorList'); // Assuming an element with id="colorList" exists
        colorList.innerHTML = ''; // Clear existing list
        Object.entries(hashes).forEach(([hash, numberOfCells]) => {
            const color = `#${hash.slice(-6)}`;
            console.log(`Hash: ${hash}, Color: ${color}`); // Log each color to the console
            for (let i = 0; i < numberOfCells; i++) {
                const cell = document.createElement('div');
                cell.style.backgroundColor = color;
                cell.className = 'cell';
                cell.style.width = '20px'; // Ensure cell has space
                cell.style.height = '20px'; // Ensure cell has space
                grid.appendChild(cell);
            }
            // ... rest of your code for appending to colorList
        });
        // After adding colored cells based on JSON data
        const cellsNeeded = gridSize * gridSize - totalCells;
        for (let i = 0; i < cellsNeeded; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = '#CCCCCC'; // Default color for empty cells
            grid.appendChild(cell);
        }
    }
    

let currentColor = '#000000';
const colorPicker = document.getElementById('colorPicker');
const pixelCanvas = document.getElementById('pixelCanvas');
const ctx = pixelCanvas.getContext('2d');
const canvasSize = 256;
const pixelSize = 4; // Adjust for 64x64 grid (256 / 64 = 4)
const gridSize = canvasSize / pixelSize;

// Initialize canvas with white pixels
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvasSize, canvasSize);

colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
});

let isMouseDown = false;

pixelCanvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    draw(e);
});

pixelCanvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        draw(e);
    }
});

pixelCanvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

pixelCanvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

function draw(e) {
    const rect = pixelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridX = Math.floor(x / pixelSize) * pixelSize;
    const gridY = Math.floor(y / pixelSize) * pixelSize;
    
    ctx.fillStyle = currentColor;
    ctx.fillRect(gridX, gridY, pixelSize, pixelSize);
}

document.getElementById('downloadJson').addEventListener('click', () => {
    const json = generateJsonFromCanvas();
    downloadJson(json);
});

function generateJsonFromCanvas() {
    const data = [];
    let cellNumber = 1;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const pixelData = ctx.getImageData(x * pixelSize, y * pixelSize, 1, 1).data;
            const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            const hash = `${cellNumber}${hexColor}`;
            data.push({ hash });
            cellNumber++;
        }
    }
    return JSON.stringify(data);
}

function downloadJson(json) {
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixel-art.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateHash(x, y) {
    // Placeholder function to generate a unique hash based on x, y coordinates
    return `${x}${y}abcdef1234567890abcdef1234567890abcdef`.slice(0, 40);
}

function setCurrentColor(color) {
    currentColor = color;
    colorPicker.value = color;
}

function requestApi() {
    const height = document.getElementById('heightInput').value;
    fetch(`https://example.com/api/data?height=${height}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle the JSON data
        })
        .catch(error => console.error('Error:', error));
}