import { Character } from "../../models/character";
import {
  AddTileEffectUpdate,
  CharacterUpdate,
  GameStateUpdate,
  RemoveTileEffectUpdate,
} from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";
import { SkillExecutor } from "../../models/skill-executor";
import { DamageUpdate } from "../character-updates/damage-update";
import { DiggedFloorTileEffect } from "../tile-effects/digged-floor-tile-effect";
import { AreaPattern, AreaPatternTile, AreaSkill } from "./area-pattern";
import { SkillShot } from "./skill-shot";

export class SwordSwingSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const CENTER_DAMAGE = 3;
    const EXTERNAL_DAMAGE = 1;

    const updates: GameStateUpdate[] = [];

    if (param.direction === undefined || param.direction === null) {
      return updates;
    }

    const areaSkill = new AreaSkill(
      this.getAreaPattern(CENTER_DAMAGE, EXTERNAL_DAMAGE, param.direction),
    );

    const damageUpdates = areaSkill.getUpdates(source, state, param.position);

    updates.push(...damageUpdates);

    return updates;
  }

  private getAreaPattern(
    centerDamage: number,
    externalDamage: number,
    direction: Direction,
  ): AreaPattern {
    const tiles: AreaPatternTile[] = [];

    // Always includes center tile
    tiles.push(
      new AreaPatternTile(0, 0, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, centerDamage) : null,
      ),
    );

    // Determine side offsets based on direction
    if (direction === Direction.NORTH || direction === Direction.SOUTH) {
      tiles.push(
        new AreaPatternTile(-1, 0, (source, target) =>
          target
            ? new DamageUpdate(source.id, target.id, externalDamage)
            : null,
        ),
        new AreaPatternTile(1, 0, (source, target) =>
          target
            ? new DamageUpdate(source.id, target.id, externalDamage)
            : null,
        ),
      );
    } else if (direction === Direction.EAST || direction === Direction.WEST) {
      tiles.push(
        new AreaPatternTile(0, -1, (source, target) =>
          target
            ? new DamageUpdate(source.id, target.id, externalDamage)
            : null,
        ),
        new AreaPatternTile(0, 1, (source, target) =>
          target
            ? new DamageUpdate(source.id, target.id, externalDamage)
            : null,
        ),
      );
    }

    return new AreaPattern(tiles);
  }
}
