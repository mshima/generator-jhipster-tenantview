/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:server');

const jhipsterEnv = require('../../lib/jhipster-environment');
const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

module.exports = class extends jhipsterEnv.generator('server') {
    constructor(args, opts) {
        debug('Initializing server blueprint');
        super(args, opts);
    }

    get writing() {
        return {
            ...super._writing(),

            /* tenant variables */
            setupTenantVariables,

            writeAdditionalFile() {
                this.packageFolder = this.config.get('packageFolder');
                // references to the various directories we'll be copying files to
            },

            // Apply patcher
            applyPatcher: this.applyPatcher
        };
    }
};
