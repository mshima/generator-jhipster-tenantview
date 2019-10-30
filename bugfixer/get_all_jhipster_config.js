// const debug = require('debug')('tenantview:generator-extender:add-return-rewrite-replace');

/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        getAllJhipsterConfig(generator = this, force) {
            const configuration = Superclass.prototype.getAllJhipsterConfig.call(this, generator, force);
            const options = generator.options || {};
            const configOptions = generator.configOptions || {};
            configuration._get = configuration.get;
            configuration.get = function(key) {
                const ret = options[key] || configOptions[key] || configuration._get(key);
                // debug(`${key} = ${ret}`);
                return ret;
            };
            return configuration;
        }
    };
}

module.exports = {
    extend
};
