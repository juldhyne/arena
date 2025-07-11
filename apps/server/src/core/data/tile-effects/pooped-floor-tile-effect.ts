import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { TileEffect } from "../../models/effect";
import { GameState } from "../../models/game-state";
import { DamageUpdate } from "../character-updates/damage-update";

export class PoopedFloorTileEffect extends TileEffect {
  constructor(sourceId: string, turnsLeft: number = 3) {
    super("poopedfloor", sourceId, turnsLeft);
  }

  onCharacterPass(character: Character, state: GameState): CharacterUpdate[] {
    return [new DamageUpdate(this.sourceId, character.id, 2)];
  }

  onTurnEnd(character: Character): CharacterUpdate[] {
    return [];
  }

  decrementTurnsLeft(): TileEffect {
    return new PoopedFloorTileEffect(this.sourceId, this.turnsLeft - 1);
  }
}
