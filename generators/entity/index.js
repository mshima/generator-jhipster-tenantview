const assert = require('assert');
const debug = require('debug')('tenantview:entity');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const mtUtils = require('../multitenancy-utils');
const generator = 'entity';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator('info', env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} ${args[0]}`);
        super(args, options);

        if (this.options.help) {
          return;
        }

        this.entityName = this._.upperFirst(args[0]);

        const tenantName = this.blueprintConfig.get('tenantName');
        this.tenant = this.jhipsterFs.getEntity(tenantName);
        this.isTenant = this.entityName === tenantName;

        this.context = this.options.jhipsterContext.context;
        this.sbsBlueprint = true;
      }

      get prompting() {
        return {
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
            if (this.entity.definitions.tenantAware !== undefined) {
              return;
            }

            if (this.options.defaultTenantAware !== undefined) {
              this.entity.definitions.tenantAware = this.options.defaultTenantAware;
              return;
            }

            if (this.options.relationTenantAware) {
              // Look for tenantAware entities
              this.entity.definitions.tenantAware = this._getTenantRelationship() !== undefined;
              return;
            }

            if (this.options.regenerate) {
              // Regenerating the entity, undefined tenantAware means false.
              this.entity.definitions.tenantAware = false;
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
          },

          configureTenant() {
            if (!this.isTenant) return;

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
              mtUtils.configureTenantAwareEntity(this.entity, this.tenant);
              context.relationships = this.entity.definitions.relationships;
            }
          },
          configure() {
            // The generator jhipster:entity always creates a new config files, so inject our values here.
            this.storageData = this.entityConfig.getAll();
          }
        };
      }

      get configuring() {
        return {
          debug() {
            const tenantRelationship = this._getTenantRelationship();
            if (tenantRelationship) {
              debug(tenantRelationship);
            }
          },

          configureAndVerifyTenant() {
            if (!this.isTenant) return;

            const context = this.context;

            const copyValue = (dest, value) => {
              if (context[dest] === value) {
                this.log(`Copy value not needed for ${this.jhipsterInfo.jhipsterVersion}, ${dest}`);
              }

              context[dest] = value;
            };

            assert.equal(context.entityFileName, this.tenant.entityFileName);
            assert.equal(context.entityServiceFileName, this.tenant.entityFileName);
            // Assert.equal(context.entityStateName, this.tenant.entityStateName);
          }
        };
      }

      /* ======================================================================== */
      /* private methods use within generator (not exposed to modules) */
      /* ======================================================================== */

      _getTenantRelationship() {
        return mtUtils.getArrayItemWithFieldValue(this.context.relationships || [], 'otherEntityName', this.tenant.entityInstance);
      }
    };
  }
};
