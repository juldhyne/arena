import { AffectedTile } from "./affected-tile";
import { Character } from "./character";
import { TileEffect } from "./effect";

import { GameState } from "./game-state";
import { Link } from "./link";
import { Position } from "./position";

export class GameStateUpdateResult {
  constructor(
    public readonly updatedState: GameState,
    public readonly reactiveUpdates: GameStateUpdate[],
  ) {}
}

export abstract class GameStateUpdate {
  abstract applyToGameState(state: GameState): GameStateUpdateResult;
}

export class AddLinkUpdate extends GameStateUpdate {
  constructor(public readonly link: Link) {
    super();
  }
  applyToGameState(state: GameState): GameStateUpdateResult {
    const updatedState = new GameState(
      state.characters,
      state.board,
      state.turn,
      state.affectedTiles,
      [
        ...state.links.filter(
          (l) =>
            l.char1Id !== this.link.char1Id &&
            l.char2Id !== this.link.char2Id &&
            l.id !== this.link.id,
        ),
        this.link,
      ],
    );
    return new GameStateUpdateResult(updatedState, []);
  }
}

export class RemoveLinkUpdate extends GameStateUpdate {
  constructor(public readonly link: Link) {
    super();
  }
  applyToGameState(state: GameState): GameStateUpdateResult {
    const updatedState = new GameState(
      state.characters,
      state.board,
      state.turn,
      state.affectedTiles,
      state.links.filter(
        (l) =>
          l.char1Id !== this.link.char1Id &&
          l.char2Id !== this.link.char2Id &&
          l.id !== this.link.id,
      ),
    );
    return new GameStateUpdateResult(updatedState, []);
  }
}

export class AddTileEffectUpdate extends GameStateUpdate {
  constructor(
    public readonly position: Position,
    public readonly tileEffect: TileEffect,
  ) {
    super();
  }
  applyToGameState(state: GameState): GameStateUpdateResult {
    const updatedState = new GameState(
      state.characters,
      state.board,
      state.turn,
      state.affectedTiles.map((at) =>
        at.position.x === this.position.x && at.position.y === this.position.y
          ? new AffectedTile(at.position, [
              ...at.effects.filter((e) => e.id != this.tileEffect.id),
              this.tileEffect,
            ])
          : at,
      ),
      state.links,
    );
    return new GameStateUpdateResult(updatedState, []);
  }
}

export class RemoveTileEffectUpdate extends GameStateUpdate {
  constructor(
    public readonly position: Position,
    public readonly tileEffectId: string,
  ) {
    super();
  }
  applyToGameState(state: GameState): GameStateUpdateResult {
    const updatedState = new GameState(
      state.characters,
      state.board,
      state.turn,
      state.affectedTiles.map((at) =>
        at.position.x === this.position.x && at.position.y === this.position.y
          ? new AffectedTile(at.position, [
              ...at.effects.filter((e) => e.id != this.tileEffectId),
            ])
          : at,
      ),
      state.links,
    );
    return new GameStateUpdateResult(updatedState, []);
  }
}

export abstract class CharacterUpdate extends GameStateUpdate {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
  ) {
    super();
  }

  abstract applyToCharacter(c: Character, s: GameState): Character;

  applyToGameState(state: GameState): GameStateUpdateResult {
    const sourceCharacter = state.characters.find(
      (c) => c.id === this.sourceId,
    );
    const targetCharacter = state.characters.find(
      (c) => c.id === this.targetId,
    );

    if (!sourceCharacter || !sourceCharacter.isAlive() || !targetCharacter) {
      return new GameStateUpdateResult(state, []);
    }

    let modifiedUpdate: CharacterUpdate = this;
    for (let effect of sourceCharacter.effects) {
      modifiedUpdate =
        effect.modifyOutgoingUpdate?.(this, sourceCharacter, state) ??
        modifiedUpdate;
    }

    for (let effect of targetCharacter.effects) {
      modifiedUpdate =
        effect.modifyIncomingUpdate?.(modifiedUpdate, targetCharacter, state) ??
        modifiedUpdate;
    }

    state = new GameState(
      state.characters.map((c) =>
        c.id === modifiedUpdate.targetId
          ? modifiedUpdate.applyToCharacter(c, state)
          : c,
      ),
      state.board,
      state.turn,
      state.affectedTiles,
      state.links,
    );

    const reactiveUpdates: CharacterUpdate[] = [];

    for (let effect of targetCharacter.effects) {
      const reactions = effect.onAfterUpdateApplied?.(
        modifiedUpdate,
        sourceCharacter,
        targetCharacter,
        state,
      );
      if (reactions?.length) reactiveUpdates.push(...reactions);
    }

    for (let effect of sourceCharacter.effects) {
      const reactions = effect.onAfterUpdateApplied?.(
        modifiedUpdate,
        sourceCharacter,
        targetCharacter,
        state,
      );
      if (reactions?.length) reactiveUpdates.push(...reactions);
    }

    const updatedState = new GameState(
      state.characters.map((c) =>
        c.id === this.targetId ? this.applyToCharacter(c, state) : c,
      ),
      state.board,
      state.turn,
      state.affectedTiles,
      state.links,
    );
    return new GameStateUpdateResult(updatedState, reactiveUpdates);
  }
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

  getPath(c: Character, s: GameState): Position[] {
    return this.calculatePath(c, s);
  }

  protected abstract calculatePath(c: Character, s: GameState): Position[];
  protected abstract resolveConflicts(
    start: Position,
    path: Position[],
    s: GameState,
  ): Position;
}
