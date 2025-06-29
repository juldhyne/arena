import { AffectedTile } from "./affected-tile";
import { Board } from "./board";
import { Character } from "./character";
import { CharacterUpdate } from "./character-update";

export class GameState {
  constructor(
    public readonly characters: Character[],
    public readonly board: Board,
    public readonly turn: number,
    public readonly affectedTiles: AffectedTile[],
  ) {}

  applyUpdate(update: CharacterUpdate): GameState {
    return new GameState(
      this.characters.map((c) =>
        c.id === update.targetId ? update.applyToCharacter(c, this) : c,
      ),
      this.board,
      this.turn,
      this.affectedTiles,
    );
  }

  incrementTurn(): GameState {
    return new GameState(
      this.characters.map((c) => c.decrementEffects()),
      this.board,
      this.turn + 1,
      this.affectedTiles.map((at) => at.decrementEffects()),
    );
  }
}
