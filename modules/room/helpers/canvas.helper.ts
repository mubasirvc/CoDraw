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

const getWidthAndHeight = (
  x: number,
  y: number,
  from: [number, number],
  shift?: boolean
) => {
  let width = x - from[0];
  let height = y - from[1];

  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0 && height < 0) || (width < 0 && height > 0))
        width = -height;
      else width = height;
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0))
      height = -width;
    else height = width;
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  return { width, height };
};

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

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  const cX = from[0] + width / 2;
  const cY = from[1] + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  if (shift) ctx.arc(cX, cY, 0, 0, 2 * Math.PI);
  else ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.fill()
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
  fill?: boolean
) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  if (fill) ctx.fillRect(from[0], from[1], width, height);
  else ctx.rect(from[0], from[1], width, height);

  ctx.stroke();
  ctx.fill()
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
