import { Character } from "../../models/character";
import { PositionUpdate } from "../../models/character-update";
import { Direction, moveInDirection } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

export class DashUpdate extends PositionUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    private readonly direction: Direction,
    private readonly distance: number,
    private readonly allowBackwardFallback: boolean = false,
  ) {
    super(sourceId, targetId);
  }

  protected calculatePath(c: Character, s: GameState): Position[] {
    const path: Position[] = [];
    let { x, y } = c.position;

    for (let i = 1; i <= this.distance; i++) {
      const next = moveInDirection({ x, y }, this.direction, i, s.board);
      path.push(next);
    }

    return path;
  }

  protected resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position {
    // First check if final tile is occupied
    const final = path[path.length - 1];

    const isFinalOccupied = s.characters.some(
      (char) =>
        char.id !== this.targetId &&
        char.position.x === final.x &&
        char.position.y === final.y,
    );

    if (this.allowBackwardFallback && isFinalOccupied) {
      // Try to go forward (past the target) by 1 tile
      const oneBeyond = moveInDirection(final, this.direction, 1, s.board);

      const isOneBeyondOccupied = s.characters.some(
        (char) =>
          char.id !== this.targetId &&
          char.position.x === oneBeyond.x &&
          char.position.y === oneBeyond.y,
      );

      const withinBoard =
        oneBeyond.x >= s.board.minX &&
        oneBeyond.x <= s.board.maxX &&
        oneBeyond.y >= s.board.minY &&
        oneBeyond.y <= s.board.maxY;

      if (withinBoard && !isOneBeyondOccupied) {
        return oneBeyond;
      }
    }

    // Fall back to previous tiles (backward) if needed
    for (let i = path.length - 1; i >= 0; i--) {
      const pos = path[i];
      const isOccupied = s.characters.some(
        (char) =>
          char.id !== this.targetId &&
          char.position.x === pos.x &&
          char.position.y === pos.y,
      );

      if (!isOccupied) {
        return pos;
      }
    }

    // All positions in the path are occupied
    return start;
  }
}
