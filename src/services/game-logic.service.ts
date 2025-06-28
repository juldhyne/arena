import { CharacterUpdate, PositionUpdate } from "../models/character-update";
import { GameState } from "../models/game-state";

export class GameLogicService {
  applyUpdates(initialState: GameState, updates: CharacterUpdate[]): GameState {
    let state = initialState;
    const queue: CharacterUpdate[] = [...updates];

    while (queue.length > 0) {
      let update = queue.shift()!;

      const sourceCharacter = state.characters.find(
        (c) => c.id === update.sourceId,
      );
      const targetCharacter = state.characters.find(
        (c) => c.id === update.targetId,
      );

      if (!sourceCharacter || !sourceCharacter.isAlive() || !targetCharacter) {
        continue;
      }

      for (let effect of sourceCharacter.effects) {
        update =
          effect.modifyOutgoingUpdate?.(update, sourceCharacter, state) ??
          update;
      }

      for (let effect of targetCharacter.effects) {
        update =
          effect.modifyIncomingUpdate?.(update, targetCharacter, state) ??
          update;
      }

      // Apply the update
      state = state.applyUpdate(update);

      // Reactive updates from effects
      const reactiveUpdates: CharacterUpdate[] = [];

      for (let effect of targetCharacter.effects) {
        const reactions = effect.onAfterUpdateApplied?.(
          update,
          sourceCharacter,
          targetCharacter,
          state,
        );
        if (reactions?.length) reactiveUpdates.push(...reactions);
      }

      for (let effect of sourceCharacter.effects) {
        const reactions = effect.onAfterUpdateApplied?.(
          update,
          sourceCharacter,
          targetCharacter,
          state,
        );
        if (reactions?.length) reactiveUpdates.push(...reactions);
      }

      // Insert reactive updates at the front of the queue
      queue.unshift(...reactiveUpdates);
    }

    return state;
  }
}
