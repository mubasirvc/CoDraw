import { CANVAS_SIZE } from "@/common/constants";
import { ClientRoom, Move } from "@/common/types/socketTypes";

export const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const tempCtx = ctx;
  const { options, path } = move;

  if (tempCtx) {
    tempCtx.lineWidth = options.lineWidth;
    tempCtx.strokeStyle = options.lineColor;

    tempCtx.beginPath();
    path?.forEach(([x, y]) => {
      tempCtx.lineTo(x, y);
    });
    tempCtx.stroke();
    tempCtx.closePath();
  }
};

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#ccc"

  for(let i = 0; i < CANVAS_SIZE.height; i += 25){
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(ctx.canvas.width, i)
    ctx.stroke()
  }
  
  for(let i = 0; i < CANVAS_SIZE.width; i += 25){
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, ctx.canvas.height)
    ctx.stroke()
  }
}

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  room: ClientRoom,
) => {
  const {usersMoves,  movesWithoutUser, myMoves} = room
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // drawBackground(ctx)

  movesWithoutUser?.forEach((move) => {
    handleMove(move, ctx);
  });

  usersMoves?.forEach((user) => {
    user?.forEach((move) => handleMove(move, ctx));
  });

  myMoves?.forEach((move) => handleMove(move, ctx));
};


