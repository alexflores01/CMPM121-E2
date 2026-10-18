export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
const defaultProducerCount = 2;
let producerCount = defaultProducerCount;
const maxCrew = 6;
const producerSupplies = 3;
const suppliesNeeded = 6;

interface shiftResult {
  assignedCount: number;
  production: number;
  consumption: number;
  balance: number;
}

function calculateShift(assignedCount: number): shiftResult {
  const production = assignedCount * producerSupplies;
  const consumption = suppliesNeeded;
  const balance = production - consumption;
  return { assignedCount, production, consumption, balance };
}

function redraw() {
  const shift = calculateShift(producerCount);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrewTiles(shift.assignedCount);

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.assignedCount} / ${maxCrew}`, 18, 76);

  drawBarLabels("Production", shift.production, "#27766b", 102);
  drawBarLabels("Consumption", shift.consumption, "#a44d23", 154);

  updateReadout(shift);
}

function drawCrewTiles(assignedCount: number) {
  for (let i = 0; i < maxCrew; i++) {
    ctx.fillStyle = i < assignedCount ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedCount ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawBarLabels(label: string, value: number, color: string, y: number) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`${label}: ${value}`, 18, y);
  ctx.fillStyle = color;
  ctx.fillRect(18, y + 8, value * 14, 20);
}

function updateReadout(shift: shiftResult) {
  readout.textContent =
    `Assigned: ${shift.assignedCount}/${maxCrew} · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producerCount = Math.max(0, producerCount - 1);
  redraw();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producerCount = Math.min(maxCrew, producerCount + 1);
  redraw();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producerCount = defaultProducerCount;
    redraw();
  };
redraw();
