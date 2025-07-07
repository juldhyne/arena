import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction, getOppositeDirection } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { BadEffect } from "../character-effects/bad-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { DashUpdate } from "../character-updates/dash-update";
import { PointAndClick } from "./point-and-click";

export class CheeringSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DISTANCE = 1;

    if (param.position === undefined || param.position === null) {
      return [];
    }

    const pac = new PointAndClick(param.position);
    const target = pac.findTarget(state);

    if (target) {
      const dash = new DashUpdate(
        source.id,
        target.id,
        target.teamId == source.teamId
          ? source.direction
          : getOppositeDirection(source.direction),
        DISTANCE,
        true,
      );

      return [dash];
    }
    return [];
  }
}
