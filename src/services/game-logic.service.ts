import { Character } from "../models/character";
import { CharacterUpdate } from "../models/character-update";
import { GameState } from "../models/game-state";

export class GameLogicService {
  turnLogic(initialState: GameState, updates: CharacterUpdate[]): GameState {
    const orderedUpdates = this.orderUpdatesByCharacterSpeed(
      updates,
      initialState,
    );

    let state = this.applyUpdates(initialState, orderedUpdates);

    const orderedCharacters = this.orderCharactersBySpeed(state.characters);

    for (let character of orderedCharacters) {
      for (let effect of character.effects) {
        if (effect.onTurnEnd) {
          const effectUpdates = effect.onTurnEnd(character, state);
          state = this.applyUpdates(state, effectUpdates);
        }
      }
    }

    state = state.incrementTurn();

    return state;
  }

  private applyUpdates(
    initialState: GameState,
    updates: CharacterUpdate[],
  ): GameState {
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

  private orderUpdatesByCharacterSpeed(
    updates: CharacterUpdate[],
    state: GameState,
  ): CharacterUpdate[] {
    // Create a map for quick character lookup
    const characterMap = new Map(state.characters.map((c) => [c.id, c]));

    // Group updates by sourceId
    const updatesBySource = new Map<string, CharacterUpdate[]>();
    for (const update of updates) {
      if (!characterMap.has(update.sourceId)) continue;
      const list = updatesBySource.get(update.sourceId) ?? [];
      list.push(update);
      updatesBySource.set(update.sourceId, list);
    }

    // Sort characters by speed descending (tie-breaker: id)
    const sortedCharacters = this.orderCharactersBySpeed([
      ...characterMap.values(),
    ]);

    // Flatten updates in sorted character order
    const sortedUpdates: CharacterUpdate[] = [];
    for (const character of sortedCharacters) {
      const charUpdates = updatesBySource.get(character.id);
      if (charUpdates) {
        sortedUpdates.push(...charUpdates);
      }
    }

    return sortedUpdates;
  }

  private orderCharactersBySpeed(characters: Character[]): Character[] {
    const sortedCharacters = characters
      .filter((c) => c.isAlive())
      .sort((a, b) =>
        b.speed === a.speed ? a.id.localeCompare(b.id) : b.speed - a.speed,
      );
    return sortedCharacters;
  }
}
