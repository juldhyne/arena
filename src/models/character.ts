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
    return new Character(
      this.id,
      this.hp === 0 ? 0 : Math.min(this.hp + heal, this.maxHp),
      this.maxHp,
    );
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
