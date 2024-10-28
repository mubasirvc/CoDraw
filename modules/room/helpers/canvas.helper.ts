import { CANVAS_SIZE } from "@/common/constants";
import { ClientRoom, CtxOptions, Move } from "@/common/types/socketTypes";

// export const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
//   const { options, path } = move;

//   ctx.lineWidth = options.lineWidth;
//   ctx.strokeStyle = options.lineColor;

//   if (move.eraser) ctx.globalCompositeOperation = "destination-out";

//   switch (options.shape) {
//     case "line":
//       ctx.beginPath();
//       path?.forEach(([x, y]) => {
//         ctx.lineTo(x, y);
//       });
//       ctx.stroke();
//       ctx.closePath();
//       break;
//     case "circle":
//       ctx.beginPath();
//       ctx.arc(path[0][0], path[0][1], move.radius, 0, 2 * Math.PI);
//       ctx.stroke();
//       ctx.closePath();
//       break;
//     case "rect":
//       ctx.beginPath();
//       ctx.rect(path[0][0], path[0][1], move.width, move.height);
//       ctx.stroke();
//       ctx.closePath();
//       break;
//     default:
//       break;
//   }

//   ctx.globalCompositeOperation = "source-over";
// };

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#ccc";

  for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
  }

  for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
  }
};

// export const drawAllMoves = (
//   ctx: CanvasRenderingContext2D,
//   room: ClientRoom,
//   options: CtxOptions
// ) => {
//   const { usersMoves, movesWithoutUser, myMoves } = room;
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//   // drawBackground(ctx)

//   const moves = [...movesWithoutUser, ...myMoves];

//   usersMoves?.forEach((move) => {
//     moves.push(...move);
//   });

//   moves.sort((a, b) => a.timestamp - b.timestamp);

//   moves?.forEach((move) => handleMove(move, ctx));

//   ctx.lineJoin = "round";
//   ctx.lineCap = "round";
//   ctx.lineWidth = options.lineWidth;
//   ctx.strokeStyle = options.lineColor;
//   if (options.erase) ctx.globalCompositeOperation = "destination-out";
// };

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  ctx.beginPath();

  const cX = (x + from[0]) / 2;
  const cY = (x + from[1]) / 2;

  let radiusX = 0;
  let radiusY = 0;

  if (shift) {
    const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1] ** 2));
    radiusX = d / Math.sqrt(2) / 2;
    radiusY = d / Math.sqrt(2) / 2;
  } else {
    radiusX = Math.abs(cX - from[0]);
    radiusY = Math.abs(cY - from[1]);
  }

  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  ctx.beginPath();

  let width = 0;
  let height = 0;

  if (shift) {
    const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
    width = d / Math.sqrt(2);
    height = d / Math.sqrt(2);

    if (x - from[0] > 0 && y - from[1] < 0) height = -height;
    else if (y - from[1] > 0 && x - from[0] < 0) width = -width;
    else if (x - from[0] < 0 && y - from[1] < 0) {
      width = -width;
      height = -height;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  ctx.rect(from[0], from[1], width, height);

  ctx.stroke();
  ctx.closePath();

  return { width, height };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};
