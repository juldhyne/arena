import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DashUpdate } from "../character-updates/dash-update";
import { SkillShot } from "./skill-shot";

export class FightSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): CharacterUpdate[] {
    const DISTANCE = 5;

    if (param.direction === undefined || param.direction === null) {
      return [];
    }

    const skillShot = new SkillShot(source.position, param.direction, 0, 5);
    const target = skillShot.findTarget(state);

    const dash = new DashUpdate(
      source.id,
      source.id,
      param.direction,
      DISTANCE,
      true,
    );

    return [dash];
  }
}
