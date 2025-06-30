export class TurnAction {
  constructor(
    public readonly sourceId: string,
    public readonly skillId: string,
    public readonly params: Record<string, any>,
  ) {}
}
