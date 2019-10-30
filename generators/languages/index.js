/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:languages');

const Patcher = require('../../lib/patcher');
const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterEnv = require('../../lib/jhipster-environment');

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
            /* tenant variables */
            setupTenantVariables,

            addTenantAdminMenuTranslation() {
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
