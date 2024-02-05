import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { mutateData } from 'generator-jhipster/generators/base/support';
import { snakeCase } from 'lodash-es';
import command from './command.js';
import { createTenantAwareRelationship } from './support/index.js';

export default class extends BaseApplicationGenerator {
  async beforeQueue() {
    await this.dependsOnBootstrapAplication();
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseApplicationGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      async promptingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      async configuringTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      async loadingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      async preparingTemplateTask({ application }) {
        application.userTenant = true;
        application.tenantName = 'User';
        application.tenantLabel = 'login';
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      async configuringEachEntityTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      async preparingEachEntityTemplateTask({ application, entity }) {
        if (application.userTenant && entity.builtInUser) {
          entity.tenant = true;
        }

        mutateData(entity, {
          entityNameKebabCase: this._.kebabCase(entity.name),
          entityNameLowerCase: entity.name.toLowerCase(),
          entityNameUpperCase: snakeCase(entity.name).toUpperCase(),
          tenantAware: !entity.tenant && !entity.builtIn,
        });

        if (entity.tenant) {
          application.tenant = entity;

          mutateData(entity, {
            adminEntity: true,
          });
        } else if (entity.tenantAware) {
          const relationship = createTenantAwareRelationship(application.tenantName, application.tenantLabel);
          relationship.otherEntity = application.tenant;
          entity.relationships.push(relationship);
        }
      },
    });
  }
}
