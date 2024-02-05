import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { javaMainResourceTemplatesBlock } from 'generator-jhipster/generators/java/support';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  async beforeQueue() {
    await this.dependsOnJHipster('jhipster-tenantview:tenantview');
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writingEntitiesTemplateTask({ application, entities }) {
        if (application.user.tenant) return;
        await this.writeFiles({
          blocks: [
            javaMainResourceTemplatesBlock({
              renameTo: (data, filename) =>
                filename
                  .replace('_changelogDate_', data.tenant.changelogDate)
                  .replace('_tenantSnakeCase_', data.tenant.entityNameSnakeCase),
              templates: [
                'config/liquibase/changelog/_changelogDate_-1__tenantSnakeCase__user_column.xml',
                'config/liquibase/changelog/_changelogDate_-2__tenantSnakeCase__user_data.xml',
                'config/liquibase/changelog/_changelogDate_-3__tenantSnakeCase__user_constraints.xml',
              ],
            }),
          ],
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      async postWritingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      async postWritingEntitiesTemplateTask() {},
    });
  }
}
