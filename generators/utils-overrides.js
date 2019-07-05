const path = require('path');

const debug = require('debug')('tenantview:utils-overrides');

const jhipsterUtils = require('./jhipster-environment').utils;

/*
 * =======================
 * Implement return for patches verification
 * Init patches
 * https://github.com/jhipster/generator-jhipster/pull/10366
 */
jhipsterUtils.rewriteFile = function(args, generator) {
    debug('Running jhipsterUtils.rewriteFile');
    args.path = args.path || process.cwd();
    const fullPath = path.join(args.path, args.file);

    args.haystack = generator.fs.read(fullPath);
    const body = jhipsterUtils.rewrite(args);
    generator.fs.write(fullPath, body);
    return args.haystack !== body;
};

jhipsterUtils.replaceContent = function(args, generator) {
    args.path = args.path || process.cwd();
    const fullPath = path.join(args.path, args.file);

    const re = args.regex ? new RegExp(args.pattern, 'g') : args.pattern;

    const currentBody = generator.fs.read(fullPath);
    const newBody = currentBody.replace(re, args.content);
    generator.fs.write(fullPath, newBody);
    return newBody !== currentBody;
};
/*
 * End patches
 * https://github.com/jhipster/generator-jhipster/pull/10366
 * =======================
 */

module.exports = jhipsterUtils;
