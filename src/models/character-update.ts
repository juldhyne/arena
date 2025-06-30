import { Character } from "./character";

import { GameState } from "./game-state";
import { Position } from "./position";

export abstract class CharacterUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
  ) {}

  abstract applyToCharacter(c: Character, s: GameState): Character;
}

export abstract class PositionUpdate extends CharacterUpdate {
  constructor(sourceId: string, targetId: string) {
    super(sourceId, targetId);
  }

  applyToCharacter(c: Character, s: GameState): Character {
    const path = this.calculatePath(c, s);

    let character = c;
    let currentPosition = c.position;

    for (const position of path) {
      const tile = s.affectedTiles.find(
        (t) => t.position.x === position.x && t.position.y === position.y,
      );

      if (tile) {
        for (const effect of tile.effects) {
          const updates = effect.onCharacterPass(character, s);
          for (const update of updates) {
            character = update.applyToCharacter(character, s);
            // Check if the character has died
            if (!character.isAlive()) {
              return character.applyPosition(position); // died here
            }
          }
        }
      }

      currentPosition = position; // only advance position if not dead
    }

    const finalPos = this.resolveConflicts(c.position, path, s);
    return character.isAlive()
      ? character.applyPosition(finalPos)
      : character.applyPosition(currentPosition);
  }

  protected abstract calculatePath(c: Character, s: GameState): Position[];
  protected abstract resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position;
}
