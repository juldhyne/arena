import { version } from "node:os";
import { Character } from "../../models/character";
import { PositionUpdate } from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

enum GallopingDirection {
  NORTH_NORTH_WEST,
  NORTH_NORTH_EAST,
  NORTH_WEST_WEST,
  NORTH_EAST_EAST,
  SOUTH_WEST_WEST,
  SOUTH_EAST_EAST,
  SOUTH_SOUTH_WEST,
  SOUTH_SOUTH_EAST,
}

export class GallopingDashUpdate extends PositionUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
    public readonly direction: GallopingDirection,
  ) {
    super(sourceId, targetId);
  }

  protected calculatePath(c: Character, s: GameState): Position[] {
    let offsets: { dx: number; dy: number }[];

    switch (this.direction) {
      case GallopingDirection.NORTH_NORTH_WEST:
        offsets = [
          { dx: 0, dy: 1 },
          { dx: 0, dy: 2 },
          { dx: -1, dy: 2 },
        ];
      case GallopingDirection.NORTH_NORTH_EAST:
        offsets = [
          { dx: 0, dy: 1 },
          { dx: 0, dy: 2 },
          { dx: 1, dy: 2 },
        ];
      case GallopingDirection.NORTH_WEST_WEST:
        offsets = [
          { dx: 0, dy: 1 },
          { dx: -1, dy: 1 },
          { dx: -2, dy: 1 },
        ];
      case GallopingDirection.NORTH_EAST_EAST:
        offsets = [
          { dx: 0, dy: 1 },
          { dx: 1, dy: 1 },
          { dx: 2, dy: 1 },
        ];
      case GallopingDirection.SOUTH_WEST_WEST:
        offsets = [
          { dx: 0, dy: -1 },
          { dx: -1, dy: -1 },
          { dx: -2, dy: -1 },
        ];
      case GallopingDirection.SOUTH_EAST_EAST:
        offsets = [
          { dx: 0, dy: -1 },
          { dx: 1, dy: -1 },
          { dx: 2, dy: -1 },
        ];
      case GallopingDirection.SOUTH_SOUTH_WEST:
        offsets = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: -2 },
          { dx: -1, dy: -2 },
        ];
      case GallopingDirection.SOUTH_SOUTH_EAST:
        offsets = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: -2 },
          { dx: 1, dy: -2 },
        ];
    }

    const path: Position[] = [];
    for (const offset of offsets) {
      const newPosition = {
        x: c.position.x + offset.dx,
        y: c.position.y + offset.dy,
      };
      path.push(newPosition);
    }
    return path;
  }

  protected resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position {
    const destination = path[path.length - 1];
    const occupied = s.characters.some(
      (c) => c.position.x === destination.x && c.position.y === destination.y,
    );
    return occupied ? start : destination;
  }
}
