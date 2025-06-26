import { Character } from "./character";

export abstract class CharacterUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
  ) {}

  abstract applyToCharacter(c: Character): Character;

  static damage(
    sourceId: string,
    targetId: string,
    amount: number,
  ): DamageUpdate {
    return new DamageUpdate(sourceId, targetId, amount);
  }

  static heal(sourceId: string, targetId: string, amount: number): HealUpdate {
    return new HealUpdate(sourceId, targetId, amount);
  }
}

export class DamageUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly amount: number,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character): Character {
    return c.applyDamage(this.amount);
  }
}

export class HealUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly amount: number,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character): Character {
    return c.applyHeal(this.amount);
  }
}
