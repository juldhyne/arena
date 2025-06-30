import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";

import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";

export class AddEffectUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly effect: CharacterEffect,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyAddEffect(this.effect);
  }
}
