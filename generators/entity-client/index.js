const debug = require('debug')('tenantview:entity:client');

const Patcher = require('../patcher');

const jhipsterEnv = require('../jhipster-environment');

const EntityClientGenerator = jhipsterEnv.generator('entity-client');

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        // npm test fails probably because of errors of first run.
        // Add ignorePatchErrors until jhipster errors as fixed.
        this.patcher = new Patcher(this);
        debug(`Initializing entity-client ${this.name}`);
    }

    get writing() {
        const postWritingSteps = {
            generateClientCode() {
                this.patcher.patch();
            }
        };
        return { ...super._writing(), ...postWritingSteps };
    }
};
