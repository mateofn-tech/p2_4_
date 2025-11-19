let wheelStroke = 11;
let frameStroke = 6;
let bikeScale = 1;
let cx, cy;
let angle = 0;

// Líneas del cuadro como vectores
let rearWheel, frontWheel, pedal, seat, handlebar;

let rearR, frontR;
let seatSize = 1;
let pedalSize = 1;
let handleScale = 1;

// Posiciones relativas a las líneas (0 a 1)
let tRear = 0.5;
let tFront = 0.5;
let tPedal = 0.5;
let tSeat = 0.5;

function setup() {
  createCanvas(1920, 1080);
  angleMode(DEGREES);
  cx = width / 2;
  cy = height / 2;
  resetBike();
}

function draw() {
  background(245);
  push();
  translate(cx, cy);
  scale(bikeScale);

  // Oscilación de ruedas
  let oscillationAmplitude = 10;
  let rearYOffset = sin(angle) * oscillationAmplitude;
  let frontYOffset = sin(angle + 180) * oscillationAmplitude;

  // Factor de cercanía al ratón (0 a 1)
  let mx = mouseX - cx;
  let my = mouseY - cy;

  function distanceFactor(px, py) {
    let d = dist(px, py, mx, my);
    return constrain(1 - d / 500, 0.05, 0.3); // más cerca → más rápido
  }

  // Actualizar posición de objetos sobre las líneas según t y cercanía
  tRear += distanceFactor(rearWheel.x1, rearWheel.y1) * 0.01;
  tFront += distanceFactor(frontWheel.x1, frontWheel.y1) * 0.01;
  tPedal += distanceFactor(pedal.x1, pedal.y1) * 0.01;
  tSeat += distanceFactor(seat.x1, seat.y1) * 0.01;

  tRear %= 1; tFront %= 1; tPedal %= 1; tSeat %= 1;

  let rearPos = interpolateLine(rearWheel, tRear);
  let frontPos = interpolateLine(frontWheel, tFront);
  let pedalPos = interpolateLine(pedal, tPedal);
  let seatPos = interpolateLine(seat, tSeat);

  // Dibujar vías (líneas)
  drawFrameLines();

  // Ruedas
  drawWheel(rearPos.x, rearPos.y + rearYOffset, rearR, angle, true, false, true);
  drawWheel(frontPos.x, frontPos.y + frontYOffset, frontR, -angle * 2, true, true, false);

  // Barra vertical dinámica del manillar
  drawVerticalBarAndHandlebar(frontPos.x, frontPos.y + frontYOffset, frontR, pedalPos.x, pedalPos.y);

  // Pedal y sillín
  drawPedals(pedalPos.x, pedalPos.y);
  drawSeat(seatPos.x, seatPos.y);

  pop();
  angle += 4;
}

// --- Funciones de interpolación ---
function interpolateLine(line, t) {
  return {
    x: lerp(line.x1, line.x2, t),
    y: lerp(line.y1, line.y2, t)
  };
}

// --- Dibujos ---
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
    noStroke();
    fill(255, 60, 0);
    ellipse(0, 0, r * 0.6);
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

function drawFrameLines() {
  stroke(0, 102, 255);
  strokeWeight(frameStroke);
  strokeCap(ROUND);

  line(rearWheel.x1, rearWheel.y1, pedal.x1, pedal.y1);
  line(pedal.x1, pedal.y1, frontWheel.x1, frontWheel.y1);
  line(frontWheel.x1, frontWheel.y1, seat.x1, seat.y1);
  line(seat.x1, seat.y1, rearWheel.x1, rearWheel.y1);
  line(seat.x1, seat.y1, pedal.x1, pedal.y1);
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

// --- Inicialización ---
function resetBike() {
  const margin = 50;

  rearR = random(80, 160);
  frontR = random(100, 200);

  rearWheel = { x1: random(-width/2 + rearR + margin, width/2 - rearR - margin), y1: random(-height/2 + rearR + margin, height/2 - rearR - margin),
                x2: random(-width/2 + rearR + margin, width/2 - rearR - margin), y2: random(-height/2 + rearR + margin, height/2 - rearR - margin)};
  frontWheel = { x1: random(-width/2 + frontR + margin, width/2 - frontR - margin), y1: random(-height/2 + frontR + margin, height/2 - frontR - margin),
                 x2: random(-width/2 + frontR + margin, width/2 - frontR - margin), y2: random(-height/2 + frontR + margin, height/2 - frontR - margin)};
  pedal = { x1: random(-width/2 + margin, width/2 - margin), y1: random(-height/2 + margin, height/2 - margin),
            x2: random(-width/2 + margin, width/2 - margin), y2: random(-height/2 + margin, height/2 - margin)};
  seat = { x1: random(-width/2 + margin, width/2 - margin), y1: random(-height/2 + margin, height/2 - margin),
           x2: random(-width/2 + margin, width/2 - margin), y2: random(-height/2 + margin, height/2 - margin)};
}

function mousePressed() {
  resetBike();
  seatSize = constrain(seatSize + random(-0.4, 0.4), 0.5, 2.5);
  pedalSize = constrain(pedalSize + random(-0.4, 0.4), 0.5, 2.5);
  handleScale = constrain(handleScale + random(-0.3, 0.3), 0.5, 2.5);
}

  pedalCenterX = random(-width / 2 + maxAccessory, width / 2 - maxAccessory);
  pedalCenterY = random(-height / 2 + maxAccessory, height / 2 - maxAccessory);
}

