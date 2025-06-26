export class Character {
  constructor(
    public readonly id: string,
    public readonly hp: number,
    public readonly maxHp: number,
  ) {}

  applyDamage(damage: number): Character {
    return new Character(this.id, Math.max(this.hp - damage, 0), this.maxHp);
  }

  applyHeal(heal: number): Character {
    if (!this.isAlive()) return this;
    return new Character(
      this.id,
      Math.min(this.hp + heal, this.maxHp),
      this.maxHp,
    );
  }

  applyRevive(): Character {
    if (this.isAlive()) return this;
    return new Character(this.id, 5, this.maxHp);
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
