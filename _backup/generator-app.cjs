const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const debug = require('debug')('tenantview:app');

const customizer = require('generator-jhipster-customizer');
const mtUtils = require('../multitenancy-utils');

const generator = 'app';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher'),
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} blueprint`);
        super(args, options);

        this.option('tenant-name', {
          desc: 'Set tenant name',
          type: String,
          required: false,
        });

        this.option('default-tenant-aware', {
          desc: 'Default for whether you make an entity tenant aware or not',
          type: Boolean,
          required: false,
        });

        this.option('relation-tenant-aware', {
          desc: 'Use existing relationship with tenant',
          type: Boolean,
          defaults: false,
        });

        this.sbsBlueprint = true;

        // The method getExistingFiles() uses shelljs.ls, so we must write to disk to for the entity be found
        if (!fs.existsSync('.jhipster')) {
          fs.mkdirSync('.jhipster');
        }
      }

      get initializing() {
        return {
          loadConf() {
            if (!this.blueprintConfig.get('tenantName')) {
              if (this.options.tenantName) {
                this.blueprintConfig.set('tenantName', _.upperFirst(this.options.tenantName));
              } else {
                const tenant = this.getExistingEntities().find(entity => entity.definition.tenant);
                if (tenant) {
                  this.blueprintConfig.set('tenantName', _.upperFirst(tenant.name));
                }
              }
            }

            const tenantName = this.blueprintConfig.get('tenantName');
            if (tenantName) {
              this.info(`Using ${chalk.yellow(tenantName)} as tenant`);
            }
          },
        };
      }

      get prompting() {
        return {
          askTenantName() {
            const prompts = [
              {
                name: 'tenantName',
                message: 'What is the alias given tenants in your application?',
                default: 'Company',
                filter: tenantName => _.upperFirst(tenantName),
                validate: input => {
                  if (_.toLower(input) === 'account') {
                    return `${input} is a reserved word.`;
                  }

                  return true;
                },
              },
            ];

            return this.prompt(prompts, this.blueprintConfig);
          },
        };
      }

      get configuring() {
        return {
          generateTenant: this._generateTenant,
          configureTenantAware: this._configureTenantAware,
        };
      }

      get default() {
        return {
          composeWithTenant() {
            if (!this.forceComposeWithTenant) {
              return;
            }

            const tenantName = this.blueprintConfig.get('tenantName');
            const configOptions = this.configOptions;
            this.composeWith('jhipster:entity', {
              ...this.options,
              configOptions,
              regenerate: true,
              'skip-install': false,
              debug: this.isDebugEnabled,
              arguments: [tenantName],
            });
          },
        };
      }

      get postWriting() {
        return {
          removeRegisterFiles() {
            this.deleteDestination('/src/main/webapp/app/account/register');
          },
        };
      }

      /* ======================================================================== */
      /* private methods use within generator (not exposed to modules) */
      /* ======================================================================== */

      /**
       * return {Boolean} true if needs to be composed
       */
      _generateTenant() {
        const tenantName = this.blueprintConfig.get('tenantName');
        assert(tenantName, 'Tenant name is required');
        debug(`Generating tenant ${tenantName}`);
        const tenantStorage = this.jhipsterFs.getEntityConfig(tenantName);
        if (fs.existsSync(tenantStorage.path)) {
          debug('Tenant exists');
          tenantStorage.set({
            tenant: true,
            service: 'serviceClass',
          });

          // Add name field if doesn´t exists.
          const fields = tenantStorage.get('fields') || [];
          if (!mtUtils.getArrayItemWithFieldValue(fields, 'fieldName', 'name')) {
            fields.push({
              fieldName: 'name',
              fieldType: 'String',
              fieldValidateRules: ['required'],
            });
            tenantStorage.set('fields', fields);
          }

          // Add users relationship if doesn´t exists.
          const relationships = tenantStorage.get('relationships') || [];
          if (!mtUtils.getArrayItemWithFieldValue(relationships, 'relationshipName', 'users')) {
            relationships.push(this._getUserRelationship(tenantName));
            tenantStorage.set('relationships', relationships);
          }
        } else {
          debug("Tenant doesn't exists");
          const definition = this._getDefaultDefinition(tenantName);

          tenantStorage.set(definition);

          fs.writeFileSync(tenantStorage.path, JSON.stringify(definition, null, 2).concat('\n'));

          if (!this.options.withEntities) {
            this.forceComposeWithTenant = true;
          }
        }
      }

      _getDefaultDefinition(tenantName) {
        assert(tenantName);
        return {
          name: tenantName,
          tenant: true,
          fields: [
            {
              fieldName: 'name',
              fieldType: 'String',
              fieldValidateRules: ['required', 'minlength'],
              fieldValidateRulesMinlength: 3,
            },
            {
              fieldName: 'idName',
              fieldType: 'String',
              fieldValidateRules: ['minlength'],
              fieldValidateRulesMinlength: 3,
            },
          ],
          relationships: [this._getUserRelationship(tenantName)],
          changelogDate: this.dateFormatForLiquibase(),
          dto: 'no',
          service: 'serviceClass',
          tenantAware: false,
        };
      }

      _getUserRelationship(tenantName) {
        assert(tenantName);
        return {
          relationshipName: 'users',
          otherEntityName: 'user',
          relationshipType: 'one-to-many',
          otherEntityField: 'login',
          ownerSide: false,
          otherEntityRelationshipName: _.lowerFirst(tenantName),
        };
      }

      _configureTenantAware() {
        const tenantName = this.blueprintConfig.get('tenantName');
        const tenant = this.jhipsterFs.getEntity(tenantName);
        this.getExistingEntities()
          .filter(entity => entity.definition.tenantAware)
          .forEach(tenantAwareEntity => {
            const entity = this.jhipsterFs.getEntity(tenantAwareEntity.name);
            mtUtils.configureTenantAwareEntity(entity, tenant);
          });
      }
    };
  },
};
