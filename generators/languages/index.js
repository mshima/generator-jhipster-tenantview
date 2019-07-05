/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:languages');

const Patcher = require('../patcher');
const mtUtils = require('../multitenancy-utils');

const jhipsterEnv = require('../jhipster-environment');

const LanguagesGenerator = jhipsterEnv.generator('languages');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = class extends LanguagesGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new Patcher(this);
        debug('Initializing languages blueprint');
    }

    get writing() {
        const postWritingSteps = {
            addTenantAdminMenuTranslation() {
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.blueprintConfig.get('tenantName'), this);
                this.CLIENT_MAIN_SRC_DIR = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
                this.languages.forEach(language => {
                    this.lang = language;
                    this.patcher.patch();
                });
            }
        };
        return { ...super._writing(), ...postWritingSteps };
    }
};
