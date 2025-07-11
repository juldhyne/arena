import { Character } from "../../models/character";
import { GameStateUpdate } from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

export class AreaPatternTile {
  constructor(
    public readonly offsetX: number,
    public readonly offsetY: number,
    public readonly effectFactory: (
      source: Character,
      target: Character | undefined,
      position: Position,
      state: GameState,
    ) => GameStateUpdate | null,
  ) {}
}

export class AreaPattern {
  constructor(public readonly tiles: AreaPatternTile[]) {}

  /**
   * Returns all actual positions affected by the pattern from a center position.
   */
  getAffectedPositions(center: Position): {
    position: Position;
    tile: AreaPatternTile;
  }[] {
    return this.tiles.map((tile) => ({
      position: {
        x: center.x + tile.offsetX,
        y: center.y + tile.offsetY,
      },
      tile,
    }));
  }
}

export class AreaSkill {
  constructor(public readonly pattern: AreaPattern) {}

  getUpdates(
    source: Character,
    state: GameState,
    center: Position,
  ): GameStateUpdate[] {
    const updates: GameStateUpdate[] = [];

    const affected = this.pattern.getAffectedPositions(center);

    for (const { position, tile } of affected) {
      const target = state.characters.find(
        (c) =>
          c.position.x === position.x &&
          c.position.y === position.y &&
          c.isAlive(),
      );

      const update = tile.effectFactory(source, target, position, state);
      if (update) {
        updates.push(update);
      }
    }

    return updates;
  }
}
