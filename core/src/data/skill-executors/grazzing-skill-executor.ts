import { Character } from "../../models/character";
import {
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { DodgeEffect } from "../character-effects/dodge-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { HealUpdate } from "../character-updates/heal-update";

export class GrazzingSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const HEAL = 3;
    const update = new HealUpdate(source.id, source.id, HEAL);

    return [update];
  }
}
