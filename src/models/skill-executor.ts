import { Character } from "./character";
import { CharacterUpdate, GameStateUpdate } from "./character-update";
import { Direction } from "./direction";
import { GameState } from "./game-state";

export abstract class SkillExecutor {
  abstract execute(
    source: Character,
    state: GameState,
    param?: Record<string, any>,
  ): GameStateUpdate[];
}
