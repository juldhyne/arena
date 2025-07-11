import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { DamageUpdate } from "../character-updates/damage-update";

export class DodgeEffect extends CharacterEffect {
  constructor(
    sourceId: string,
    turnsLeft: number = 1,
    public readonly damagesLeft: number,
  ) {
    super("dodge", sourceId, turnsLeft);
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
        update.amount - this.damagesLeft,
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
      const updatedEffect = new DodgeEffect(
        this.sourceId,
        this.turnsLeft,
        Math.max(0, this.damagesLeft - update.amount),
      );
      return [new AddEffectUpdate(source.id, source.id, updatedEffect)];
    }
    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new DodgeEffect(this.sourceId, this.turnsLeft - 1, this.damagesLeft);
  }
}
