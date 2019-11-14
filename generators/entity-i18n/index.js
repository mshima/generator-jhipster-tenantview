/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:i18n');
const path = require('path');
const jhipsterEnv = require('generator-jhipster-customizer');

// Needed for updated addEntityTranslationKey
module.exports = class extends jhipsterEnv.generator('entity-i18n', {
    improverPaths: path.resolve(__dirname, '../../improver'),
    applyPatcher: false,
    patcherPath: path.resolve(__dirname, 'patcher')
}) {
    constructor(args, opts) {
        debug(`Initializing entity-i18n ${opts.name}`);
        super(args, opts);
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
};
