import { Character } from "./character";
import { CharacterUpdate, DamageUpdate } from "./character-update";
import { GameState } from "./game-state";

export abstract class Effect {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly turnsLeft: number,
  ) {}

  abstract decrementTurnsLeft(): Effect;

  onTurnEnd?(target: Character, state: GameState): CharacterUpdate[];
}

export abstract class CharacterEffect extends Effect {
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
    state: GameState,
  ): CharacterUpdate[];

  abstract override decrementTurnsLeft(): CharacterEffect;
}

export abstract class TileEffect extends Effect {
  // Called when a character enters or passes over a tile
  abstract onCharacterPass(
    character: Character,
    state: GameState,
  ): CharacterUpdate[];

  abstract override decrementTurnsLeft(): TileEffect;
}

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

  onAfterUpdateApplied(): CharacterUpdate[] {
    return [];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new BerserkerEffect(this.sourceId, this.turnsLeft - 1);
  }
}

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

  onAfterUpdateApplied(): CharacterUpdate[] {
    return [];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  decrementTurnsLeft(): CharacterEffect {
    return new PoisonEffect(this.sourceId, this.turnsLeft - 1);
  }
}

export class BurningFloorTileEffect extends TileEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("burningfloor", sourceId, turnsLeft);
  }

  onCharacterPass(character: Character, state: GameState): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  decrementTurnsLeft(): TileEffect {
    return new BurningFloorTileEffect(this.sourceId, this.turnsLeft - 1);
  }
}
