export interface CtxOptions {
  lineWidth: number;
  lineColor: string;
}

export interface ServerToClientEvents {
  user_undo(userId: string): void,
  user_draw: (newMoves: [number, number][], options: CtxOptions, userId: string) => void;
  mouse_moved: (x: number, y: number, socketId: string) => void;
  users_in_room: (socketIds: string[]) => void;
  user_disconnected: (socketId: string) => void;
}

export interface ClientToServerEvents {
  draw: (moves: [number, number][], options: CtxOptions) => void;
  mouse_move: (x: number, y: number) => void;
  undo: () => void;
}
