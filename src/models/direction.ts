import { Board } from "./board";
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

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.WEST:
      return Direction.EAST;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.NORTH_WEST:
      return Direction.SOUTH_EAST;
    case Direction.NORTH_EAST:
      return Direction.SOUTH_WEST;
    case Direction.SOUTH_WEST:
      return Direction.NORTH_EAST;
    case Direction.SOUTH_EAST:
      return Direction.NORTH_WEST;
  }
}

export function getDistanceLeftInDirection(
  origin: Position,
  direction: Direction,
  board: Board,
): number {
  switch (direction) {
    case Direction.NORTH:
      return board.maxY - origin.y;
    case Direction.WEST:
      return origin.x - board.minX;
    case Direction.EAST:
      return board.maxX - origin.x;
    case Direction.SOUTH:
      return origin.y - board.minY;
    case Direction.NORTH_WEST:
      return Math.min(board.maxY - origin.y, origin.x - board.minX);
    case Direction.NORTH_EAST:
      return Math.min(board.maxY - origin.y, board.maxX - origin.x);
    case Direction.SOUTH_WEST:
      return Math.min(origin.y - board.minY, origin.x - board.minX);
    case Direction.SOUTH_EAST:
      return Math.min(origin.y - board.minY, board.maxX - origin.x);
  }
}

export function moveInDirection(
  origin: Position,
  direction: Direction,
  distance: number,
  board: Board,
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

export function getDistanceBetweenPositions(a: Position, b: Position): number {
  if (a.x === b.x) {
    return Math.abs(a.y - b.y);
  } else if (a.y === b.y) {
    return Math.abs(a.x - b.x);
  } else {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
}
