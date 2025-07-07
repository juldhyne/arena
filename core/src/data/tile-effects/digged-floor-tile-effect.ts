import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { TileEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class DiggedFloorTileEffect extends TileEffect {
  constructor(
    sourceId: string,
    public readonly order: number,
    turnsLeft: number = 3,
  ) {
    super("diggedfloor", sourceId, turnsLeft);
  }

  onCharacterPass(character: Character, state: GameState): CharacterUpdate[] {
    return [];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [];
  }

  decrementTurnsLeft(): TileEffect {
    return new DiggedFloorTileEffect(this.sourceId, this.turnsLeft - 1);
  }
}
