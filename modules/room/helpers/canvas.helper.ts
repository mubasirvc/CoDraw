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

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  room: ClientRoom,
) => {
  const {users,  movesWithoutUser, myMoves} = room
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  movesWithoutUser?.forEach((move) => {
    handleMove(move, ctx);
  });

  users?.forEach((user) => {
    user?.forEach((move) => handleMove(move, ctx));
  });

  myMoves?.forEach((move) => handleMove(move, ctx));
};
