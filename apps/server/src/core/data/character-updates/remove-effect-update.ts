import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { GameState } from "../../models/game-state";

export class RemoveEffectUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly effectId: string,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyRemoveEffect(this.effectId);
  }
}
