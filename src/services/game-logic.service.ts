import { Character } from "../models/character";
import { CharacterUpdate, GameStateUpdate } from "../models/character-update";
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

      const skillAndLinkUpdates = this.applyLinks(skillUpdates, state);

      state = this.applyUpdates(state, skillAndLinkUpdates);
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
    updates: GameStateUpdate[],
  ): GameState {
    let state = initialState;

    const queue: GameStateUpdate[] = [...updates];

    while (queue.length > 0) {
      let update = queue.shift()!;

      const result = update.applyToGameState(state);
      state = result.updatedState;

      queue.unshift(...result.reactiveUpdates);
    }

    return state;
  }

  private applyLinks(
    updates: GameStateUpdate[],
    state: GameState,
  ): GameStateUpdate[] {
    const totalUpdates: GameStateUpdate[] = [];
    for (let update of updates) {
      totalUpdates.push(update);
      if (update instanceof CharacterUpdate) {
        const links = state.links.filter(
          (link) =>
            link.char1Id === update.sourceId ||
            link.char1Id === update.targetId ||
            link.char2Id === update.sourceId ||
            link.char2Id === update.targetId,
        );

        for (let link of links) {
          const updates = link.onUpdate(update, state);
          totalUpdates.push(...updates);
        }
      }
    }
    return totalUpdates;
  }
}
