/* eslint-disable consistent-return */
const chalk = require('chalk');
const debug = require('debug')('tenantview:entity:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');
const JHipsterEntity = require('generator-jhipster-customizer/lib/jhipster-entity');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const generator = 'entity-server';

module.exports = {
  createGenerator: env => {
    const packagePath = env.getPackagePath('jhipster:app');
    // eslint-disable-next-line global-require
    const needleServer = require(`${packagePath}/generators/server/needle-api/needle-server`);
    // eslint-disable-next-line global-require
    const constants = require(`${packagePath}/generators/generator-constants`);

    const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

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
      applyPatcher: true,
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        super(args, options);

        const entityName = this._.upperFirst(args[0]);
        debug(`Initializing ${generator} ${entityName}`);
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;

        // Set side-by-side blueprint
        this.sbsBlueprint = true;

        this.entityConfig = this.createStorage(`.jhipster/${entityName}.json`);
        this.entityConfig.set('name', entityName);

        this.entity = this.jhipsterFs.getEntity(entityName);
      }

      get writing() {
        return {
          tenant() {
            const tenantName = this.blueprintConfig.get('tenantName');
            this.tenant = this.jhipsterFs.getEntity(tenantName);
          },

          /* Tenant variables */
          setupTenantVariables,

          // Make the necessary server code changes
          customServerCode() {
            const tenantisedNeedle = new TenantisedNeedle(this);
            if (this.tenantAware) {
              tenantisedNeedle.addEntityToTenantAspect(this, this.name);
            } else if (this.isTenant) {
              this.addConstraintsChangelogToLiquibase(`${this.entity.changelogDate}-1__user_${this.tenant.entityClass}_constraints`);
              this.addConstraintsChangelogToLiquibase(`${this.entity.changelogDate}-2__${this.tenant.entityLowerCase}_user_data`);

              debug('Adding already tenantised entities');
              if (this.configOptions.tenantAwareEntities) {
                this.queueMethod(
                  function () {
                    // Run after patcher
                    this.configOptions.tenantAwareEntities.forEach(tenantAwareEntity => {
                      debug(`Adding entity ${tenantAwareEntity}`);
                      tenantisedNeedle.addEntityToTenantAspect(this, tenantAwareEntity);
                    });
                  },
                  'tenantisedNeedle',
                  'writing'
                );
              }
            }
          }
        };
      }

      _templateData() {
        return {
          entity: this.entity,
          tenant: this.tenant
        };
      }
    };
  }
};
