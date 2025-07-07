import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DamageUpdate } from "../character-updates/damage-update";
import { SkillShot } from "./skill-shot";

export class SideArrowSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DAMAGES = 3;

    if (
      param.direction === undefined ||
      param.direction === null ||
      [
        Direction.NORTH,
        Direction.WEST,
        Direction.EAST,
        Direction.SOUTH,
      ].includes(param.direction)
    ) {
      return [];
    }

    const skillShot = new SkillShot(source.position, param.direction, 0);
    const target = skillShot.findTarget(state);

    if (target) {
      const damages = new DamageUpdate(source.id, target.id, DAMAGES);
      return [damages];
    }
    return [];
  }
}
