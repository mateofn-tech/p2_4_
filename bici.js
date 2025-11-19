let wheelStroke = 11;
let frameStroke = 6;
let bikeScale = 1;
let cx, cy;
let angle = 0;

let rearX, rearY, frontX, frontY;
let rearR, frontR;
let pedalCenterX, pedalCenterY;
let seatX, seatY;

// Velocidades de movimiento
let rearVX, rearVY, frontVX, frontVY, pedalVX, pedalVY, seatVX, seatVY;

// Tamaños dinámicos
let seatSize = 1;
let pedalSize = 1;
let handleScale = 1;

const marginRect = 189; // 5 cm aprox.
const pinkColor = [255, 0, 255]; // rosa del fondo y rectángulo

function setup() {
  createCanvas(1920, 1080);
  angleMode(DEGREES);
  cx = width / 2;
  cy = height / 2;
  resetWheelPositions();
}

function draw() {
  background(pinkColor); // fondo rosa

  // Rectángulo marco rosa
  push();
  noFill();
  stroke(pinkColor);
  strokeWeight(marginRect);
  rectMode(CORNER);
  rect(0 + marginRect / 2, 0 + marginRect / 2, width - marginRect, height - marginRect);
  pop();

  push();
  translate(cx, cy);
  scale(bikeScale);

  let oscillationAmplitude = 10;
  let rearYOffset = sin(angle) * oscillationAmplitude;
  let frontYOffset = sin(angle + 180) * oscillationAmplitude;

  const margin = 20;

  // --- Mover los elementos continuamente ---
  function move(obj, vx, vy, minX, maxX, minY, maxY) {
    obj.x += vx;
    obj.y += vy;
    // Rebote al llegar al límite
    if (obj.x < minX || obj.x > maxX) obj.vx *= -1;
    if (obj.y < minY || obj.y > maxY) obj.vy *= -1;
  }

  // Crear objetos
  let rear = {x: rearX, y: rearY, vx: rearVX, vy: rearVY};
  let front = {x: frontX, y: frontY, vx: frontVX, vy: frontVY};
  let pedal = {x: pedalCenterX, y: pedalCenterY, vx: pedalVX, vy: pedalVY};
  let seat = {x: seatX, y: seatY, vx: seatVX, vy: seatVY};

  move(rear, rear.vx, rear.vy, -width/2 + rearR + marginRect/2, width/2 - rearR - marginRect/2,
       -height/2 + rearR + marginRect/2, height/2 - rearR - marginRect/2);
  move(front, front.vx, front.vy, -width/2 + frontR + marginRect/2, width/2 - frontR - marginRect/2,
       -height/2 + frontR + marginRect/2, height/2 - frontR - marginRect/2);
  move(pedal, pedal.vx, pedal.vy, -width/2 + marginRect/2, width/2 - marginRect/2,
       -height/2 + marginRect/2, height/2 - marginRect/2);
  move(seat, seat.vx, seat.vy, -width/2 + marginRect/2, width/2 - marginRect/2,
       -height/2 + marginRect/2, height/2 - marginRect/2);

  rearX = rear.x; rearY = rear.y; rearVX = rear.vx; rearVY = rear.vy;
  frontX = front.x; frontY = front.y; frontVX = front.vx; frontVY = front.vy;
  pedalCenterX = pedal.x; pedalCenterY = pedal.y; pedalVX = pedal.vx; pedalVY = pedal.vy;
  seatX = seat.x; seatY = seat.y; seatVX = seat.vx; seatVY = seat.vy;

  // Dibujar ruedas
  drawWheel(rearX, rearY + rearYOffset, rearR, angle, true, false, true);
  drawWheel(frontX, frontY + frontYOffset, frontR, -angle * 2, true, true, false);

  // Cuadro
  drawFrame(rearX, rearY + rearYOffset, pedalCenterX, pedalCenterY, frontX, frontY + frontYOffset, seatX, seatY);

  // Barra vertical manillar
  drawVerticalBarAndHandlebar(frontX, frontY + frontYOffset, frontR, pedalCenterX, pedalCenterY);

  // Sillín y pedales
  drawSeat(seatX, seatY);
  drawPedals(pedalCenterX, pedalCenterY);

  pop();
  angle += 4;
}

// --- Funciones de dibujo (mismo código que antes) ---
function drawWheel(x, y, r, rot, showCircle = true, showSpokes = true, repeatInside = false) {
  push();
  translate(x, y);
  stroke(0, 102, 204);
  strokeWeight(wheelStroke);
  noFill();

  if (repeatInside) {
    for (let i = 1; i <= 3; i++) {
      let factor = 1 - i * 0.2;
      push();
      rotate(rot * (i % 2 === 0 ? -1 : 1) * 0.7);
      strokeWeight(wheelStroke * 0.5);
      ellipse(0, 0, r * 2 * factor, r * 2 * factor);
      pop();
    }
  }

  if (showSpokes) {
    rotate(-rot);
    strokeWeight(2);
    for (let a = 0; a < 360; a += 20) {
      let x1 = cos(a) * (r - 6);
      let y1 = sin(a) * (r - 6);
      line(0, 0, x1, y1);
    }
  }

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

function drawVerticalBarAndHandlebar(fx, fy, r, baseX, baseY) {
  push();
  stroke(0, 200, 180);

  let barHeight = r * 1.2 * handleScale;
  strokeWeight(frameStroke * 1.5 * handleScale);
  line(baseX, baseY, fx, fy - barHeight);

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

function drawPedals(px, py, crankLen = 22) {
  push();
  translate(px, py);
  scale(pedalSize);

  let pedalRadius = 18;
  fill(0, 200, 180);
  noStroke();
  ellipse(0, 0, pedalRadius * 2, pedalRadius * 2);

  let extra = 6;
  let bielaLength = (pedalRadius + extra) * pedalSize;

  stroke(0, 51, 163);
  strokeWeight(8 * pedalSize);
  push();
  rotate(angle);
  line(0, 0, bielaLength, 0);
  pop();

  pop();
}

// --- Inicializar posiciones y velocidades ---
function resetWheelPositions() {
  rearR = random(80, 160);
  frontR = random(100, 200);

  rearX = random(-width / 2 + rearR + marginRect / 2, width / 2 - rearR - marginRect / 2);
  rearY = random(-height / 2 + rearR + marginRect / 2, height / 2 - rearR - marginRect / 2);

  frontX = random(-width / 2 + frontR + marginRect / 2, width / 2 - frontR - marginRect / 2);
  frontY = random(-height / 2 + frontR + marginRect / 2, height / 2 - frontR - marginRect / 2);

  seatX = random(-width / 2 + marginRect / 2, width / 2 - marginRect / 2);
  seatY = random(-height / 2 + marginRect / 2, height / 2 - marginRect / 2);

  pedalCenterX = random(-width / 2 + marginRect / 2, width / 2 - marginRect / 2);
  pedalCenterY = random(-height / 2 + marginRect / 2, height / 2 - marginRect / 2);

  // Velocidades iniciales
  rearVX = random(1, 3); rearVY = random(1, 3);
  frontVX = random(1, 3); frontVY = random(1, 3);
  pedalVX = random(1, 3); pedalVY = random(1, 3);
  seatVX = random(1, 3); seatVY = random(1, 3);
}
