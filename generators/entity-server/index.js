/* eslint-disable consistent-return */
const chalk = require('chalk');
const debug = require('debug')('tenantview:entity:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

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
        debug(`addEntityToTenantAspect ${tenantAwareEntity}`);
        const errorMessage = `${chalk.yellow('Reference to ') + tenantAwareEntity} ${chalk.yellow('not added.\n')}`;
        // eslint-disable-next-line prettier/prettier
            const tenantAspectPath = `${SERVER_MAIN_SRC_DIR}${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/${generator.tenantNameUpperFirst}Aspect.java`;
        const content = `+ "|| execution(* ${generator.packageName}.service.${tenantAwareEntity}Service.*(..))"`;
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
        debug(`Initializing ${generator} ${options.context.name}`);
        super(args, options);
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;
      }

      get initializing() {
        return super._initializing();
      }

      get prompting() {
        return super._prompting();
      }

      get configuring() {
        return super._configuring();
      }

      get default() {
        return super._default();
      }

      get writing() {
        return {
          ...super._writing(),

          // Sets up all the variables we'll need for the templating
          setUpVariables() {
            this.SERVER_MAIN_SRC_DIR = this.constants.SERVER_MAIN_SRC_DIR;
          },
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

      get end() {
        return super._end();
      }
    };
  }
};
