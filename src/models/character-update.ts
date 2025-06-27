import { Character } from "./character";
import { GameState } from "./game-state";
import { Position } from "./position";

export abstract class CharacterUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
  ) {}

  abstract applyToCharacter(c: Character, s: GameState): Character;

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

  static revive(sourceId: string, targetId: string): ReviveUpdate {
    return new ReviveUpdate(sourceId, targetId);
  }

  static teleportation(
    sourceId: string,
    targetId: string,
    position: Position,
  ): PositionUpdate {
    return new TeleportationUpdate(sourceId, targetId, position);
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

  applyToCharacter(c: Character, s: GameState): Character {
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

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyHeal(this.amount);
  }
}

export class ReviveUpdate extends CharacterUpdate {
  constructor(sourceId: string, targetId: string) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyRevive();
  }
}

export abstract class PositionUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly position: Position,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    const isOccupied = s.characters.some(
      (char) =>
        char.id !== this.targetId &&
        char.position.x == this.position.x &&
        char.position.y == this.position.y,
    );

    if (isOccupied) {
      const newPosition = this.handleConflict(c, s);
      return c.applyPosition(newPosition);
    }

    return c.applyPosition(this.position);
  }

  protected abstract handleConflict(c: Character, s: GameState): Position;
}

export class TeleportationUpdate extends PositionUpdate {
  // If trying to teleport on an occupied position, then does not move
  protected handleConflict(c: Character, s: GameState): Position {
    return c.position;
  }
}
