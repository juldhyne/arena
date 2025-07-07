import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";

export class DirectionUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly direction: Direction,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyDirection(this.direction);
  }
}
