let wheelStroke = 11;
let frameStroke = 6;
let bikeScale = 1;
let cx, cy;
let angle = 0;

let rearX, rearY, frontX, frontY;
let rearR, frontR;
let targetRearR, targetFrontR;

let pedalCenterX, pedalCenterY;
let seatX, seatY;
let seatSize = 1, targetSeatSize;
let pedalSize = 1, targetPedalSize;
let handleScale = 1, targetHandleScale;

let rearVX, rearVY, frontVX, frontVY, pedalVX, pedalVY, seatVX, seatVY;

let marginRect;
const pinkColor = [255, 0, 255];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  cx = width / 2;
  cy = height / 2;
  marginRect = min(width, height) * 0.15;
  resetWheelPositions();
}

function draw() {
  background(pinkColor);

  // Marco rosa
  push();
  noFill();
  stroke(pinkColor);
  strokeWeight(marginRect);
  rectMode(CORNER);
  rect(marginRect / 2, marginRect / 2, width - marginRect, height - marginRect);
  pop();

  push();
  translate(cx, cy);
  scale(bikeScale);

  let oscillationAmplitude = 10;
  let rearYOffset = sin(angle) * oscillationAmplitude;
  let frontYOffset = sin(angle + 180) * oscillationAmplitude;

  // --- Mover objetos bicicleta ---
  function move(obj, vx, vy, minX, maxX, minY, maxY) {
    obj.x += vx;
    obj.y += vy;
    if (obj.x < minX || obj.x > maxX) obj.vx *= -1;
    if (obj.y < minY || obj.y > maxY) obj.vy *= -1;
  }

  let rear = {x: rearX, y: rearY, vx: rearVX, vy: rearVY};
  let front = {x: frontX, y: frontY, vx: frontVX, vy: frontVY};
  let pedal = {x: pedalCenterX, y: pedalCenterY, vx: pedalVX, vy: pedalVY};
  let seat = {x: seatX, y: seatY, vx: seatVX, vy: seatVY};

  move(rear, rear.vx, rear.vy,
       -width/2 + rearR*bikeScale + marginRect/2, width/2 - rearR*bikeScale - marginRect/2,
       -height/2 + rearR*bikeScale + marginRect/2, height/2 - rearR*bikeScale - marginRect/2);
  move(front, front.vx, front.vy,
       -width/2 + frontR*bikeScale + marginRect/2, width/2 - frontR*bikeScale - marginRect/2,
       -height/2 + frontR*bikeScale + marginRect/2, height/2 - frontR*bikeScale - marginRect/2);
  move(pedal, pedal.vx, pedal.vy,
       -width/2 + pedalSize*bikeScale*20 + marginRect/2, width/2 - pedalSize*bikeScale*20 - marginRect/2,
       -height/2 + pedalSize*bikeScale*20 + marginRect/2, height/2 - pedalSize*bikeScale*20 - marginRect/2);
  move(seat, seat.vx, seat.vy,
       -width/2 + seatSize*bikeScale*35 + marginRect/2, width/2 - seatSize*bikeScale*35 - marginRect/2,
       -height/2 + seatSize*bikeScale*20 + marginRect/2, height/2 - seatSize*bikeScale*20 - marginRect/2);

  rearX = rear.x; rearY = rear.y; rearVX = rear.vx; rearVY = rear.vy;
  frontX = front.x; frontY = front.y; frontVX = front.vx; frontVY = front.vy;
  pedalCenterX = pedal.x; pedalCenterY = pedal.y; pedalVX = pedal.vx; pedalVY = pedal.vy;
  seatX = seat.x; seatY = seat.y; seatVX = seat.vx; seatVY = seat.vy;

  // --- Interpolación suave hacia tamaños objetivos ---
  rearR = lerp(rearR, targetRearR, 0.02);
  frontR = lerp(frontR, targetFrontR, 0.02);
  seatSize = lerp(seatSize, targetSeatSize, 0.02);
  pedalSize = lerp(pedalSize, targetPedalSize, 0.02);
  handleScale = lerp(handleScale, targetHandleScale, 0.02);

  if (abs(rearR - targetRearR) < 0.5) targetRearR = random(min(width, height) * 0.08, min(width, height) * 0.15);
  if (abs(frontR - targetFrontR) < 0.5) targetFrontR = random(min(width, height) * 0.1, min(width, height) * 0.2);
  if (abs(seatSize - targetSeatSize) < 0.01) targetSeatSize = random(0.8, 1.3);
  if (abs(pedalSize - targetPedalSize) < 0.01) targetPedalSize = random(0.8, 1.3);
  if (abs(handleScale - targetHandleScale) < 0.01) targetHandleScale = random(0.8, 1.3);

  // --- Dibujar bicicleta ---
  drawWheel(rearX, rearY + rearYOffset, rearR, angle, true, false, true);
  drawWheel(frontX, frontY + frontYOffset, frontR, -angle * 2, true, true, false);
  drawFrame(rearX, rearY + rearYOffset, pedalCenterX, pedalCenterY, frontX, frontY + frontYOffset, seatX, seatY);
  drawVerticalBarAndHandlebar(frontX, frontY + frontYOffset, frontR, pedalCenterX, pedalCenterY);
  drawSeat(seatX, seatY);
  drawPedals(pedalCenterX, pedalCenterY);

  pop();
  angle += 4;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;
  marginRect = min(width, height) * 0.15;
  resetWheelPositions();
}

// --- Funciones de dibujo ---
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

function resetWheelPositions() {
  rearR = targetRearR = random(min(width, height) * 0.08, min(width, height) * 0.15);
  frontR = targetFrontR = random(min(width, height) * 0.1, min(width, height) * 0.2);
  seatSize = targetSeatSize = 1;
  pedalSize = targetPedalSize = 1;
  handleScale = targetHandleScale = 1;

  rearX = random(-width/2 + rearR*bikeScale + marginRect, width/2 - rearR*bikeScale - marginRect);
  rearY = random(-height/2 + rearR*bikeScale + marginRect, height/2 - rearR*bikeScale - marginRect);
  frontX = random(-width/2 + frontR*bikeScale + marginRect, width/2 - frontR*bikeScale - marginRect);
  frontY = random(-height/2 + frontR*bikeScale + marginRect, height/2 - frontR*bikeScale - marginRect);
  seatX = random(-width/2 + seatSize*bikeScale*35 + marginRect, width/2 - seatSize*bikeScale*35 - marginRect);
  seatY = random(-height/2 + seatSize*bikeScale*20 + marginRect, height/2 - seatSize*bikeScale*20 - marginRect);
  pedalCenterX = random(-width/2 + pedalSize*bikeScale*20 + marginRect, width/2 - pedalSize*bikeScale*20 - marginRect);
  pedalCenterY = random(-height/2 + pedalSize*bikeScale*20 + marginRect, height/2 - pedalSize*bikeScale*20 - marginRect);

  rearVX = random(1, 3); rearVY = random(1, 3);
  frontVX = random(1, 3); frontVY = random(1, 3);
  pedalVX = random(1, 3); pedalVY = random(1, 3);
  seatVX = random(1, 3); seatVY = random(1, 3);
}
