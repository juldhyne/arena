import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import {
  Direction,
  getDistanceBetweenPositions,
  getOppositeDirection,
} from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { BadEffect } from "../character-effects/bad-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { DashUpdate } from "../character-updates/dash-update";
import { PointAndClick } from "./point-and-click";

export class PushBackSkillExecutor extends SkillExecutor {
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
    );

    const path = dash.getPath(source, state);

    let firstCharacter: Character | undefined;
    for (const pos of path) {
      firstCharacter = state.characters.find(
        (c) => c.position.x === pos.x && c.position.y === pos.y,
      );
      if (firstCharacter) {
        break;
      }
    }

    if (firstCharacter) {
      const distance = getDistanceBetweenPositions(
        source.position,
        firstCharacter.position,
      );
      const updatedSourceDash = new DashUpdate(
        source.id,
        source.id,
        param.direction,
        distance,
      );
      const firstCharacterDash = new DashUpdate(
        source.id,
        source.id,
        param.direction,
        DISTANCE,
      );
      return [updatedSourceDash, firstCharacterDash];
    } else {
      return [dash];
    }
  }
}
