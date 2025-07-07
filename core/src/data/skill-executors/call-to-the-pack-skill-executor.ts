import { Character } from "../../models/character";
import {
  AddInvokeUpdate,
  AddLinkUpdate,
  CharacterUpdate,
  GameStateUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Link } from "../../models/link";
import { SkillExecutor } from "../../models/skill-executor";
import { BadEffect } from "../character-effects/bad-effect";
import { DodgeEffect } from "../character-effects/dodge-effect";
import { AddEffectUpdate } from "../character-updates/add-effect-update";
import { FollowTheAlphaLink } from "../links/follow-the-alpha-link";
import { PointAndClick } from "./point-and-click";

export class CallToThePackSkillExecutor extends SkillExecutor {
  execute(
    source: Character,
    state: GameState,
    param: Record<string, any>,
  ): GameStateUpdate[] {
    const invoke = new Character(
      "invoke",
      source.teamId,
      3,
      3,
      8,
      { x: 1, y: 3 },
      source.direction,
    );

    const update = new AddInvokeUpdate(invoke);

    const link = new FollowTheAlphaLink(source.id, invoke.id);

    const linkUpdate = new AddLinkUpdate(link);
    return [update, linkUpdate];
  }
}
