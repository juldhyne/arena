import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { CharacterEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";
import { ReviveUpdate } from "../character-updates/revive-update";

export class ResurrectionEffect extends CharacterEffect {
  constructor(sourceId: string, turnsLeft: number = 5) {
    super("resurrection", sourceId, turnsLeft);
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
      return [new ReviveUpdate(this.sourceId, target.id)];
    }

    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new ResurrectionEffect(this.sourceId, this.turnsLeft - 1);
  }
}
