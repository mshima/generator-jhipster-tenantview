const debug = require('debug')('tenantview:entity:client');
const path = require('path');

const customizer = require('generator-jhipster-customizer');
const generator = 'entity-client';

module.exports = {
  createGenerator: env => {
    return class extends customizer.createJHipsterGenerator(generator, env, {
      improverPaths: path.resolve(__dirname, '../../improver'),
      patcherPath: path.resolve(__dirname, 'patcher')
    }) {
      constructor(args, options) {
        debug(`Initializing ${generator} ${options.context.name}`);
        super(args, options);

        // Set side-by-side blueprint
        this.sbsBlueprint = true;

        this.entityName = this._.upperFirst(args[0]);
        this.entity = this.jhipsterFs.getEntity(this.entityName);

        const tenantName = this.blueprintConfig.get('tenantName');
        this.tenant = this.jhipsterFs.getEntity(tenantName);
        this.isTenant = this.entityName === tenantName;
      }

      emptyFun() {}

      _templateData() {
        return {
          ...super._templateData(),
          isTenant: this.isTenant,
          tenant: this.tenant,
          entity: this.entity
        };
      }
    };
  }
};
