export class Character {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly baseHp: number,
    public readonly baseSpeed: number,
    public readonly skills: Skill[],
  ) {}
}

export class Skill {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: number,
  ) {}
}
