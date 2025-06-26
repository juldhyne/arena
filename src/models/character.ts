export class Character {
  constructor(public readonly id: string, public readonly hp: number) {}

  applyDamage(damage: number): Character {
    return new Character(this.id, Math.max(this.hp - damage, 0));
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
