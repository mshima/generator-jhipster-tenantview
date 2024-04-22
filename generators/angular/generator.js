import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { clientSrcTemplatesBlock } from 'generator-jhipster/generators/client/support';
import { patcherTask } from '../tenantview/support/index.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  async beforeQueue() {
    await this.dependsOnJHipster('jhipster-tenantview:tenantview');
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          blocks: [
            clientSrcTemplatesBlock({
              templates: ['app/core/auth/current-tenant.service.ts'],
            }),
          ],
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writingEntitiesTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      async postWritingTemplateTask({ application }) {
        await patcherTask(this, application);
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      async postWritingEntitiesTemplateTask({ application, entities }) {
        for (const entity of entities.filter(entity => !entity.skipClient || entity.builtInUserManagement)) {
          await patcherTask(this, { ...application, ...entity }, { options: { autoLoadPath: 'patcher-entities' } });
        }
      },
    });
  }
}
