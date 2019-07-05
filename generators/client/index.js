/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity');

const Patcher = require('../patcher');
const mtUtils = require('../multitenancy-utils');

const jhipsterEnv = require('../jhipster-environment');

const ClientGenerator = jhipsterEnv.generator('client');

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String,
            default: '../admin'
        });

        debug('Initializing client');
        this.patcher = new Patcher(this);
    }

    get writing() {
        const postWritingSteps = {
            patchFiles() {
                // template variables
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.blueprintConfig.get('tenantName'), this);
                this.patcher.patch();
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
        return { ...super._writing(), ...postWritingSteps };
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
