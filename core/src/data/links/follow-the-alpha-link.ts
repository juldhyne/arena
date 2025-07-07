import {
  CharacterUpdate,
  GameStateUpdate,
  PositionUpdate,
  RemoveLinkUpdate,
} from "../../models/character-update";
import { GameState } from "../../models/game-state";
import { Link } from "../../models/link";
import { DamageUpdate } from "../character-updates/damage-update";
import { GallopingDashUpdate } from "../character-updates/galloping-dash-update";
import { FangSkillExecutor } from "../skill-executors/fang-skill-executor";

export class FollowTheAlphaLink extends Link {
  constructor(public readonly alphaId: string, public readonly betaId: string) {
    super("followTheAlpha", alphaId, betaId);
  }

  onUpdate(update: CharacterUpdate, state: GameState): GameStateUpdate[] {
    // Execute SkillExecutor for each invoke
    if (update.sourceId === this.alphaId && update instanceof DamageUpdate) {
      const executor = new FangSkillExecutor();
      const source = state.characters.find((c) => c.id == this.betaId);

      return [update];
    }
    // Execute SkillExecutor for each invokejh
    if (update.sourceId === this.alphaId && update instanceof PositionUpdate) {
      return [update];
    }

    return [update];
  }
}
