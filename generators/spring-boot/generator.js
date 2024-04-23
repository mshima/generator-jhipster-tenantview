import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { javaMainPackageTemplatesBlock, javaTestPackageTemplatesBlock } from 'generator-jhipster/generators/java/support';
import { patcherTask } from '../tenantview/support/index.js';

const renameTenantNames = (data, file) =>
  file.replace(/_tenantLowerCase_/g, data.tenantEntity.entityNameLowerCase).replace(/_tenantClass_/g, data.tenantEntity.entityClass);
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
            javaMainPackageTemplatesBlock({
              renameTo: renameTenantNames,
              templates: [
                'config/_tenantLowerCase_/_tenantClass_AwareSessionConfiguration.java',
                'config/_tenantLowerCase_/TenantIdentifier.java',
                'domain/Abstract_tenantClass_Aware.java',
              ],
            }),
            javaMainPackageTemplatesBlock({
              renameTo: renameTenantNames,
              condition: data => !data.tenantEntity.builtInUser,
              templates: ['security/TenantUtils.java'],
            }),
            javaTestPackageTemplatesBlock({
              renameTo: renameTenantNames,
              templates: ['config/_tenantLowerCase_/_tenantClass_AwareSessionTestConfiguration.java', 'TenantIntegrationTestUtils.java'],
            }),
          ],
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writingEntitiesTemplateTask({ application, entities }) {
        for (const entity of entities.filter(entity => !entity.builtInUserManagement && !entity.builtInAuthority)) {
          await this.writeFiles({
            blocks: [
              javaMainPackageTemplatesBlock({
                renameTo: renameTenantNames,
                condition: data => data.tenant,
                templates: ['aop/_tenantLowerCase_/_tenantClass_AwareAspect.java'],
              }),
              javaMainPackageTemplatesBlock({
                renameTo: renameTenantNames,
                condition: data => data.tenantAware || (!data.tenantEntity.builtInUser && data.builtInUser),
                templates: ['aop/_tenantLowerCase_/_tenantClass_Aware_entityClass_Aspect.java'],
              }),
            ],
            context: { ...application, ...entity },
          });
        }
      },
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
        for (const entity of entities) {
          await patcherTask(this, { ...application, ...entity }, { options: { autoLoadPath: 'patcher-entities' } });
        }
      },
    });
  }
}
