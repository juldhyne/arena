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
export class FangSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DAMAGES = 1;

    if (param.direction === undefined || param.direction === null) {
      return [];
    }

    const skillShot = new SkillShot(source.position, param.direction, 0, 1);
    const target = skillShot.findTarget(state);

    if (target) {
      const damages = new DamageUpdate(source.id, target.id, DAMAGES);
      return [damages];
    }
    return [];
  }
}
