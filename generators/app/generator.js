import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import command from './command.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {},
    });
  }
}
