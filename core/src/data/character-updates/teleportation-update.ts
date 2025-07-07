import { Character } from "../../models/character";
import { PositionUpdate } from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

export class TeleportationUpdate extends PositionUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    private readonly destination: Position,
  ) {
    super(sourceId, targetId);
  }

  protected calculatePath(c: Character, s: GameState): Position[] {
    return [this.destination];
  }
  protected resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position {
    const occupied = s.characters.some(
      (c) =>
        c.position.x === this.destination.x &&
        c.position.y === this.destination.y,
    );
    return occupied ? start : this.destination;
  }
}
