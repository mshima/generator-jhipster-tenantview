/* eslint-disable consistent-return */
const assert = require('assert');
const chalk = require('chalk');
const debug = require('debug')('tenantview:entity');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const mtUtils = require('../multitenancy-utils');
const generator = 'entity';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      applyPatcher: true,
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} ${args[0]}`);
        super(args, options);

        // Current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.options.tenantName || this.blueprintConfig.get('tenantName'));

        // Pass to entity-* subgen
        this.context.isTenant = this.isTenant;

        console.log(this.context);
      }

      get initializing() {
        return {
          ...super._initializing(),

          /* Tenant variables */
          setupTenantVariables: mtUtils.setupTenantVariables
        };
      }

      get prompting() {
        return {
          ...super._prompting(),

          askTenantAware() {
            if (this.isTenant) return;

            const context = this.context;

            // TenantAware is already defined
            if (context.fileData !== undefined && context.fileData.tenantAware !== undefined) {
              return;
            }

            let defaultValue = false;

            if (this.options.defaultTenantAware !== undefined) {
              this.newTenantAware = this.options.defaultTenantAware;
            } else if (this.options.relationTenantAware) {
              // Look for tenantAware entities
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

            // Initialize config to be saved to file.
            this.storageData = this.storageData || {};
            const context = this.context;

            this._copy(context, 'entityModule', 'tenantModule');
            this._copy(context, 'clientRootFolder', 'tenantClientRootFolder');

            // Force tenant to be serviceClass
            context.service = this.storageData.service = 'serviceClass';

            if (context.useConfigurationFile && context.updateEntity === 'regenerate') {
              this._updateEntityConfig(this.context.filename, this.storageData);
            }
          },
          configureTenantAware() {
            if (this.isTenant) return;

            // Initialize config to be saved to file.
            this.storageData = this.storageData || {};
            const context = this.context;

            // Pass to entity-* subgen
            if (this.newTenantAware === undefined) {
              context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
            } else {
              context.tenantAware = this.storageData.tenantAware = this.newTenantAware;
              // Save
              this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} tenantAware`));
            }

            if (this.context.tenantAware) {
              if (context.service !== 'serviceClass') {
                context.service = this.storageData.service = 'serviceClass';
              }

              let otherEntityStateName = context.tenantStateName;
              if (context.tenantModule) {
                otherEntityStateName = `${context.tenantModule}/${context.tenantStateName}`;
              }

              const real = {
                relationshipName: context.tenantName,
                otherEntityName: context.tenantNameLowerFirst,
                relationshipType: 'many-to-one',
                otherEntityField: 'name',
                relationshipValidateRules: 'required',
                ownerSide: true,
                clientRootFolder: context.tenantClientRootFolder,
                otherEntityStateName,
                // Should be tenantFolderName, as of 6.4.1 this is wrong
                otherEntityFolderName: context.tenantFileName,
                otherEntityAngularName: context.tenantAngularName,
                otherEntityRelationshipName: context.tenantNameLowerFirst
              };

              const tenantRelationship = this._getTenantRelationship();
              this.storageData.relationships = context.relationships;

              // If tenant relationship already exists in the entity then set options
              if (!tenantRelationship) {
                this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                context.relationships.push(real);
              } else {
                debug('Found relationship with tenant');
                // Force values
                tenantRelationship.ownerSide = true;
                tenantRelationship.relationshipValidateRules = 'required';

                // Entity-management-update.component.ts.ejs:
                // import { I<%= uniqueRel.otherEntityAngularName %> } from 'app/shared/model/<%= uniqueRel.otherEntityModelName %>.model';
                // import { <%= uniqueRel.otherEntityAngularName%>Service } from 'app/entities/<%= uniqueRel.otherEntityPath %>/<%= uniqueRel.otherEntityFileName %>.service';

                this._.defaults(tenantRelationship, real);
              }
            }

            if (context.useConfigurationFile && context.updateEntity === 'regenerate') {
              this._updateEntityConfig(this.context.filename, this.storageData);
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
              this._updateEntityConfig(this.context.filename, this.storageData);
            }

            if (!this.context.tenantAware) return;

            if (this.configOptions.tenantAwareEntities === undefined) {
              this.configOptions.tenantAwareEntities = [];
            }

            this.configOptions.tenantAwareEntities.push(this.context.entityClass);
          }
        };
      }

      get default() {
        return super._default();
      }

      get writing() {
        return super._writing();
      }

      get end() {
        return super._end();
      }

      /* ======================================================================== */
      /* private methods use within generator (not exposed to modules) */
      /* ======================================================================== */

      _getTenantRelationship() {
        return mtUtils.getArrayItemWithFieldValue(this.context.relationships, 'otherEntityName', this.context.tenantName);
      }

      _copy(context, dest, source) {
        if (context[dest] === context[source]) {
          this.log(`Not needed for ${this.jhipsterInfo.jhipsterVersion}, ${source} => ${dest}`);
        }

        context[dest] = context[source];
      }

      _copyValue(context, dest, value) {
        if (context[dest] === value) {
          this.log(`Copy value not needed for ${this.jhipsterInfo.jhipsterVersion}, ${dest}`);
        }

        context[dest] = value;
      }

      _assert(context, dest, source) {
        assert.equal(context[dest], context[source], dest);
      }

      _updateEntityConfig(file, key, value) {
        try {
          const entityJson = this.fs.readJSON(file);
          if (value === undefined && typeof key === 'object') {
            Object.assign(entityJson, key);
          } else {
            entityJson[key] = value;
          }

          this.fs.writeJSON(file, entityJson, null, 4);
        } catch (error) {
          this.log(chalk.red('The JHipster entity configuration file could not be read!') + error);
          this.debug('Error:', error);
        }
      }
    };
  }
};
