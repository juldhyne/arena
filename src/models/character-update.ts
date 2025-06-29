import { Character } from "./character";
import { Direction, moveInDirection } from "./direction";
import { CharacterEffect, Effect } from "./effect";
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

  static speed(sourceId: string, targetId: string, speed: number): SpeedUpdate {
    return new SpeedUpdate(sourceId, targetId, speed);
  }

  static teleportation(
    sourceId: string,
    targetId: string,
    position: Position,
  ): PositionUpdate {
    return new TeleportationUpdate(sourceId, targetId, position);
  }

  static dash(
    sourceId: string,
    targetId: string,
    direction: Direction,
    distance: number,
  ): PositionUpdate {
    return new DashUpdate(sourceId, targetId, direction, distance);
  }

  static addEffect(
    sourceId: string,
    targetId: string,
    effect: CharacterEffect,
  ): AddEffectUpdate {
    return new AddEffectUpdate(sourceId, targetId, effect);
  }

  static removeEffect(
    sourceId: string,
    targetId: string,
    effectId: string,
  ): RemoveEffectUpdate {
    return new RemoveEffectUpdate(sourceId, targetId, effectId);
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
    return c.applyDamage(Math.max(0, this.amount));
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

export class SpeedUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly speed: number,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applySpeed(this.speed);
  }
}

export abstract class PositionUpdate extends CharacterUpdate {
  constructor(sourceId: string, targetId: string) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    const path = this.calculatePath(c, s);

    let character = c;
    let currentPosition = c.position;

    for (const position of path) {
      const tile = s.affectedTiles.find(
        (t) => t.position.x === position.x && t.position.y === position.y,
      );

      if (tile) {
        for (const effect of tile.effects) {
          const updates = effect.onCharacterPass(character, s);
          for (const update of updates) {
            character = update.applyToCharacter(character, s);
            // Check if the character has died
            if (!character.isAlive()) {
              return character.applyPosition(position); // died here
            }
          }
        }
      }

      currentPosition = position; // only advance position if not dead
    }

    const finalPos = this.resolveConflicts(c.position, path, s);
    return character.isAlive()
      ? character.applyPosition(finalPos)
      : character.applyPosition(currentPosition);
  }

  protected abstract calculatePath(c: Character, s: GameState): Position[];
  protected abstract resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position;
}

export class TeleportationUpdate extends PositionUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    private readonly destination: Position,
  ) {
    super(sourceId, targetId);
  }

  protected calculatePath(c: Character, s: GameState): Position[] {
    return [this.destination];
  }
  protected resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position {
    const occupied = s.characters.some(
      (c) =>
        c.position.x === this.destination.x &&
        c.position.y === this.destination.y,
    );
    return occupied ? start : this.destination;
  }
}

export class DashUpdate extends PositionUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    private readonly direction: Direction,
    private readonly distance: number,
  ) {
    super(sourceId, targetId);
  }

  protected calculatePath(c: Character, s: GameState): Position[] {
    const path: Position[] = [];
    let { x, y } = c.position;

    for (let i = 1; i <= this.distance; i++) {
      const next = moveInDirection({ x, y }, this.direction, i, s.board);
      path.push(next);
    }

    return path;
  }
  protected resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position {
    for (let i = path.length - 1; i >= 0; i--) {
      const pos = path[i];
      const isOccupied = s.characters.some(
        (char) =>
          char.id !== this.targetId &&
          char.position.x === pos.x &&
          char.position.y === pos.y,
      );

      if (!isOccupied) {
        return pos;
      }
    }

    // All positions in the path are occupied, stay in place
    return start;
  }
}

export class AddEffectUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly effect: CharacterEffect,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyAddEffect(this.effect);
  }
}

export class RemoveEffectUpdate extends CharacterUpdate {
  constructor(
    sourceId: string,
    targetId: string,
    public readonly effectId: string,
  ) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    return c.applyRemoveEffect(this.effectId);
  }
}
