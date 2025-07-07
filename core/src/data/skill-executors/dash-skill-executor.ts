import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DashUpdate } from "../character-updates/dash-update";

export class DashSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const DISTANCE = 3;

    if (param.direction === undefined || param.direction === null) {
      return [];
    }

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
