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

export class HorseRiderLink extends Link {
  constructor(
    public readonly horseId: string,
    public readonly riderId: string,
  ) {
    super("horseRide", horseId, riderId);
  }

  onUpdate(update: CharacterUpdate, state: GameState): GameStateUpdate[] {
    // Rider follows the horse
    if (
      update.sourceId === this.horseId &&
      update.targetId === this.horseId &&
      update instanceof GallopingDashUpdate
    ) {
      const newUpdate = new GallopingDashUpdate(
        update.sourceId,
        this.riderId,
        update.direction,
      );
      return [update, newUpdate];
    }
    // Horse takes damages for the rider
    if (update.targetId === this.riderId && update instanceof DamageUpdate) {
      const newUpdate = new DamageUpdate(
        update.sourceId,
        this.horseId,
        update.amount,
      );
      return [newUpdate];
    }
    // Rider moving on its own breaks the link
    if (update.targetId === this.riderId && update instanceof PositionUpdate) {
      const newUpdate = new RemoveLinkUpdate(this);
      return [newUpdate, update];
    }
    return [update];
  }
}
