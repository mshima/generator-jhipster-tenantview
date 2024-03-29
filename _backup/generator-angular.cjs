const debug = require('debug')('tenantview:entity');
const path = require('path');
const customizer = require('generator-jhipster-customizer');

const generator = 'client';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher'),
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} blueprint`);
        super(args, options);

        this.sbsBlueprint = true;

        const tenantName = this.blueprintConfig.get('tenantName');
        if (!tenantName) {
          throw new Error(`Tenant name is required for ${generator}`);
        }

        this.tenant = this.jhipsterFs.getEntity(tenantName);
      }

      get patching() {
        return {
          patchFiles() {
            this.addVendorSCSSStyle(
              `
#home-menu-container {@extend .order-0;}
#entity-menu-container {@extend .order-1;}
#${this.tenant.entityNameLowerCase}-admin-menu-container {@extend .order-3;}
#admin-menu-container {@extend .order-10;}
#languages-menu-container {@extend .order-11;}
#account-menu-container {@extend .order-12;}
`,
              'Apply order to menu',
            );
          },
        };
      }

      _templateData() {
        const angularXAppName = this.getAngularXAppName();
        return {
          ...super._templateData(),
          angularXAppName,
          tenant: this.tenant,
        };
      }
    };
  },
};
