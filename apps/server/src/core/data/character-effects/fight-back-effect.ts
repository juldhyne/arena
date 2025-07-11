import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { DamageUpdate } from "../character-updates/damage-update";

export class FightBackEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("fightback", sourceId, turnsLeft);
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
  ): CharacterUpdate[] {
    if (
      update instanceof DamageUpdate &&
      target.effects.some((e) => e.id === "fightback")
    ) {
      return [new DamageUpdate(target.id, source.id, update.amount)];
    }
    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new FightBackEffect(this.sourceId, this.turnsLeft - 1);
  }
}
