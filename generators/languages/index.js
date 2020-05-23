/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:languages');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;
const generator = 'languages';

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
          /* Tenant variables */
          setupTenantVariables
        };
      }

      get end() {
        return super._end();
      }
    };
  }
};
