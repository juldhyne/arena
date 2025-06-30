import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { TileEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class BurningFloorTileEffect extends TileEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("burningfloor", sourceId, turnsLeft);
  }

  onCharacterPass(character: Character, state: GameState): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 1)];
  }

  decrementTurnsLeft(): TileEffect {
    return new BurningFloorTileEffect(this.sourceId, this.turnsLeft - 1);
  }
}
