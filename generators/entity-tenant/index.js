/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity-tenant');

const mtUtils = require('../multitenancy-utils');
const jhipsterEnv = require('../jhipster-environment');

const EntityGenerator = jhipsterEnv.generator('entity');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String,
            default: '../admin'
        });

        // current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.options.tenantName || this.blueprintConfig.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;

        debug(`Initializing entity-tenant ${args[0]}`);
    }

    get initializing() {
        const postInitializingSteps = {
            setUpVariables() {
                const context = this.context;

                const configuration = this.getAllJhipsterConfig(this, true);
                if (context.enableTranslation === undefined) {
                    context.enableTranslation = configuration.enableTranslation;
                }

                /* tenant variables */
                mtUtils.tenantVariables(configuration.get('tenantName'), context, this);
                context.clientRootFolder = context.tenantClientRootFolder;

                this.entityModule = context.tenantModule;
                context.entityModule = context.tenantModule;
            }
        };

        return { ...super._initializing(), ...postInitializingSteps };
    }

    get prompting() {
        return {};
    }

    get configuring() {
        const preConfiguringSteps = {
            preJson() {
                mtUtils.validateTenant(this);

                this.context.changelogDate = this.configOptions.tenantChangelogDate || this.blueprintConfig.get('tenantChangelogDate');
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

                context.entityFolderName = context.tenantFolderName;
                context.entityFileName = context.tenantFileName;

                context.entityServiceFileName = context.tenantFileName;

                context.entityStateName = context.tenantStateName;
                context.entityUrl = context.tenantUrl;

                context.entityTranslationKey = context.tenantTranslationKey;
                context.entityTranslationKeyMenu = context.tenantMenuTranslationKey;
                context.i18nKeyPrefix = `${context.angularAppName}.${context.entityTranslationKey}`;
                context.entityModelFileName = context.tenantFolderName;
            }
        };
        return { ...preConfiguringSteps, ...super._configuring(), ...postConfiguringSteps };
    }
};
