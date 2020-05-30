const debug = require('debug')('tenantview:languages');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const generator = 'languages';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
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

      get initializing() {
        return super._initializing();
      }

      _templateData() {
        return {
          ...super._templateData(),
          languagesToApply: this.options.jhipsterContext.languagesToApply,
          tenant: this.tenant
        };
      }
    };
  }
};
