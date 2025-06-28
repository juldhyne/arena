import { Effect } from "./effect";
import { Position } from "./position";

export class Character {
  constructor(
    public readonly id: string,
    public readonly hp: number,
    public readonly maxHp: number,
    public readonly position: Position,
    public readonly effects: Effect[] = [],
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

  applyPosition(position: Position): Character {
    return this.copyWith({ position: position });
  }

  private copyWith(params: {
    hp?: number;
    position?: Position;
    effects?: Effect[];
  }): Character {
    return new Character(
      this.id,
      params.hp ?? this.hp,
      this.maxHp,
      params.position ?? this.position,
      params.effects ?? this.effects,
    );
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
