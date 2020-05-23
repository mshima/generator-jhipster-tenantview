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
      applyPatcher: true,
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
            this.configOptions.baseName = this.baseName;

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
          generateTenant: this._generateTenant
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
          const tenantModule = this.options.tenantModule || tenantStorage.get('tenantModule') || 'admin';
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
            tenantStore.set('fields', fields);
          }

          // Add users relationship if doesn´t exists.
          const relationships = tenantStorage.get('relationships') || [];
          if (!mtUtils.getArrayItemWithFieldValue(relationships, 'relationshipName', 'users')) {
            relationships.push({
              relationshipName: 'users',
              otherEntityName: 'user',
              relationshipType: 'one-to-many',
              otherEntityField: 'login',
              // RelationshipValidateRules: 'required',
              ownerSide: true,
              otherEntityRelationshipName: this.tenantNameLowerFirst
            });
            tenantStore.set('relationships', relationships);
          }
        } else {
          debug("Tenant doesn't exists");
          const definition = this._getDefaultDefinition();

          tenantStorage.set(definition);

          if (!this.options.withEntities) {
            const configOptions = this.configOptions;
            this.composeWith('jhipster-tenantview:entity', {
              ...this.options,
              configOptions,
              regenerate: true,
              'skip-install': false,
              debug: this.isDebugEnabled,
              arguments: [this.tenantName]
            });
          }
        }
      }

      _getDefaultDefinition() {
        const vars = mtUtils.setupTenantVariables.call(this);
        const tenantModule = this.options.tenantModule || 'admin';
        return {
          name: vars.tenantInstance,
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
              relationshipName: 'users',
              otherEntityName: 'user',
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
    };
  }
};
