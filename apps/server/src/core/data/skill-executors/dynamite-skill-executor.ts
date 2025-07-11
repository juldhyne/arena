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

export class DynamiteSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const CENTER_DAMAGE = 2;
    const EXTERNAL_DAMAGE = 1;

    const updates: GameStateUpdate[] = [];

    if (param.position === undefined || param.position === null) {
      return updates;
    }

    const areaSkill = new AreaSkill(
      this.getAreaPattern(CENTER_DAMAGE, EXTERNAL_DAMAGE),
    );

    const damageUpdates = areaSkill.getUpdates(source, state, param.position);

    updates.push(...damageUpdates);

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
    updates.push(new AddTileEffectUpdate(param.position, newEffect));

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

  private getAreaPattern(
    centerDamage: number,
    externalDamage: number,
  ): AreaPattern {
    return new AreaPattern([
      new AreaPatternTile(0, 0, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, centerDamage) : null,
      ),
      new AreaPatternTile(0, 1, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, externalDamage) : null,
      ),
      new AreaPatternTile(0, -1, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, externalDamage) : null,
      ),
      new AreaPatternTile(1, 0, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, externalDamage) : null,
      ),
      new AreaPatternTile(-1, 0, (source, target) =>
        target ? new DamageUpdate(source.id, target.id, externalDamage) : null,
      ),
    ]);
  }
}
