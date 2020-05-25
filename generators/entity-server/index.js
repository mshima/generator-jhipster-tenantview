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
        const packageName = generator.config.get('packageName');
        debug(`addEntityToTenantAspect ${tenantAwareEntity}`);
        const errorMessage = `${chalk.yellow('Reference to ') + tenantAwareEntity} ${chalk.yellow('not added.\n')}`;
        // eslint-disable-next-line prettier/prettier
            const tenantAspectPath = `${generator.constants.SERVER_MAIN_SRC_DIR}${packageFolder}/aop/${generator.tenantNameLowerFirst}/${generator.tenantNameUpperFirst}Aspect.java`;
        const content = `+ "|| execution(* ${generator.constants.packageName}.service.${tenantAwareEntity}Service.*(..))"`;
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
      }

      get writing() {
        return {
          /* Tenant variables */
          setupTenantVariables,

          // Make the necessary server code changes
          customServerCode() {
            const tenantisedNeedle = new TenantisedNeedle(this);
            if (this.tenantAware) {
              tenantisedNeedle.addEntityToTenantAspect(this, this.name);
            } else if (this.isTenant) {
              this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-1__user_${this.tenantNameUpperFirst}_constraints`);
              this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-2__${this.tenantNameLowerCase}_user_data`);

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
        const entity = new JHipsterEntity(this.entityConfig.getAll(), this);
        console.log(this.entityConfig);
        console.log(this.entityConfig.getAll());
        const {entityClass, entityInstance, entityInstancePlural} = entity;
        console.log({entityClass, entityInstance, entityInstancePlural});
        return {
          ...this.config.getAll(),
          ...setupTenantVariables.call(this),
          ...this.entityConfig.getAll(),
          entity,
          entityClass,
          entityInstance,
          entityInstancePlural
        };
      }
    };
  }
};
