import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DamageUpdate } from "../character-updates/damage-update";
import { TeleportationUpdate } from "../character-updates/teleportation-update";
import { DiggedFloorTileEffect } from "../tile-effects/digged-floor-tile-effect";
import { SkillShot } from "./skill-shot";
export class DigSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    if (param.direction === undefined || param.direction === null) {
      return [];
    }

    const skillShot = new SkillShot(source.position, param.direction, 0, 1);
    const target = skillShot.findTarget(state);

    if (target) {
      return [];
    }

    const position = skillShot.getEndPosition(state);

    const affectedTile = state.affectedTiles.find(
      (tile) =>
        tile.position.x === position.x && tile.position.y === position.y,
    );

    const hasDiggedEffect = affectedTile?.effects.some(
      (e) => e instanceof DiggedFloorTileEffect,
    );

    if (!hasDiggedEffect) {
      return [];
    }

    const allOtherDiggedTiles = state.affectedTiles.filter(
      (tile) =>
        !(tile.position.x === position.x && tile.position.y === position.y) &&
        tile.effects.some((e) => e instanceof DiggedFloorTileEffect),
    );

    if (allOtherDiggedTiles.length === 0) {
      return [];
    }

    const destination = allOtherDiggedTiles[0].position;

    return [new TeleportationUpdate(source.id, source.id, destination)];
  }
}
