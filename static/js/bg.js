const canvas = document.getElementById('topo-canvas');
const ctx = canvas.getContext('2d');

let width, height, cols, rows;
const cellSize = 8;
const zOffsetSpeed = 0.00009;
let zOffset = 0;
const noiseScale = 0.008;
let lastTime = 0;
let noiseGrid = new Float32Array(0);

const permutation = new Uint8Array([151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]);

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t, a, b) { return a + t * (b - a); }
function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const a = permutation[X] + Y, aa = permutation[a] + Z, ab = permutation[a + 1] + Z;
    const b = permutation[X + 1] + Y, ba = permutation[b] + Z, bb = permutation[b + 1] + Z;

    return lerp(w, lerp(v, lerp(u, grad(permutation[aa], x, y, z),
        grad(permutation[ba], x - 1, y, z)),
        lerp(u, grad(permutation[ab], x, y - 1, z),
            grad(permutation[bb], x - 1, y - 1, z))),
        lerp(v, lerp(u, grad(permutation[aa + 1], x, y, z - 1),
            grad(permutation[ba + 1], x - 1, y, z - 1)),
            lerp(u, grad(permutation[ab + 1], x, y - 1, z - 1),
                grad(permutation[bb + 1], x - 1, y - 1, z - 1))));
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.floor(width / cellSize) + 1;
    rows = Math.floor(height / cellSize) + 1;
    noiseGrid = new Float32Array((cols + 1) * (rows + 1));
}

function animate(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = time - lastTime;
    lastTime = time;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const rowWidth = cols + 1;

    for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
            noiseGrid[i + j * rowWidth] = (noise(i * noiseScale, j * noiseScale, zOffset) + 1) * 0.5;
        }
    }

    for (let k = 1; k <= 10; k++) {
        const threshold = k / 11;

        ctx.strokeStyle = `rgba(255, 255, 255, 0.35)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const idx = i + j * rowWidth;
                const n0 = noiseGrid[idx];
                const n1 = noiseGrid[idx + 1];
                const n2 = noiseGrid[idx + 1 + rowWidth];
                const n3 = noiseGrid[idx + rowWidth];

                let state = 0;
                if (n0 > threshold) state |= 8;
                if (n1 > threshold) state |= 4;
                if (n2 > threshold) state |= 2;
                if (n3 > threshold) state |= 1;

                if (state === 0 || state === 15) continue;

                const x0 = i * cellSize;
                const y0 = j * cellSize;

                const amt0 = n0 === n1 ? 0.5 : (threshold - n0) / (n1 - n0);
                const amt1 = n1 === n2 ? 0.5 : (threshold - n1) / (n2 - n1);
                const amt2 = n3 === n2 ? 0.5 : (threshold - n3) / (n2 - n3);
                const amt3 = n0 === n3 ? 0.5 : (threshold - n0) / (n3 - n0);

                const ax = x0 + cellSize * amt0, ay = y0;
                const bx = x0 + cellSize, by = y0 + cellSize * amt1;
                const cx = x0 + cellSize * amt2, cy = y0 + cellSize;
                const dx = x0, dy = y0 + cellSize * amt3;

                switch (state) {
                    case 1: ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;
                    case 2: ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
                    case 3: ctx.moveTo(bx, by); ctx.lineTo(dx, dy); break;
                    case 4: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); break;
                    case 5: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
                    case 6: ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); break;
                    case 7: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); break;
                    case 8: ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); break;
                    case 9: ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); break;
                    case 10: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;
                    case 11: ctx.moveTo(ax, ay); ctx.lineTo(bx, by); break;
                    case 12: ctx.moveTo(bx, by); ctx.lineTo(dx, dy); break;
                    case 13: ctx.moveTo(bx, by); ctx.lineTo(cx, cy); break;
                    case 14: ctx.moveTo(cx, cy); ctx.lineTo(dx, dy); break;
                }
            }
        }
        ctx.stroke();
    }

    zOffset += zOffsetSpeed * deltaTime;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
requestAnimationFrame(animate);