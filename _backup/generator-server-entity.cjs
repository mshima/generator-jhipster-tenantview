const chalk = require('chalk');
const debug = require('debug')('tenantview:entity:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const generator = 'entity-server';

module.exports = {
  createGenerator: env => {
    const packagePath = env.getPackagePath('jhipster:app');
    const needleServer = require(`${packagePath}/generators/server/needle-api/needle-server`);

    const TenantisedNeedle = class extends needleServer {
      addEntityToTenantAspect(generator, tenantAwareEntity) {
        const packageFolder = generator.config.get('packageFolder');
        const packageName = generator.config.get('packageName');
        debug(`addEntityToTenantAspect ${tenantAwareEntity}`);
        const errorMessage = `${chalk.yellow('Reference to ') + tenantAwareEntity} ${chalk.yellow('not added.\n')}`;
        // eslint-disable-next-line prettier/prettier
        const tenantAspectPath = `${generator.constants.SERVER_MAIN_SRC_DIR}${packageFolder}/aop/${generator.tenant.entityInstance}/${generator.tenant.entityClass}Aspect.java`;
        const content = `+ "|| execution(* ${packageName}.service.${tenantAwareEntity}Service.*(..))"`;
        const rewriteFileModel = this.generateFileModel(tenantAspectPath, 'jhipster-needle-add-entity-to-tenant-aspect', content);
        this.addBlockContentToFile(rewriteFileModel, errorMessage);
      }
    };

    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher'),
    }) {
      constructor(args, options) {
        super(args, options);

        this.entityName = this._.upperFirst(args[0] || options.context.name);
        if (!this.entityName) {
          throw new Error(`Entity name is required for ${generator}`);
        }

        debug(`Initializing ${generator} ${this.entityName}`);
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;

        // Set side-by-side blueprint
        this.sbsBlueprint = true;

        this.entityConfig = this.createStorage(`.jhipster/${this.entityName}.json`);
        this.entityConfig.set('name', this.entityName);

        this.entity = this.jhipsterFs.getEntity(this.entityName);

        const tenantName = this.blueprintConfig.get('tenantName');
        if (!tenantName) {
          throw new Error(`Tenant name is required for ${generator}`);
        }

        this.tenant = this.jhipsterFs.getEntity(tenantName);
        this.tenant = this.entityName === tenantName;
      }

      get writing() {
        return {
          // Make the necessary server code changes
          customServerCode() {
            if (this.tenant) {
              this.addConstraintsChangelogToLiquibase(`${this.tenant.changelogDate}-1__user_${this.tenant.entityClass}`);
              this.addConstraintsChangelogToLiquibase(`${this.tenant.changelogDate}-2__${this.tenant.entityNameLowerCase}_user_data`);
              this.addConstraintsChangelogToLiquibase(`${this.tenant.changelogDate}-3__user_${this.tenant.entityClass}_constraints`);
            }
          },
        };
      }

      get patching() {
        return {
          tenantAspect() {
            if (this.entity.definitions.tenantAware) {
              const tenantisedNeedle = new TenantisedNeedle(this);
              tenantisedNeedle.addEntityToTenantAspect(this, this.name);
            }
          },
        };
      }

      _templateData() {
        return {
          ...super._templateData(),
          tenant: this.tenant,
          entity: this.entity,
          tenant: this.tenant,
        };
      }
    };
  },
};
