/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:server');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const generator = 'server';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      applyPatcher: true,
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} blueprint`);
        super(args, options);

        // Set side-by-side blueprint
        this.sbsBlueprint = true;

        const tenantName = this.blueprintConfig.get('tenantName');
        this.tenant = this.jhipsterFs.getEntity(tenantName);
      }

      emptyFun() {}

      _templateData() {
        return {tenant: this.tenant};
      }
    };
  }
};
