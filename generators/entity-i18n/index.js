/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:i18n');
const path = require('path');

const customizer = require('generator-jhipster-customizer');
const generator = 'entity-i18n';

// Needed for updated addEntityTranslationKey
module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      applyPatcher: true,
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} ${options.name}`);
        super(args, options);

        // Set side-by-side blueprint
        this.sbsBlueprint = true;
      }

      get default() {
        return {
          updateLanguages() {
            // Load updated configurations.
            this.enableTranslation = this.config.get('enableTranslation');
            this.languages = this.config.get('languages');
          }
        };
      }
    };
  }
};
