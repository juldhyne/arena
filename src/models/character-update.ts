export class CharacterUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
    public readonly damages: number,
  ) {}
}
