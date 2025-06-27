import { Character } from "./character";
import { CharacterUpdate } from "./character-update";

export class GameState {
  constructor(public readonly characters: Character[]) {}

  applyUpdate(update: CharacterUpdate): GameState {
    return new GameState(
      this.characters.map((c) =>
        c.id === update.targetId ? update.applyToCharacter(c, this) : c,
      ),
    );
  }
}
