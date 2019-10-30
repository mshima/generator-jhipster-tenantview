const semver = require('semver');
const _ = require('lodash');
const debug = require('debug')('bugfixer');

const DEFAULT_PATH = 'bugfixer';

module.exports = function(Superclass, options = { path: DEFAULT_PATH }) {
    if (_.isString(Superclass)) {
        Superclass = require(Superclass);
    }
    if (_.isString(options)) {
        const path = options;
        options = { path };
    }
    const modules = require('require-dir-all')(options.path, options.requireAllOptions);
    Object.keys(modules).forEach(moduleName => {
        const module = modules[moduleName];
        debug(`Adding ${moduleName} override`);
        if (_.isFunction(module)) {
            Superclass = module(Superclass);
        } else {
            if (module.version) {
                const moduleVersion = require('pkginfo')(module, 'version').version;
                if (!semver.satisfies(moduleVersion, module.version)) {
                    debug(`Override module ${moduleName} ignored, version ${moduleVersion} not compatible with ${module.version}`);
                    return;
                }
            }
            Superclass = module.extend(Superclass);
        }
    });
    return Superclass;
};
