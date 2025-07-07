import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DodgeEffect } from "../character-effects/dodge-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";

export class DodgeSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const effect = new DodgeEffect(source.id, 1, 3);

    const addEffect = new AddEffectUpdate(source.id, source.id, effect);
    return [addEffect];
  }
}
