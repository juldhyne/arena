import { Character } from "../../models/character";
import { CharacterUpdate } from "../../models/character-update";
import { Direction } from "../../models/direction";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";

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
    const dash = CharacterUpdate.dash(
      source.id,
      source.id,
      param.direction,
      DISTANCE,
    );

    return [dash];
  }
}
