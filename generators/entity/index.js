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
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} ${args[0]}`);
        super(args, options);

        this.entityName = this._.upperFirst(args[0]);

        const tenantName = this.blueprintConfig.get('tenantName');
        this.tenant = this.jhipsterFs.getEntity(tenantName);
        this.isTenant = this.entityName === tenantName;
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

          init() {
              // The generator jhipster:entity considers that if the file exists, the entity exists.
              // So creating a config will create the file of the mem-fs that will cause jhipster:entity
              // to consider that the entity already exists.
              this.entityConfig = this.jhipsterFs.getEntityConfig(this.entityName);
              this.entityConfig.set('name', this.entityName);

              this.entity = this.jhipsterFs.getEntity(this.entityName);
          },

          askTenantAware() {
            if (this.isTenant) return;

            // TenantAware is already defined
            this.tenantAwareDefined = this.entity.definitions.tenantAware !== undefined;
            if (this.tenantAwareDefined) {
              return;
            }

            if (this.options.defaultTenantAware !== undefined) {
              this.entity.definitions.tenantAware = this.options.defaultTenantAware;
              return;
            }

            if (this.options.relationTenantAware) {
              // Look for tenantAware entities
              // eslint-disable-next-line prettier/prettier
              this.entity.definitions.tenantAware = this._getTenantRelationship() !== undefined;
              return;
            }

            return this.prompt(
              {
                type: 'confirm',
                name: 'tenantAware',
                message: `Do you want to make ${this.entityName} tenant aware?`,
                default: this._getTenantRelationship() !== undefined
              },
              this.entityConfig
            );
          }
        };
      }

      get configuring() {
        return {
          configureTenant() {
            // Force tenant to be serviceClass
            this.entityConfig.set('service', 'serviceClass');
            this.context.service = 'serviceClass';
          },
          configureTenantAware() {
            if (this.isTenant) return;

            // Initialize config to be saved to file.
            const context = this.context;

            this._debug('Tenant aware %o', this.entity.definitions.tenantAware);
            if (this.entity.definitions.tenantAware) {
              const tenantModule = this.blueprintConfig.get('tenantModule');
              let otherEntityStateName = this.tenant.entityStateName;
              if (tenantModule) {
                otherEntityStateName = `${tenantModule}/${otherEntityStateName}`;
              }

              const defaultTenantRel = {
                relationshipName: this.tenant.entityInstance,
                otherEntityName: this.tenant.entityInstance,
                relationshipType: 'many-to-one',
                otherEntityField: 'name',
                relationshipValidateRules: 'required',
                ownerSide: true,
                clientRootFolder: this.tenant.clientRootFolder,
                otherEntityStateName,
                // Should be tenantFolderName, as of 6.4.1 this is wrong
                otherEntityFolderName: this.tenant.entityFileName,
                otherEntityAngularName: this.tenant.entityAngularName,
                otherEntityRelationshipName: this.tenant.entityInstance
              };

              const tenantRelationship = this._getTenantRelationship();

              // If tenant relationship already exists in the entity then set options
              if (!tenantRelationship) {
                this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                context.relationships.push(defaultTenantRel);
              } else {
                this._debug('Found relationship with tenant');
                // Force values
                tenantRelationship.ownerSide = true;
                tenantRelationship.relationshipValidateRules = 'required';

                // Entity-management-update.component.ts.ejs:
                // import { I<%= uniqueRel.otherEntityAngularName %> } from 'app/shared/model/<%= uniqueRel.otherEntityModelName %>.model';
                // import { <%= uniqueRel.otherEntityAngularName%>Service } from 'app/entities/<%= uniqueRel.otherEntityPath %>/<%= uniqueRel.otherEntityFileName %>.service';

                this._.defaults(tenantRelationship, defaultTenantRel);
              }
            }
          },
          configure() {
            // The generator jhipster:entity always creates a new config files, so inject our values here.
            this.storageData = this.entityConfig.getAll();
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

            const copy = (dest, source) => {
              if (context[dest] === context[source]) {
                this.log(`Not needed for ${this.jhipsterInfo.jhipsterVersion}, ${source} => ${dest}`);
              }

              context[dest] = context[source];
            };

            const copyValue = (dest, value) => {
              if (context[dest] === value) {
                this.log(`Copy value not needed for ${this.jhipsterInfo.jhipsterVersion}, ${dest}`);
              }

              context[dest] = value;
            };

            copy('entityUrl', 'tenantUrl');
            copy('entityTranslationKey', 'tenantTranslationKey');
            copy('entityTranslationKeyMenu', 'tenantMenuTranslationKey');
            copyValue('i18nKeyPrefix', `${context.angularAppName}.${context.entityTranslationKey}`);

            assert.equal(context.entityFileName, this.tenant.entityFileName);
            assert.equal(context.entityServiceFileName, this.tenant.entityFileName);
            assert.equal(context.entityStateName, this.tenant.entityStateName);
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
    };
  }
};
