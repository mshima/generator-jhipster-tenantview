/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;
const generator = 'server';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      applyPatcher: true,
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} blueprint`);
        super(args, options);

        // Set side-by-side blueprint
        this.sbsBlueprint = true;
      }

      get writing() {
        return {
          /* Tenant variables */
          setupTenantVariables,

          writeAdditionalFile() {
            this.packageFolder = this.config.get('packageFolder');
            this.packageName = this.config.get('packageName');
            // References to the various directories we'll be copying files to
          }
        };
      }

      _templateData() {
        return {...setupTenantVariables.call(this)};
      }
    };
  }
};
