import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class PoisonEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("poison", sourceId, turnsLeft);
  }

  modifyOutgoingUpdate(update: CharacterUpdate): CharacterUpdate {
    return update;
  }

  modifyIncomingUpdate(update: CharacterUpdate): CharacterUpdate {
    return update;
  }

  onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    state: GameState,
  ): CharacterUpdate[] {
    return [];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new PoisonEffect(this.sourceId, this.turnsLeft - 1);
  }
}
