import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class BadEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("bad", sourceId, turnsLeft);
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
    return update;
  }

  onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    state: GameState,
  ): CharacterUpdate[] {
    if (this.turnsLeft == 1) {
      return [new DamageUpdate(this.sourceId, target.id, 3)];
    }

    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new BadEffect(this.sourceId, this.turnsLeft - 1);
  }
}
