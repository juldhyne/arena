import { Character } from "./character";
import { CharacterUpdate, DamageUpdate } from "./character-update";
import { GameState } from "./game-state";

export abstract class Effect {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly turnsLeft: number,
  ) {}

  abstract modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract modifyIncomingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    newState: GameState,
  ): CharacterUpdate[];

  abstract decrementTurnsLeft(): Effect;

  onTurnEnd?(character: Character, state: GameState): CharacterUpdate[];
}

export class BerserkerEffect extends Effect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("berserker", sourceId, turnsLeft);
  }

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

  decrementTurnsLeft(): Effect {
    return new BerserkerEffect(this.sourceId, this.turnsLeft - 1);
  }
}

export class FightBackEffect extends Effect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("fightback", sourceId, turnsLeft);
  }

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
      target.effects.some((e) => e.id === "fightback")
    ) {
      return [new DamageUpdate(target.id, source.id, update.amount)];
    }
    return [];
  }

  decrementTurnsLeft(): Effect {
    return new FightBackEffect(this.sourceId, this.turnsLeft - 1);
  }
}

export class PoisonEffect extends Effect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("poison", sourceId, turnsLeft);
  }

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
    newState: GameState,
  ): CharacterUpdate[] {
    return [];
  }

  decrementTurnsLeft(): Effect {
    return new PoisonEffect(this.sourceId, this.turnsLeft - 1);
  }

  onTurnEnd(character: Character, state: GameState): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }
}
