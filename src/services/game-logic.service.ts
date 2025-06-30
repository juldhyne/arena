import { Character } from "../models/character";
import { CharacterUpdate } from "../models/character-update";
import { GameState } from "../models/game-state";
import { TurnAction } from "../models/turn-action";
import { SkillRegistryService } from "./skill-registry.service";

export class GameLogicService {
  constructor(private readonly skillRegistry: SkillRegistryService) {}

  turnLogic(initialState: GameState, actions: TurnAction[]): GameState {
    let state = initialState;
    // Order actions by character speed
    const orderedActions = this.orderActionsByCharacterSpeed(actions, state);

    for (const action of orderedActions) {
      const executor = this.skillRegistry.getExecutor(action.skillId);
      const source = state.characters.find((c) => c.id === action.sourceId);

      if (!executor || !source) continue;

      const skillUpdates = executor.execute(source, state, action.params);

      state = this.applyUpdates(state, skillUpdates);
    }

    // Effects on turn end
    const orderedCharacters = this.orderCharactersBySpeed(state.characters);

    for (let character of orderedCharacters) {
      for (let effect of character.effects) {
        if (effect.onTurnEnd) {
          const effectUpdates = effect.onTurnEnd(character, state);
          state = this.applyUpdates(state, effectUpdates);
        }
      }
    }

    return state.incrementTurn();
  }

  private orderActionsByCharacterSpeed(
    actions: TurnAction[],
    state: GameState,
  ): TurnAction[] {
    const characterMap = new Map(state.characters.map((c) => [c.id, c]));

    return [...actions]
      .filter((action) => {
        const character = characterMap.get(action.sourceId);
        return character && character.isAlive();
      })
      .sort((a, b) => {
        const charA = characterMap.get(a.sourceId)!;
        const charB = characterMap.get(b.sourceId)!;

        return charB.speed === charA.speed
          ? charA.id.localeCompare(charB.id)
          : charB.speed - charA.speed;
      });
  }

  private orderCharactersBySpeed(characters: Character[]): Character[] {
    return characters
      .filter((c) => c.isAlive())
      .sort((a, b) =>
        b.speed === a.speed ? a.id.localeCompare(b.id) : b.speed - a.speed,
      );
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

      state = state.applyUpdate(update);

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

      queue.unshift(...reactiveUpdates);
    }

    return state;
  }
}
