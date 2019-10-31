/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterEnv = require('../../lib/jhipster-environment');

const ClientGenerator = jhipsterEnv.generator('client');

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        debug('Initializing client blueprint');
        super(args, opts); // fromBlueprint variable is important

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String,
            default: '../admin'
        });
    }

    get writing() {
        return {
            ...super._writing(),

            setupTenantVariables,

            // Apply patcher
            applyPatcher: this.applyPatcher,

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
