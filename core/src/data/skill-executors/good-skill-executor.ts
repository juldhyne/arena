import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { GoodEffect } from "../character-effects/good-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { PointAndClick } from "./point-and-click";

export class GoodSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    if (param.position === undefined || param.position === null) {
      return [];
    }

    const pac = new PointAndClick(param.position);
    const target = pac.findTarget(state);

    if (target) {
      const effect = new GoodEffect(source.id);

      const addEffect = new AddEffectUpdate(source.id, target.id, effect);
      return [addEffect];
    }

    return [];
  }
}
