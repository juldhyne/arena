import { Direction } from "./direction";
import { CharacterEffect, Effect } from "./effect";
import { Position } from "./position";

export class Character {
  constructor(
    public readonly id: string,
    public readonly teamId: string,
    public readonly hp: number,
    public readonly maxHp: number,
    public readonly speed: number,
    public readonly position: Position,
    public readonly direction: Direction,
    public readonly effects: CharacterEffect[] = [],
  ) {}

  applyDamage(damage: number): Character {
    return this.copyWith({ hp: Math.max(this.hp - damage, 0) });
  }

  applyHeal(heal: number): Character {
    if (!this.isAlive()) return this;
    return this.copyWith({ hp: Math.min(this.hp + heal, this.maxHp) });
  }

  applyRevive(): Character {
    if (this.isAlive()) return this;
    return this.copyWith({ hp: 5 });
  }

  applySpeed(speed: number): Character {
    return this.copyWith({ speed: speed });
  }

  applyPosition(position: Position): Character {
    return this.copyWith({ position: position });
  }

  applyDirection(direction: Direction): Character {
    return this.copyWith({ direction: direction });
  }

  applyAddEffect(effect: CharacterEffect): Character {
    const effects = [...this.effects.filter((e) => e.id !== effect.id), effect];
    return this.copyWith({ effects: effects });
  }

  applyRemoveEffect(effectId: string): Character {
    const effects = [...this.effects.filter((e) => e.id !== effectId)];
    return this.copyWith({ effects: effects });
  }

  decrementEffects(): Character {
    const effects = this.effects
      .map((e) => e.decrementTurnsLeft())
      .filter((e) => e.turnsLeft > 0);
    return this.copyWith({ effects: effects });
  }

  private copyWith(params: {
    hp?: number;
    speed?: number;
    position?: Position;
    direction?: Direction;
    effects?: CharacterEffect[];
  }): Character {
    return new Character(
      this.id,
      this.teamId,
      params.hp ?? this.hp,
      this.maxHp,
      params.speed ?? this.speed,
      params.position ?? this.position,
      params.direction ?? this.direction,
      params.effects ?? this.effects,
    );
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
