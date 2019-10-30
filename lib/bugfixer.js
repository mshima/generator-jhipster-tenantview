const semver = require('semver');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('bugfixer');

const DEFAULT_PATH = path.resolve('bugfixer');

function getCallback([moduleName, module]) {
    debug(`Adding ${moduleName} override`);
    let callback;
    if (_.isFunction(module)) {
        callback = module;
    } else {
        if (module.version) {
            const moduleVersion = require('pkginfo')(module, 'version').version;
            if (!semver.satisfies(moduleVersion, module.version)) {
                debug(`Override module ${moduleName} ignored, version ${moduleVersion} not compatible with ${module.version}`);
                return undefined;
            }
        }
        callback = module.extend;
    }
    return callback;
}

function parseModules(modules) {
    return Object.entries(modules)
        .map(getCallback)
        .filter(cb => cb !== undefined);
}

module.exports = function(Superclass, options = { path: DEFAULT_PATH }) {
    if (_.isString(Superclass)) {
        return require(Superclass);
    }
    if (_.isString(options)) {
        const path = options;
        options = { path };
    }
    const modules = require('require-dir-all')(options.path, options.requireAllOptions);
    let cbs;
    if (Array.isArray(modules)) {
        if (!modules.flatMap) {
            // Node < 11
            modules.flatMap = cb => {
                return modules.map(cb).reduce((a, b) => a.concat(b), []);
            };
        }
        cbs = modules.flatMap(parseModules);
    } else {
        cbs = parseModules(modules);
    }
    cbs.forEach(cb => {
        Superclass = cb(Superclass);
    });
    return Superclass;
};
