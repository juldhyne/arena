import { Character } from "./character";
import { CharacterUpdate } from "./character-update";
import { GameState } from "./game-state";

export abstract class Effect {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly turnsLeft: number,
  ) {}

  abstract decrementTurnsLeft(): Effect;

  onTurnEnd?(target: Character, state: GameState): CharacterUpdate[];
}

export abstract class CharacterEffect extends Effect {
  abstract modifyOutgoingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract modifyIncomingUpdate(
    update: CharacterUpdate,
    character: Character,
    state: GameState,
  ): CharacterUpdate;

  abstract onAfterUpdateApplied(
    update: CharacterUpdate,
    source: Character,
    target: Character,
    state: GameState,
  ): CharacterUpdate[];

  abstract override decrementTurnsLeft(): CharacterEffect;
}

export abstract class TileEffect extends Effect {
  // Called when a character enters or passes over a tile
  abstract onCharacterPass(
    character: Character,
    state: GameState,
  ): CharacterUpdate[];

  abstract override decrementTurnsLeft(): TileEffect;
}
