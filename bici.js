let wheelStroke = 11;
let frameStroke = 6;
let bikeScale = 1;
let cx, cy;
let angle = 0;

let rearX, rearY, frontX, frontY;
let rearR, frontR;
let pedalCenterX, pedalCenterY;
let seatX, seatY;

// Tamaños dinámicos
let seatSize = 1;
let pedalSize = 1;
let handleScale = 1;

function setup() {
  createCanvas(1920, 1080);
  angleMode(DEGREES);
  cx = width / 2;
  cy = height / 2;
  resetWheelPositions();
}

function draw() {
  background(245);

  push();
  translate(cx, cy);
  scale(bikeScale);

  let oscillationAmplitude = 10;
  let rearYOffset = sin(angle) * oscillationAmplitude;
  let frontYOffset = sin(angle + 180) * oscillationAmplitude;

  // Ruedas
  drawWheel(rearX, rearY + rearYOffset, rearR, angle, true, false, true, false);
  drawWheel(frontX, frontY + frontYOffset, frontR, -angle * 2, true, true, false, true);

  // Cuadro y partes
  drawFrame(rearX, rearY + rearYOffset, pedalCenterX, pedalCenterY, frontX, frontY + frontYOffset, seatX, seatY);
  drawVerticalBarAndHandlebar(frontX, frontY + frontYOffset, frontR);
  drawSeat(seatX, seatY);
  drawPedals(pedalCenterX, pedalCenterY, 22);

  pop();

  angle += 4;
}

// --- FUNCIONES DE DIBUJO ---
function drawWheel(x, y, r, rot, showCircle = true, showSpokes = true, repeatInside = false, orangeFill = false) {
  push();
  translate(x, y);
  stroke(0, 102, 204);
  strokeWeight(wheelStroke);
  noFill();

  // Fondo naranja rojizo (solo para la delantera)
  if (orangeFill) {
    fill(255, 60, 0);
    noStroke();
    ellipse(0, 0, r * 2.1);
    noFill();
    stroke(0, 102, 204);
  }

  // Ruedas internas decorativas (solo trasera)
  if (repeatInside) {
    for (let i = 1; i <= 3; i++) {
      let factor = 1 - i * 0.2;
      push();
      rotate(rot * (i % 2 === 0 ? -1 : 1) * 0.7);
      strokeWeight(wheelStroke * 0.5);
      ellipse(0, 0, r * 2 * factor, r * 2 * factor);
      pop();
    }

    noStroke();
    fill(255, 60, 0);
    ellipse(0, 0, r * 0.6);
  }

  // Rayos giratorios
  if (showSpokes) {
    rotate(-rot);
    strokeWeight(2);
    for (let a = 0; a < 360; a += 20) {
      let x1 = cos(a) * (r - 6);
      let y1 = sin(a) * (r - 6);
      line(0, 0, x1, y1);
    }
  }

  // Centro azul marino
  noStroke();
  fill(0, 51, 163);
  ellipse(0, 0, r * 0.35, r * 0.35);
  pop();
}

function drawFrame(rx, ry, px, py, fx, fy, sx, sy) {
  stroke(0, 102, 255);
  strokeWeight(frameStroke);
  strokeCap(ROUND);

  line(rx, ry, px, py);
  line(px, py, fx, fy);
  line(fx, fy, sx, sy);
  line(sx, sy, rx, ry);
  line(sx, sy, px, py);
}

function drawVerticalBarAndHandlebar(fx, fy, r) {
  push();
  stroke(0, 200, 180);
  strokeWeight(frameStroke * 1.5 * handleScale);

  let barHeight = r * 1.2 * handleScale;
  line(fx, fy, fx, fy - barHeight);

  let handleWidth = r * 0.8 * handleScale;
  strokeWeight(12 * handleScale);
  line(fx - handleWidth / 2, fy - barHeight, fx + handleWidth / 2, fy - barHeight);
  pop();
}

function drawSeat(sx, sy) {
  push();
  translate(sx, sy);
  fill(0, 200, 180);
  noStroke();
  scale(seatSize);
  rect(-21, -22, 70, 33, 12);
  pop();
}

function drawPedals(px, py, crankLen = 18) {
  push();
  translate(px, py);
  fill(0, 200, 180);
  noStroke();
  scale(pedalSize);
  ellipse(0, 0, 36, 36);
  stroke(0, 200, 180);
  strokeWeight(22);
  line(30, 16, -crankLen, 68);
  pop();
}

// --- EVENTOS Y RANDOMIZACIÓN ---
function mousePressed() {
  resetWheelPositions();

  // Tamaños varían hacia arriba o abajo
  seatSize = constrain(seatSize + random(-0.4, 0.4), 0.5, 2.5);
  pedalSize = constrain(pedalSize + random(-0.4, 0.4), 0.5, 2.5);
  handleScale = constrain(handleScale + random(-0.3, 0.3), 0.5, 2.5);
}

function resetWheelPositions() {
  // Rango de seguridad para mantener todo visible
  const margin = 150;
  const maxWheel = 200;
  const maxAccessory = 100;

  // Ruedas dentro del lienzo
  rearR = random(80, 160);
  frontR = random(100, 200);

  rearX = random(-width / 2 + rearR + margin, width / 2 - rearR - margin);
  rearY = random(-height / 2 + rearR + margin, height / 2 - rearR - margin);

  frontX = random(-width / 2 + frontR + margin, width / 2 - frontR - margin);
  frontY = random(-height / 2 + frontR + margin, height / 2 - frontR - margin);

  // Sillín y pedales dentro del rango visible
  seatX = random(-width / 2 + maxAccessory, width / 2 - maxAccessory);
  seatY = random(-height / 2 + maxAccessory, height / 2 - maxAccessory);

  pedalCenterX = random(-width / 2 + maxAccessory, width / 2 - maxAccessory);
  pedalCenterY = random(-height / 2 + maxAccessory, height / 2 - maxAccessory);
}
