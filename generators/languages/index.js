/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:languages');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterEnv = require('../../lib/jhipster-environment');

const LanguagesGenerator = jhipsterEnv.generator('languages');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = class extends LanguagesGenerator {
    constructor(args, opts) {
        debug('Initializing languages blueprint');
        super(args, opts);
    }

    get writing() {
        return {
            ...super._writing(),

            /* tenant variables */
            setupTenantVariables,

            addTenantAdminMenuTranslation() {
                this.CLIENT_MAIN_SRC_DIR = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
            },

            // Apply patcher
            applyPatcher: this.applyPatcher
        };
    }
};
