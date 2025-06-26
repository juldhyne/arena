import { CharacterUpdate } from "../models/character-update";
import { GameState } from "../models/game-state";

export class GameLogicService {
  applyUpdates(initialState: GameState, updates: CharacterUpdate[]): GameState {
    let state = initialState;

    for (const update of updates) {
      // Find the source character
      const sourceCharacter = state.characters.find(
        (c) => c.id === update.sourceId,
      );
      if (!sourceCharacter || !sourceCharacter.isAlive()) {
        // Source character doesn’t exist or is dead -> skip
        continue;
      }
      // Apply the update
      state = state.applyUpdate(update);
    }

    return state;
  }
}
