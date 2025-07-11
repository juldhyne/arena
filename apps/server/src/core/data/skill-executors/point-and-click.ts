import { Character } from "../../models/character";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

export class PointAndClick {
  constructor(public readonly position: Position) {}

  findTarget(state: GameState): Character | undefined {
    const target = state.characters.find(
      (c) =>
        c.position.x === this.position.x && c.position.y === this.position.y,
    );
    return target;
  }
}
