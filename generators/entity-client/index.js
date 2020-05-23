const debug = require('debug')('tenantview:entity:client');
const path = require('path');

const jhipsterEnv = require('generator-jhipster-customizer');

module.exports = class extends jhipsterEnv.generator('entity-client', {
  improverPaths: path.resolve(__dirname, '../../improver'),
  applyPatcher: true,
  patcherPath: path.resolve(__dirname, 'patcher')
}) {
  constructor(args, options) {
    debug(`Initializing entity-client ${options.context.name}`);
    super(args, options);
  }

  get writing() {
    return {...super._writing()};
  }
};
