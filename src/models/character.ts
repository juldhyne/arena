import { Position } from "./position";

export class Character {
  constructor(
    public readonly id: string,
    public readonly hp: number,
    public readonly maxHp: number,
    public readonly position: Position,
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

  private copyWith(params: { hp?: number; position?: Position }): Character {
    return new Character(
      this.id,
      params.hp ?? this.hp,
      this.maxHp,
      params.position ?? this.position,
    );
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
