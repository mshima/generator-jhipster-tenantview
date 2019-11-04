/* eslint-disable consistent-return */
const assert = require('assert');
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
                if (this.isTenant) return;

                const context = this.context;

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
                    this.newTenantAware = this._getTenantRelationship() !== undefined;
                } else {
                    // eslint-disable-next-line prettier/prettier
                    defaultValue = this._getTenantRelationship() !== undefined;
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
            configureTenant() {
                if (!this.isTenant) return;

                const context = this.context;

                mtUtils.validateTenant(this);

                this._copy(context, 'entityModule', 'tenantModule');
                this._copy(context, 'clientRootFolder', 'tenantClientRootFolder');

                // force tenant to be serviceClass
                context.service = 'serviceClass';
            },
            configureTenantAware() {
                if (this.isTenant) return;

                const context = this.context;

                // pass to entity-* subgen
                if (this.newTenantAware === undefined) {
                    context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
                } else {
                    context.tenantAware = this.newTenantAware;

                    // Save
                    this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} tenantAware`));
                    if (context.useConfigurationFile && context.updateEntity === 'regenerate') {
                        this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
                    } else {
                        this.storageData = { tenantAware: this.context.tenantAware };
                    }
                }

                if (this.context.tenantAware) {
                    context.service = 'serviceClass';

                    let otherEntityStateName = context.tenantStateName;
                    if (context.tenantModule) {
                        otherEntityStateName = `${context.tenantModule}/${context.tenantStateName}`;
                    }

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

                    const tenantRelationship = this._getTenantRelationship();

                    // if tenant relationship already exists in the entity then set options
                    if (!tenantRelationship) {
                        this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                        context.relationships.push(real);
                        return;
                    }

                    debug('Found relationship with tenant');
                    // Force values
                    tenantRelationship.ownerSide = true;
                    tenantRelationship.relationshipValidateRules = 'required';

                    // entity-management-update.component.ts.ejs:
                    // import { I<%= uniqueRel.otherEntityAngularName %> } from 'app/shared/model/<%= uniqueRel.otherEntityModelName %>.model';
                    // import { <%= uniqueRel.otherEntityAngularName%>Service } from 'app/entities/<%= uniqueRel.otherEntityPath %>/<%= uniqueRel.otherEntityFileName %>.service';

                    this._.defaults(tenantRelationship, real);
                }
            },

            ...super._configuring(),

            debug() {
                const tenantRelationship = this._getTenantRelationship();
                if (tenantRelationship) {
                    debug(tenantRelationship);
                }
            },

            configureAndVerifyTenant() {
                if (!this.isTenant) return;

                const context = this.context;
                this._copy(context, 'entityFolderName', 'tenantFolderName');
                this._copy(context, 'entityUrl', 'tenantUrl');
                this._copy(context, 'entityModelFileName', 'tenantFolderName');
                this._copy(context, 'entityTranslationKey', 'tenantTranslationKey');
                this._copy(context, 'entityTranslationKeyMenu', 'tenantMenuTranslationKey');
                this._copyValue(context, 'i18nKeyPrefix', `${context.angularAppName}.${context.entityTranslationKey}`);

                this._assert(context, 'entityFileName', 'tenantFileName');
                this._assert(context, 'entityServiceFileName', 'tenantFileName');
                this._assert(context, 'entityStateName', 'tenantStateName');
            },
            postJson() {
                if (this.isTenant) return;

                // Super class creates a new file without tenantAware (6.1.2), so add tenantAware to it.
                // Fixed for 6.3.1
                if (this.isJhipsterVersionLessThan('6.3.1')) {
                    this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} tenantAware`));
                    this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
                }

                if (!this.context.tenantAware) return;

                if (this.configOptions.tenantAwareEntities === undefined) {
                    this.configOptions.tenantAwareEntities = [];
                }
                this.configOptions.tenantAwareEntities.push(this.context.entityClass);
            }
        };
    }

    /* ======================================================================== */
    /* private methods use within generator (not exposed to modules) */
    /* ======================================================================== */

    _getTenantRelationship() {
        return mtUtils.getArrayItemWithFieldValue(this.context.relationships, 'otherEntityName', this.context.tenantName);
    }

    _copy(context, dest, source) {
        if (context[dest] === context[source]) {
            this.log(`Not needed for ${jhipsterEnv.jhipsterVersion}, ${source} => ${dest}`);
        }
        context[dest] = context[source];
    }

    _copyValue(context, dest, value) {
        if (context[dest] === value) {
            this.log(`Copy value not needed for ${jhipsterEnv.jhipsterVersion}, ${dest}`);
        }
        context[dest] = value;
    }

    _assert(context, dest, source) {
        assert.equal(context[dest], context[source], dest);
    }
};
