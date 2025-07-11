import { AffectedTile } from "./affected-tile";
import { Board } from "./board";
import { Character } from "./character";
import { Link } from "./link";

export class GameState {
  constructor(
    public readonly characters: Character[],
    public readonly board: Board,
    public readonly turn: number,
    public readonly affectedTiles: AffectedTile[],
    public readonly links: Link[],
  ) {}

  incrementTurn(): GameState {
    return new GameState(
      this.characters.map((c) => c.decrementEffects()),
      this.board,
      this.turn + 1,
      this.affectedTiles.map((at) => at.decrementEffects()),
      this.links,
    );
  }
}
