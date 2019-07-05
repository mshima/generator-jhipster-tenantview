/* eslint-disable consistent-return */
const chalk = require('chalk');
const debug = require('debug')('tenantview:entity');

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
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.blueprintConfig.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;
        debug(`Initializing entity ${args[0]}`);
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
                mtUtils.tenantVariables.call(this, configuration.get('tenantName'), context, this);

                if (!this.isTenant) {
                    return;
                }

                mtUtils.validateTenant(this);

                this.entityModule = context.tenantModule;
                context.entityModule = context.tenantModule;
            }
        };

        return { ...super._initializing(), ...postInitializingSteps };
    }

    get prompting() {
        const postPromptingSteps = {
            askTenantAware() {
                const context = this.context;

                if (this.isTenant) return;

                // tenantAware is already defined
                if (context.fileData !== undefined && context.fileData.tenantAware !== undefined) {
                    return;
                }

                let defaultValue = false;

                if (this.options.defaultTenantAware !== undefined) {
                    this.newTenantAware = this.options.defaultTenantAware;
                } else if (this.options.relationTenantAware) {
                    // look for tenantAware entities
                    // eslint-disable-next-line prettier/prettier
                    this.newTenantAware = mtUtils.getArrayItemWithFieldValue(context.relationships, 'otherEntityName', context.tenantName) !== undefined;
                } else {
                    // eslint-disable-next-line prettier/prettier
                    defaultValue = mtUtils.getArrayItemWithFieldValue(context.relationships, 'otherEntityName', context.tenantName) !== undefined;
                }

                const prompts = [
                    {
                        when: this.newTenantAware === undefined,
                        type: 'confirm',
                        name: 'tenantAware',
                        message: `Do you want to make ${context.name} tenant aware?`,
                        default: defaultValue
                    }
                ];
                const done = this.async();
                this.prompt(prompts).then(props => {
                    if (!this.isTenant && props.tenantAware !== undefined) {
                        this.newTenantAware = props.tenantAware;
                    }
                    done();
                });
            }
        };
        return { ...super._prompting(), ...postPromptingSteps };
    }

    get configuring() {
        const preConfiguringSteps = {
            loadTenantDef() {
                const context = this.context;

                // pass to entity-* subgen
                if (this.newTenantAware === undefined) {
                    context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
                } else {
                    context.tenantAware = this.newTenantAware;
                }

                if (this.isTenant) {
                    context.clientRootFolder = context.tenantClientRootFolder;
                }
            },
            preJson() {
                const context = this.context;

                if (this.isTenant) {
                    // force tenant to be serviceClass
                    context.service = 'serviceClass';
                    context.changelogDate = this.blueprintConfig.get('tenantChangelogDate');
                    return;
                }

                if (this.context.tenantAware) {
                    context.service = 'serviceClass';

                    const tenantRelationship = mtUtils.getArrayItemWithFieldValue(
                        context.relationships,
                        'otherEntityName',
                        context.tenantName
                    );

                    let otherEntityStateName = context.tenantStateName;
                    if (context.tenantModule) {
                        otherEntityStateName = `${context.tenantModule}/${context.tenantStateName}`;
                    }
                    // if tenant relationship already exists in the entity then set options
                    if (tenantRelationship) {
                        debug('Found relationship with tenant');
                        // Force values
                        tenantRelationship.ownerSide = true;
                        tenantRelationship.relationshipValidateRules = 'required';

                        if (!tenantRelationship.relationshipType) {
                            tenantRelationship.relationshipType = 'many-to-one';
                        }
                        if (!tenantRelationship.otherEntityField) {
                            tenantRelationship.otherEntityField = 'name';
                        }
                        if (!tenantRelationship.clientRootFolder) {
                            tenantRelationship.clientRootFolder = context.tenantClientRootFolder;
                        }
                        if (!tenantRelationship.otherEntityStateName) {
                            tenantRelationship.otherEntityStateName = otherEntityStateName;
                        }
                        if (!tenantRelationship.otherEntityFolderName) {
                            tenantRelationship.otherEntityFolderName = context.tenantFolderName;
                        }
                        if (!tenantRelationship.otherEntityAngularName) {
                            tenantRelationship.otherEntityAngularName = context.tenantAngularName;
                        }
                        if (!tenantRelationship.otherEntityRelationshipName) {
                            tenantRelationship.otherEntityRelationshipName = context.tenantInstance;
                        }
                        return;
                    }

                    this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                    const real = {
                        relationshipName: context.tenantName,
                        otherEntityName: context.tenantName,
                        relationshipType: 'many-to-one',
                        otherEntityField: 'name',
                        relationshipValidateRules: 'required',
                        ownerSide: true,
                        clientRootFolder: context.tenantClientRootFolder,
                        otherEntityStateName,
                        otherEntityFolderName: context.tenantFolderName,
                        otherEntityAngularName: context.tenantAngularName,
                        otherEntityRelationshipName: context.tenantInstance
                    };
                    context.relationships.push(real);
                }
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

                if (!this.isTenant) return;

                context.entityFolderName = context.tenantFolderName;
                context.entityFileName = context.tenantFileName;

                context.entityServiceFileName = context.tenantFileName;

                context.entityStateName = context.tenantStateName;
                context.entityUrl = context.tenantUrl;

                context.entityTranslationKey = context.tenantTranslationKey;
                context.entityTranslationKeyMenu = context.tenantMenuTranslationKey;
                context.i18nKeyPrefix = `${context.angularAppName}.${context.entityTranslationKey}`;
                context.entityModelFileName = context.tenantFolderName;
            },
            postJson() {
                if (this.context.tenantAware) {
                    if (this.configOptions.tenantAwareEntities === undefined) {
                        this.configOptions.tenantAwareEntities = [];
                    }
                    this.configOptions.tenantAwareEntities.push(this.context.entityClass);
                }

                this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} tenantAware`));
                // Super class creates a new file without tenantAware (6.1.2), so add tenantAware to it.
                this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
            }
        };
        return { ...preConfiguringSteps, ...super._configuring(), ...postConfiguringSteps };
    }
};
