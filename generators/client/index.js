/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity');
const path = require('path');
const jhipsterEnv = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

module.exports = class extends jhipsterEnv.generator('client', {
  improverPaths: path.resolve(__dirname, '../../improver'),
  applyPatcher: true,
  patcherPath: path.resolve(__dirname, 'patcher')
}) {
  constructor(args, options) {
    debug('Initializing client blueprint');
    super(args, options); // FromBlueprint variable is important

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
