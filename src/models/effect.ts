import { Character } from "./character";
import { CharacterUpdate, DamageUpdate } from "./character-update";
import { GameState } from "./game-state";

export abstract class Effect {
  abstract modifyOutgoingUpdate(
    update: CharacterUpdate,
    source: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract modifyIncomingUpdate(
    update: CharacterUpdate,
    target: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    newState: GameState,
  ): CharacterUpdate[];
}

export class BerserkerEffect extends Effect {
  modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
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
    state: GameState,
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
}

export class FightBackEffect extends Effect {
  modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate {
    return update;
  }
  modifyIncomingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate {
    return update;
  }
  onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    state: GameState,
  ): CharacterUpdate[] {
    if (
      update instanceof DamageUpdate &&
      target.effects.some((e) => e instanceof FightBackEffect)
    ) {
      return [new DamageUpdate(target.id, source.id, update.amount)];
    }
    return [];
  }
}
