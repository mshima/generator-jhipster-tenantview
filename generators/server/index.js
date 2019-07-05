/* eslint-disable consistent-return */
const Patcher = require('../patcher');
const mtUtils = require('../multitenancy-utils');

const jhipsterEnv = require('../jhipster-environment');

const ServerGenerator = jhipsterEnv.generator('server');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new Patcher(this);
    }

    get writing() {
        const postWritingSteps = {
            writeAdditionalFile() {
                this.packageFolder = this.config.get('packageFolder');
                // references to the various directories we'll be copying files to

                // template variables
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.blueprintConfig.get('tenantName'), this);

                this.patcher.patch();
            }
        };

        return { ...super._writing(), ...postWritingSteps };
    }
};
