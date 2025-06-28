import { Position } from "./position";

export enum Direction {
  NORTH,
  WEST,
  EAST,
  SOUTH,
  NORTH_WEST,
  NORTH_EAST,
  SOUTH_WEST,
  SOUTH_EAST,
}

export function moveInDirection(
  origin: Position,
  direction: Direction,
  distance: number,
  board: { minX: number; maxX: number; minY: number; maxY: number },
): Position {
  let x = origin.x;
  let y = origin.y;

  const dx =
    direction === Direction.EAST ||
    direction === Direction.NORTH_EAST ||
    direction === Direction.SOUTH_EAST
      ? 1
      : direction === Direction.WEST ||
        direction === Direction.NORTH_WEST ||
        direction === Direction.SOUTH_WEST
      ? -1
      : 0;

  const dy =
    direction === Direction.NORTH ||
    direction === Direction.NORTH_EAST ||
    direction === Direction.NORTH_WEST
      ? 1
      : direction === Direction.SOUTH ||
        direction === Direction.SOUTH_EAST ||
        direction === Direction.SOUTH_WEST
      ? -1
      : 0;

  for (let i = 0; i < distance; i++) {
    const nextX = x + dx;
    const nextY = y + dy;

    const withinX = nextX >= board.minX && nextX <= board.maxX;
    const withinY = nextY >= board.minY && nextY <= board.maxY;

    if (!withinX || !withinY) break;

    x = nextX;
    y = nextY;
  }

  return { x, y };
}
