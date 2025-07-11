import { Character } from "../../models/character";
import {
  AddTileEffectUpdate,
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { SkillExecutor } from "../../models/skill-executor";
import { BadEffect } from "../character-effects/bad-effect";
import { DodgeEffect } from "../character-effects/dodge-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { PoopedFloorTileEffect } from "../tile-effects/pooped-floor-tile-effect";
import { PointAndClick } from "./point-and-click";

export class PoopingSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const newEffect = new PoopedFloorTileEffect(source.id);
    const update = new AddTileEffectUpdate(source.position, newEffect);
    return [update];
  }
}
