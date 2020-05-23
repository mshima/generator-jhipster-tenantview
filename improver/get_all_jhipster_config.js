// Const debug = require('debug')('tenantview:generator-extender:add-return-rewrite-replace');

/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround jhipster 6 workflow problem.
 */
function extend(Superclass) {
  return class GeneratorExtender extends Superclass {
    getAllJhipsterConfig(generator = this, force) {
      const configuration = Superclass.prototype.getAllJhipsterConfig.call(this, generator, force);
      const options = generator.options || {};
      const configOptions = generator.configOptions || {};
      configuration._get = configuration.get;
      configuration.get = function (key) {
        const returnValue = options[key] || configOptions[key] || configuration._get(key);
        // Debug(`${key} = ${ret}`);
        return returnValue;
      };

      return configuration;
    }
  };
}

module.exports = {
  extend
};
