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
        for (const entity of entities) {
          if (entity.tenant && !entity.builtInUser) {
            await this.writeFiles({
              blocks: [
                javaMainResourceTemplatesBlock({
                  relativePath: 'config/liquibase/',
                  renameTo: (data, filename) =>
                    filename
                      .replaceAll('_changelogDate_', data.changelogDate)
                      .replaceAll('_tenantSnakeCase_', data.entityNameLowerCase)
                      .replaceAll('_entityNameLowerCase_', data.entityNameLowerCase),
                  templates: [
                    'changelog/_changelogDate_-1-_tenantSnakeCase_-user-column.xml',
                    'changelog/_changelogDate_-2-_tenantSnakeCase_-user-data.xml',
                    'changelog/_changelogDate_-3-_tenantSnakeCase_-user-constraints.xml',
                    'data/_entityNameLowerCase_/_entityNameLowerCase_-others.csv',
                    'data/_entityNameLowerCase_/_entityNameLowerCase_-root.csv',
                    'data/_entityNameLowerCase_/user-authority.csv',
                    'data/_entityNameLowerCase_/user-relationship.csv',
                    'data/_entityNameLowerCase_/user.csv',
                  ],
                }),
              ],
              context: { ...application, ...entity },
            });
          }
        }
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
      async postWritingEntitiesTemplateTask({ source, entities }) {
        for (const entity of entities) {
          if (entity.tenant && !entity.builtInUser) {
            source.addLiquibaseConstraintsChangelog({
              changelogName: `${entity.changelogDate}-1-${entity.entityNameLowerCase}-user-column`,
            });
            source.addLiquibaseConstraintsChangelog({ changelogName: `${entity.changelogDate}-2-${entity.entityNameLowerCase}-user-data` });
            source.addLiquibaseConstraintsChangelog({
              changelogName: `${entity.changelogDate}-3-${entity.entityNameLowerCase}-user-constraints`,
            });
          }
        }
      },
    });
  }
}
