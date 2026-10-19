export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

interface Command {
  label: string;
  execute(): void;
}

function run(command: Command) {
  command.execute();
  drawRover();
}

function moveForward() {
  const heading = directions[direction];
  x = Math.min(4, Math.max(0, x + heading.dx));
  y = Math.min(4, Math.max(0, y + heading.dy));
}

const forwardCommand: Command = {
  label: "Forward",
  execute: () => {
    moveForward();
  },
};

const rightCommand: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % directions.length;
  },
};

const pending: Command[] = [];
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

function renderPending() {
  pendingList.replaceChildren();
  for (const command of pending) {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList.append(item);
  }
  queueStatus.textContent = pending.length === 0
    ? "Empty"
    : `${pending.length} pending`;
}

function runPending() {
  while (pending.length > 0) {
    const command = pending.shift()!;
    run(command);
  }
  renderPending();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  pending.push(forwardCommand);
  renderPending();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  pending.push(rightCommand);
  renderPending();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  pending.length = 0;
  renderPending();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  runPending();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  pending.length = 0;
  renderPending();
};
drawRover();
renderPending();
