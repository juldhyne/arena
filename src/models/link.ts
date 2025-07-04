import { CharacterUpdate, GameStateUpdate } from "./character-update";
import { GameState } from "./game-state";

export abstract class Link {
  constructor(
    public readonly id: string,
    public readonly char1Id: string,
    public readonly char2Id: string,
  ) {}

  abstract onUpdate(
    update: CharacterUpdate,
    state: GameState,
  ): GameStateUpdate[];
}
