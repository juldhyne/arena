import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { GameState } from "../../models/game-state";

export class DamageUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly amount: number,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyDamage(Math.max(0, this.amount));
  }
}
