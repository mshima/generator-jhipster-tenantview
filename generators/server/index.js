/* eslint-disable consistent-return */
const Patcher = require('../../lib/patcher');
const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterEnv = require('../../lib/jhipster-environment');

const ServerGenerator = jhipsterEnv.generator('server');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new Patcher(this);
    }

    get writing() {
        const postWritingSteps = {
            /* tenant variables */
            setupTenantVariables,

            writeAdditionalFile() {
                this.packageFolder = this.config.get('packageFolder');
                // references to the various directories we'll be copying files to

                this.patcher.patch();
            }
        };

        return { ...super._writing(), ...postWritingSteps };
    }
};
