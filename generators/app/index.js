/* eslint-disable consistent-return */
const _ = require('lodash');
const path = require('path');
const debug = require('debug')('tenantview:common');

const customizer = require('generator-jhipster-customizer');
const mtUtils = require('../multitenancy-utils');

const generator = 'app';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} blueprint`);
        super(args, options);

        this.option('tenant-name', {
          desc: 'Set tenant name',
          type: String,
          required: false
        });

        this.option('default-tenant-aware', {
          desc: 'Default for whether you make an entity tenant aware or not',
          type: Boolean,
          required: false
        });

        this.option('relation-tenant-aware', {
          desc: 'Use existing relationship with tenant',
          type: Boolean,
          defaults: false
        });

        this.sbsBlueprint = true;
      }

      get initializing() {
        return {
          loadConf() {
            if (this.options.tenantName) {
              this.blueprintConfig.set('tenantName', _.upperFirst(this.options.tenantName));
            }

            const tenantModule = this.options.tenantModule || this.blueprintConfig.get('tenantModule') || 'admin';
            this.blueprintConfig.set('tenantModule', _.lowerFirst(tenantModule));

            // This will be used by entity-server to crate "@Before" annotation in TenantAspect
            this.configOptions.tenantAwareEntities = [];
          }
        };
      }

      get prompting() {
        return {
          askTenantAware() {
            const prompts = [
              {
                when: this.tenantName === undefined,
                name: 'tenantName',
                message: 'What is the alias given tenants in your application?',
                default: 'Company',
                filter: tenantName => _.upperFirst(tenantName),
                validate: input => {
                  if (_.toLower(input) === 'account') {
                    return `${input} is a reserved word.`;
                  }

                  return true;
                }
              }
            ];

            return this.prompt(prompts, this.blueprintConfig);
          }
        };
      }

      get default() {
        return {
          loadConfig() {
            this.tenantName = this.blueprintConfig.get('tenantName');
          }
        };
      }

      get writing() {
        return {
          entities() {
            const composeTenant = this._generateTenant();
            const composeTenantUser = this._generateTenantUser();
            if (!this.options.withEntities) {
              const configOptions = this.configOptions;
              if (composeTenant) {
                this.composeWith('jhipster-tenantview:entity', {
                  ...this.options,
                  configOptions,
                  regenerate: true,
                  'skip-install': false,
                  debug: this.isDebugEnabled,
                  arguments: [this.tenantName]
                });
              }

              if (composeTenantUser) {
                const tenantUserName = `${_.upperFirst(this.tenantName)}User`;
                this.composeWith('jhipster-tenantview:entity', {
                  ...this.options,
                  configOptions,
                  regenerate: true,
                  'skip-install': false,
                  debug: this.isDebugEnabled,
                  arguments: [tenantUserName]
                });
              }
            }
          }
        };
      }

      /* ======================================================================== */
      /* private methods use within generator (not exposed to modules) */
      /* ======================================================================== */

      _generateTenant() {
        const tenantPath = this.destinationPath(path.join('.jhipster', `${this.tenantName}.json`));
        const tenantStorage = this.createStorage(tenantPath);
        if (tenantStorage.existed) {
          debug('Tenant exists');
          const tenantModule = tenantStorage.get('tenantModule');
          tenantStorage.set({
            service: 'serviceClass',
            tenantModule,
            clientRootFolder: `../${tenantModule}`
          });

          // Add name field if doesn´t exists.
          const fields = tenantStorage.get('fields') || [];
          if (!mtUtils.getArrayItemWithFieldValue(fields, 'fieldName', 'name')) {
            fields.push({
              fieldName: 'name',
              fieldType: 'String',
              fieldValidateRules: ['required']
            });
            tenantStorage.set('fields', fields);
          }

          // Add users relationship if doesn´t exists.
          const relationships = tenantStorage.get('relationships') || [];
          if (!mtUtils.getArrayItemWithFieldValue(relationships, 'relationshipName', 'users')) {
            relationships.push({
              relationshipName: `${this.tenantNameLowerFirst}Users`,
              otherEntityName: `${this.tenantNameLowerFirst}User`,
              relationshipType: 'one-to-many',
              otherEntityField: 'login',
              // RelationshipValidateRules: 'required',
              ownerSide: true,
              otherEntityRelationshipName: this.tenantNameLowerFirst
            });
            tenantStorage.set('relationships', relationships);
          }

          return false;
        }

        debug("Tenant doesn't exists");
        const definition = this._defaultTenantDefinition();

        tenantStorage.set(definition);
        return true;
      }

      _generateTenantUser() {
        const tenantUserName = `${_.upperFirst(this.tenantName)}User`;
        const tenantUserPath = this.destinationPath(path.join('.jhipster', `${tenantUserName}.json`));
        const tenantUserStorage = this.createStorage(tenantUserPath);
        if (tenantUserStorage.existed) {
          const tenantModule = tenantUserStorage.get('tenantModule') || this.blueprintConfig.get('tenantModule');
          debug('Tenant user exists');
          tenantUserStorage.set({
            service: 'serviceClass',
            tenantModule,
            clientRootFolder: `../${tenantModule}`,
            tenantAware: true
          });

          const relationships = tenantUserStorage.get('relationships') || [];
          if (!mtUtils.getArrayItemWithFieldValue(relationships, 'relationshipName', 'user')) {
            relationships.push({
              relationshipName: `${this.tenantNameLowerFirst}Users`,
              otherEntityName: `${this.tenantNameLowerFirst}User`,
              relationshipType: 'one-to-many',
              otherEntityField: 'login',
              // RelationshipValidateRules: 'required',
              ownerSide: true,
              otherEntityRelationshipName: this.tenantNameLowerFirst
            });
            tenantUserStorage.set('relationships', relationships);
          }

          return false;
        }

        debug("Tenant user doesn't exists");
        const definition = this._defaultTenantUserDefinition(tenantUserName);

        tenantUserStorage.set(definition);
        return true;
      }

      _defaultTenantDefinition() {
        const vars = mtUtils.setupTenantVariables.call(this);
        const tenantModule = this.blueprintConfig.get('tenantModule');
        return {
          name: vars.tenantNameCapitalized,
          fields: [
            {
              fieldName: 'name',
              fieldType: 'String',
              fieldValidateRules: ['required', 'minlength'],
              fieldValidateRulesMinlength: 3
            },
            {
              fieldName: 'idName',
              fieldType: 'String',
              fieldValidateRules: ['minlength'],
              fieldValidateRulesMinlength: 3
            }
          ],
          relationships: [
            {
              relationshipName: `${this.tenantNameLowerFirst}Users`,
              otherEntityName: `${this.tenantNameLowerFirst}User`,
              relationshipType: 'one-to-many',
              otherEntityField: 'login',
              ownerSide: true,
              otherEntityRelationshipName: vars.tenantNameLowerFirst
            }
          ],
          changelogDate: this.dateFormatForLiquibase(),
          entityTableName: vars.tenantNameLowerCase,
          dto: 'no',
          service: 'serviceClass',
          clientRootFolder: `../${tenantModule}`,
          tenantModule,
          tenantAware: false
        };
      }

      _defaultTenantUserDefinition(tenantUserName) {
        const vars = mtUtils.setupTenantVariables.call(this);
        const tenantModule = this.blueprintConfig.get('tenantModule');
        return {
          name: _.upperFirst(tenantUserName),
          relationships: [
            {
              relationshipName: 'user',
              otherEntityName: 'user',
              relationshipType: 'one-to-one',
              otherEntityField: 'login',
              ownerSide: true,
              useJPADerivedIdentifier: true,
              otherEntityRelationshipName: _.lowerFirst(tenantUserName)
            },
            {
              relationshipName: vars.tenantNameLowerFirst,
              otherEntityName: vars.tenantNameLowerFirst,
              relationshipType: 'many-to-one',
              ownerSide: true,
              relationshipValidateRules: ['require'],
              otherEntityField: 'name',
              useJPADerivedIdentifier: true,
              otherEntityRelationshipName: _.lowerFirst(tenantUserName)
            }
          ],
          changelogDate: this.dateFormatForLiquibase(),
          dto: 'no',
          service: 'serviceClass',
          clientRootFolder: `../${tenantModule}`,
          tenantModule,
          tenantAware: true
        };
      }
    };
  }
};
