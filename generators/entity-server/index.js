/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const generator = 'entity-server';

module.exports = {
  createGenerator: env => {
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
    };
  }
};
