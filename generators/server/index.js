/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:server');
const path = require('path');
const jhipsterEnv = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

module.exports = class extends jhipsterEnv.generator('server', {
    improverPaths: path.resolve(__dirname, '../../improver'),
    applyPatcher: true,
    patcherPath: path.resolve(__dirname, 'patcher')
}) {
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
            }
        };
    }
};
