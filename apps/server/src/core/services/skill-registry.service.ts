import { FightSkillExecutor } from '../data/skill-executors/fight-skill-executor';
import { SkillExecutor } from '../models/skill-executor';

export class SkillRegistryService {
  private registry = new Map<string, SkillExecutor>();

  constructor() {
    this.register('fight', new FightSkillExecutor());
  }

  register(skillId: string, executor: SkillExecutor) {
    this.registry.set(skillId, executor);
  }

  getExecutor(skillId: string): SkillExecutor | undefined {
    return this.registry.get(skillId);
  }
}
