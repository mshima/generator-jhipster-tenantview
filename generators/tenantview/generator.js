import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { mutateData } from 'generator-jhipster/generators/base/support';
import { lowerFirst, snakeCase } from 'lodash-es';
import { createTenantAwareRelationship } from './support/index.js';

export default class extends BaseApplicationGenerator {
  async beforeQueue() {
    await this.dependsOnBootstrapApplication();
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        await this.parseCurrentJHipsterCommand();
      },
    });
  }

  get [BaseApplicationGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      async promptingTemplateTask() {
        await this.promptCurrentJHipsterCommand();
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      skipJHipsterDependencies() {
        this.jhipsterConfig.skipJHipsterDependencies = true;
      },
      async configuringTemplateTask() {
        const tenants = this.getExistingEntities().filter(entity => entity.definition.annotations?.tenant);
        if (tenants.length > 1) {
          throw new Error('Only one tenant entity is allowed');
        }
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      async configuringEachEntityTemplateTask({ entityConfig }) {
        if (entityConfig.annotations?.tenant) {
          entityConfig.annotations = {
            adminEntity: true,
            ...entityConfig.annotations,
          };
        }
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asPromptingTaskGroup({
      async promptingTemplateTask({ application }) {
        await this.loadCurrentJHipsterCommandConfig(application);
      },
    });
  }

  get [BaseApplicationGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      async loadingEntitiesTemplateTask({ application, entitiesToLoad }) {
        const tenantToLoad = entitiesToLoad.find(entity => entity.entityBootstrap.annotations?.tenant);
        const tenant = tenantToLoad?.entityBootstrap ?? application.user;
        tenant.tenant = true;
        application.tenantEntity = tenant;

        application.tenantLabel = tenant.annotations?.tenantLabel ?? tenant.builtInUser ? 'login' : 'id';
        application.tenantRelationshipName = tenant.annotations?.tenantRelationshipName ?? lowerFirst(tenant.name);

        if (!tenant.builtInUser) {
          mutateData(tenant, {
            clientRootFolder: 'admin',
            entityAuthority: 'ROLE_ROOT_ADMIN',
          });
        }

        for (const entityToLoad of entitiesToLoad) {
          const entity = entityToLoad.entityBootstrap;
          if (!tenant.builtInUser && entity.builtInAuthority) {
            entity.entityAuthority = 'ROLE_ROOT_ADMIN';
            entity.entityReadAuthority = 'ROLE_ROOT_USER,ROLE_ADMIN';
          }
        }
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      async preparingEachEntityTemplateTask({ application, entity, entityName }) {
        mutateData(entity, {
          entityNameKebabCase: this._.kebabCase(entityName),
          entityNameLowerCase: entityName.toLowerCase(),
          entityNameUpperCase: snakeCase(entityName).toUpperCase(),
          tenantAware: !entity.tenant && !entity.builtIn,
          builtInUser: false,
        });

        if (entity.tenantAware) {
          const relationship = createTenantAwareRelationship(
            application.tenantEntity.name,
            application.tenantLabel,
            application.tenantRelationshipName,
          );
          relationship.otherEntity = application.tenantEntity;
          entity.relationships.push(relationship);
        }
      },
    });
  }
}
