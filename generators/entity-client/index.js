const debug = require('debug')('tenantview:entity:client');
const path = require('path');

const jhipsterEnv = require('generator-jhipster-customizer');

module.exports = class extends jhipsterEnv.generator('entity-client', {
    bugfixerPaths: path.resolve(__dirname, '../../bugfixer'),
    applyPatcher: true,
    patcherPath: path.resolve(__dirname, 'patcher')
}) {
    constructor(args, opts) {
        debug(`Initializing entity-client ${opts.context.name}`);
        super(args, opts);
    }

    get writing() {
        return { ...super._writing() };
    }
};
