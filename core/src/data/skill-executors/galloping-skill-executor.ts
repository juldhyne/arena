import { Character } from "../../models/character";
import {
  AddLinkUpdate,
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { HorseRiderLink } from "../../models/link";
import { SkillExecutor } from "../../models/skill-executor";
import { DashUpdate } from "../character-updates/dash-update";
import { GallopingDashUpdate } from "../character-updates/galloping-dash-update";

export class GallopingSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    if (param.direction === undefined || param.direction === null) {
      return [];
    }

    const dash = new GallopingDashUpdate(source.id, source.id, param.direction);
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
      const link = new AddLinkUpdate(
        new HorseRiderLink(source.id, firstCharacter.id),
      );
      return [link, dash];
    }
    return [dash];
  }
}
