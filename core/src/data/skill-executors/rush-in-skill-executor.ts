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

export class RushInSkillExecutor extends SkillExecutor {
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
    const charactersCrossedInfo: {
      character: Character;
      distancePushed: number;
    }[] = [];

    let tilesCrossed = 0;
    let charactersCrossed = 0;
    for (const pos of path) {
      const character = state.characters.find(
        (c) => c.position.x === pos.x && c.position.y === pos.y,
      );
      if (character) {
        charactersCrossedInfo.push({
          character: character,
          distancePushed: DISTANCE - tilesCrossed + charactersCrossed,
        });
        charactersCrossed++;
      }
      tilesCrossed++;
    }

    const pushedCharacterUpdates: GameStateUpdate[] = [];
    for (const characterCrossedInfo of charactersCrossedInfo) {
      pushedCharacterUpdates.push(
        new DashUpdate(
          characterCrossedInfo.character.id,
          source.id,
          param.direction,
          characterCrossedInfo.distancePushed,
        ),
      );
    }

    return [dash, ...pushedCharacterUpdates];
  }
}
