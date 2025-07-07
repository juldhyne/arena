import { Character } from "../../models/character";
import {
  GameStateUpdate,
  AddTileEffectUpdate,
  RemoveTileEffectUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";
import { SkillExecutor } from "../../models/skill-executor";
import { DamageUpdate } from "../character-updates/damage-update";
import { DiggedFloorTileEffect } from "../tile-effects/digged-floor-tile-effect";
import { SkillShot } from "./skill-shot";

export class PickAxeHitSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DAMAGES = 3;

    if (param.direction === undefined || param.direction === null) {
      return [];
    }

    const skillShot = new SkillShot(source.position, param.direction, 0, 1);
    const target = skillShot.findTarget(state);

    if (target) {
      return [new DamageUpdate(source.id, target.id, DAMAGES)];
    }

    const position = skillShot.getEndPosition(state);

    // 1. Gather all DiggedFloorTileEffects from affected tiles
    const diggedEffects: {
      effect: DiggedFloorTileEffect;
      position: Position;
    }[] = [];

    for (const tile of state.affectedTiles) {
      for (const effect of tile.effects) {
        if (effect instanceof DiggedFloorTileEffect) {
          diggedEffects.push({ effect, position: tile.position });
        }
      }
    }

    // 2. Determine the new order
    const maxOrder =
      diggedEffects.length > 0
        ? Math.max(...diggedEffects.map((e) => e.effect.order))
        : 0;
    const newOrder = maxOrder + 1;

    const newEffect = new DiggedFloorTileEffect(source.id, newOrder);
    const updates: GameStateUpdate[] = [
      new AddTileEffectUpdate(position, newEffect),
    ];

    // 3. If already 2 digged tiles, remove the one with the lowest order
    if (diggedEffects.length >= 2) {
      const toRemove = diggedEffects.reduce((lowest, current) =>
        current.effect.order < lowest.effect.order ? current : lowest,
      );

      updates.push(
        new RemoveTileEffectUpdate(toRemove.position, toRemove.effect.id),
      );
    }

    return updates;
  }
}
