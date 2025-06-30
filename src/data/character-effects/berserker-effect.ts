import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class BerserkerEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("berserker", sourceId, turnsLeft);
  }

  modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
  ): CharacterUpdate {
    if (update instanceof DamageUpdate && update.sourceId === character.id) {
      return new DamageUpdate(
        update.sourceId,
        update.targetId,
        update.amount + 2,
      );
    }
    return update;
  }

  modifyIncomingUpdate(
    update: CharacterUpdate,
    character: Character,
  ): CharacterUpdate {
    if (update instanceof DamageUpdate && update.targetId === character.id) {
      return new DamageUpdate(
        update.sourceId,
        update.targetId,
        update.amount - 2,
      );
    }
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

  decrementTurnsLeft(): CharacterEffect {
    return new BerserkerEffect(this.sourceId, this.turnsLeft - 1);
  }
}
