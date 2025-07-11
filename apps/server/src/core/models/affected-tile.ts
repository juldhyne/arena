import { TileEffect } from "./effect";
import { Position } from "./position";

export class AffectedTile {
  constructor(
    public readonly position: Position,
    public readonly effects: TileEffect[],
  ) {}

  decrementEffects(): AffectedTile {
    const effects = this.effects
      .map((e) => e.decrementTurnsLeft())
      .filter((e) => e.turnsLeft > 0);
    return this.copyWith({ effects: effects });
  }

  private copyWith(params: { effects?: TileEffect[] }): AffectedTile {
    return new AffectedTile(
      this.position,

      params.effects ?? this.effects,
    );
  }
}
