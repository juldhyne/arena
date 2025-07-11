import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction, getOppositeDirection } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DamageUpdate } from "../character-updates/damage-update";
import { DashUpdate } from "../character-updates/dash-update";
import { SkillShot } from "./skill-shot";

export class HoofKickSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DAMAGE = 2;

    const skillShot = new SkillShot(
      source.position,
      getOppositeDirection(source.direction),
      0,
      1,
    );
    const target = skillShot.findTarget(state);

    if (target) {
      const damages = new DamageUpdate(source.id, target.id, DAMAGE);
      return [damages];
    }
    return [];
  }
}
