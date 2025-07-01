import { Character } from "../../models/character";
import {
  Direction,
  getDistanceLeftInDirection,
  moveInDirection,
} from "../../models/direction";
import { GameState } from "../../models/game-state";
import { Position } from "../../models/position";

export class SkillShot {
  constructor(
    public readonly sourcePosition: Position,
    public readonly direction: Direction,
    public readonly minRange: number,
    public readonly maxRange?: number,
  ) {}

  /**
   * Finds the first character hit by the skillshot within the specified range.
   */
  findTarget(state: GameState): Character | null {
    let current = this.sourcePosition;

    const calculatedMaxRange = this.maxRange
      ? Math.min(
          getDistanceLeftInDirection(
            this.sourcePosition,
            this.direction,
            state.board,
          ),
          this.maxRange,
        )
      : getDistanceLeftInDirection(
          this.sourcePosition,
          this.direction,
          state.board,
        );

    for (let i = 1; i <= calculatedMaxRange; i++) {
      current = moveInDirection(
        this.sourcePosition,
        this.direction,
        i,
        state.board,
      );

      const character = state.characters.find(
        (c) =>
          c.position.x === current.x &&
          c.position.y === current.y &&
          c.isAlive(),
      );

      if (i >= this.minRange && character) {
        return character;
      }
    }

    return null;
  }

  /**
   * Returns the last tile the skillshot reaches.
   */
  getEndPosition(state: GameState): Position {
    const maxReachable = this.maxRange
      ? Math.min(
          getDistanceLeftInDirection(
            this.sourcePosition,
            this.direction,
            state.board,
          ),
          this.maxRange,
        )
      : getDistanceLeftInDirection(
          this.sourcePosition,
          this.direction,
          state.board,
        );

    return moveInDirection(
      this.sourcePosition,
      this.direction,
      maxReachable,
      state.board,
    );
  }
}
