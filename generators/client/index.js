/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;
const generator = 'client';

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

        this.option('tenant-root-folder', {
          desc: 'Set tenant root folder',
          type: String
        });
      }

      get writing() {
        return {
          ...super._writing(),

          setupTenantVariables,

          patchFiles() {
            this.addVendorSCSSStyle(
              `
#home-menu-container {@extend .order-0;}
#entity-menu-container {@extend .order-1;}
#${this.tenantNameLowerCase}-admin-menu-container {@extend .order-3;}
#admin-menu-container {@extend .order-10;}
#languages-menu-container {@extend .order-11;}
#account-menu-container {@extend .order-12;}
`,
              'Apply order to menu'
            );
          }
        };
      }
    };
  }
};
