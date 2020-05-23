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
      }

      get initializing() {
        return super._initializing();
      }

      get prompting() {
        return super._prompting();
      }

      get configuring() {
        return super._configuring();
      }

      get default() {
        return {
          ...super._default(),

          updateLanguages() {
            // Load updated configurations.
            this.enableTranslation = this.config.get('enableTranslation');
            this.languages = this.config.get('languages');
          }
        };
      }

      get writing() {
        return super._writing();
      }

      get end() {
        return super._end();
      }
    };
  }
};
