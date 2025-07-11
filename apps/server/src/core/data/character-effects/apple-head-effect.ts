import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";
import { RemoveEffectUpdate } from "../character-updates/remove-effect-update";

export class AppleHeadEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("applehead", sourceId, turnsLeft);
  }

  modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
  ): CharacterUpdate {
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
        update.amount + 2,
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
    if (update instanceof DamageUpdate && update.targetId === target.id) {
      return [new RemoveEffectUpdate(source.id, target.id, "applehead")];
    }
    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new AppleHeadEffect(this.sourceId, this.turnsLeft - 1);
  }
}
