
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
        let totalShares = 0;
        Object.values(hashes).forEach(shares => totalShares += shares);
        const gridSize = Math.pow(2, Math.ceil(Math.log(Math.sqrt(totalShares))/Math.log(2))); // Adjust grid size based on total shares
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        grid.innerHTML = ''; // Clear existing grid
    
        Object.keys(hashes).forEach(hash => {
            const shares = hashes[hash];
            const color = `#${hash.slice(-6)}`;
            for (let i = 0; i < shares; i++) {
                const cell = document.createElement('div');
                cell.style.backgroundColor = color;
                cell.className = 'cell';
                grid.appendChild(cell);
            }
        });
    }
    

let currentColor = '#000000';
const colorPicker = document.getElementById('colorPicker');
const pixelCanvas = document.getElementById('pixelCanvas');
const ctx = pixelCanvas.getContext('2d');
const canvasSize = 256;
const pixelSize = 16; // Determines the size of each "pixel" in the art
const gridSize = canvasSize / pixelSize;

// Initialize canvas with white pixels
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvasSize, canvasSize);

colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
});

pixelCanvas.addEventListener('click', (e) => {
    const rect = pixelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridX = Math.floor(x / pixelSize) * pixelSize;
    const gridY = Math.floor(y / pixelSize) * pixelSize;
    
    ctx.fillStyle = currentColor;
    ctx.fillRect(gridX, gridY, pixelSize, pixelSize);
});

document.getElementById('downloadJson').addEventListener('click', () => {
    const json = generateJsonFromCanvas();
    downloadJson(json);
});

function generateJsonFromCanvas() {
    const data = { hashes: {} };
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const pixelData = ctx.getImageData(x * pixelSize, y * pixelSize, 1, 1).data;
            const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            const hash = generateHash(x, y); // Simulate a hash for the purpose of this example
            data.hashes[hash] = hexColor;
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