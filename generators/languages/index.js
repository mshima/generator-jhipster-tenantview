/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:languages');
const path = require('path');
const jhipsterEnv = require('generator-jhipster-customizer');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

module.exports = class extends jhipsterEnv.generator('languages', {
    improverPaths: path.resolve(__dirname, '../../improver'),
    applyPatcher: true,
    patcherPath: path.resolve(__dirname, 'patcher')
}) {
    constructor(args, opts) {
        debug('Initializing languages blueprint');
        super(args, opts);
    }

    get writing() {
        return {
            ...super._writing(),

            /* tenant variables */
            setupTenantVariables
        };
    }
};
