/* eslint-disable consistent-return */
const chalk = require('chalk');
const debug = require('debug')('tenantview:entity');

const mtUtils = require('../multitenancy-utils');
const jhipsterEnv = require('../../lib/jhipster-environment');

const EntityGenerator = jhipsterEnv.generator('entity');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        debug(`Initializing entity ${args[0]}`);
        super(args, opts);

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String
        });

        // current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.options.tenantName || this.blueprintConfig.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;
    }

    get initializing() {
        return {
            ...super._initializing(),

            /* tenant variables */
            setupTenantVariables: mtUtils.setupTenantVariables
        };
    }

    get prompting() {
        return {
            ...super._prompting(),

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
    }

    get configuring() {
        return {
            setUpVariables() {
                const context = this.context;

                const configuration = this.getAllJhipsterConfig(this, true);
                if (context.enableTranslation === undefined) {
                    context.enableTranslation = configuration.enableTranslation;
                }

                if (!this.isTenant) {
                    return;
                }

                mtUtils.validateTenant(this);

                this._copy(context, 'entityModule', 'tenantModule');
            },

            loadTenantDef() {
                const context = this.context;

                // pass to entity-* subgen
                if (this.newTenantAware === undefined) {
                    context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
                } else {
                    context.tenantAware = this.newTenantAware;
                }

                if (this.isTenant) {
                    this._copy(context, 'clientRootFolder', 'tenantClientRootFolder');
                }
            },
            preJson() {
                const context = this.context;

                if (this.isTenant) {
                    // force tenant to be serviceClass
                    context.service = 'serviceClass';
                    mtUtils.validateTenant(this);
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

                        // entity-management-update.component.ts.ejs:
                        // import { I<%= uniqueRel.otherEntityAngularName %> } from 'app/shared/model/<%= uniqueRel.otherEntityModelName %>.model';
                        // import { <%= uniqueRel.otherEntityAngularName%>Service } from 'app/entities/<%= uniqueRel.otherEntityPath %>/<%= uniqueRel.otherEntityFileName %>.service';

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
                        // Should be tenantFolderName, as of 6.4.1 this is wrong
                        if (!tenantRelationship.otherEntityFolderName) {
                            tenantRelationship.otherEntityFolderName = context.tenantFileName;
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
                        // Should be tenantFolderName, as of 6.4.1 this is wrong
                        otherEntityFolderName: context.tenantFileName,
                        otherEntityAngularName: context.tenantAngularName,
                        otherEntityRelationshipName: context.tenantInstance
                    };
                    context.relationships.push(real);
                }
            },

            ...super._configuring(),

            configureTenantFolder() {
                const context = this.context;

                const tenantRelationship = mtUtils.getArrayItemWithFieldValue(context.relationships, 'otherEntityName', context.tenantName);
                if (tenantRelationship) {
                    debug(tenantRelationship);
                }

                if (!this.isTenant) return;

                this._copy(context, 'entityFolderName', 'tenantFolderName');
                // Not needed for 6.4.1
                this._copy(context, 'entityFileName', 'tenantFileName');

                // Not needed for 6.4.1
                this._copy(context, 'entityServiceFileName', 'tenantFileName');

                // Not needed for 6.4.1
                this._copy(context, 'entityStateName', 'tenantStateName');
                this._copy(context, 'entityUrl', 'tenantUrl');

                // Not needed for 6.4.1
                this._copy(context, 'entityTranslationKey', 'tenantTranslationKey');
                // Not needed for 6.4.1
                this._copy(context, 'entityTranslationKeyMenu', 'tenantMenuTranslationKey');
                this._copy(context, 'entityModelFileName', 'tenantFolderName');
                context.i18nKeyPrefix = `${context.angularAppName}.${context.entityTranslationKey}`;
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
                // Fixed for 6.3.1
                this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
            }
        };
    }

    /* ======================================================================== */
    /* private methods use within generator (not exposed to modules) */
    /* ======================================================================== */

    _copy(context, dest, source) {
        if (context[dest] === context[source]) {
            this.log(`Not needed for ${jhipsterEnv.jhipsterVersion}, ${source} => ${dest}`);
        }
        context[dest] = context[source];
    }
};
