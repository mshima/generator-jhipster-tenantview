const chalk = require('chalk');
const path = require('path');
const glob = require('glob');
const semver = require('semver');
const debug = require('debug')('tenantview:patcher');
const trace = require('debug')('trace:tenantview:patcher');

const packagePath = require('./jhipster-environment').packagePath;

const packagejs = require(`${packagePath}/package.json`);

const jhipsterVersion = packagejs.version;
const defaultOptions = {
    autoLoadPath: 'patcher',
    defaultLoadPath: 'partials'
};

module.exports = class Patcher {
    constructor(generator, options = {}) {
        if (!generator || !generator.error) {
            debug('generator parameter is not a generator');
            throw new Error('generator parameter is not a generator');
        }
        this.generator = generator;
        this.options = { ...defaultOptions, ...options };

        const ignorePatchErrors = generator.options.ignorePatchErrors || generator.options['ignore-patch-errors'];
        if (ignorePatchErrors !== undefined) this.options.ignorePatchErrors = ignorePatchErrors;

        // _sourceRoot is templates path from yo-generator
        // Alternative is resolved that point to generator file
        this.rootPath = path.resolve(generator._sourceRoot, `../${this.options.autoLoadPath}`);

        this.ignorePatchErrors = [];
        if (generator.options['ignore-patch-errors']) {
            this.ignorePatchErrors = generator.options['ignore-patch-errors'].split(',');
        }

        this.disableFeatures = [];
        if (generator.options['disable-tenant-features']) {
            this.disableFeatures = generator.options['disable-tenant-features'].split(',');
        }
        debug('Disabled features:');
        debug(this.disableFeatures);

        this.templates = [];
        this.fileTemplates = [];
        this.parsed = this.filter(glob.sync(`${this.rootPath}/**/*.js`));
        debug('Found patches:');

        debug(this.parsed);
        debug(this.templates);
        debug(this.fileTemplates);
    }

    patch() {
        let success = this.writeFiles();
        success = this.processPartialTemplates() && success;
        if (!success) this.generator.error('Error applying templates');
    }

    writeFiles() {
        const generator = this.generator;
        this.load(true).forEach(fileTemplate => {
            // const templatesJson = JSON.stringify(templates);
            // debug(`${templatesJson}`);
            // parse the templates and write files to the appropriate locations
            if (fileTemplate.files === undefined) {
                generator.error(`Template file should have format: { file: { feature: [ ...patches ] } } (${fileTemplate.origin})`);
            }
            this.disableFeatures.forEach(disabledFeature => {
                if (fileTemplate.files[disabledFeature] !== undefined) {
                    debug(`======== Template with feature ${disabledFeature} disabled (${fileTemplate.origin})`);
                    delete fileTemplate.files[disabledFeature];
                }
            });
            generator.writeFilesToDisk(fileTemplate.files, generator, false);
        });
        return true;
    }

    processPartialTemplates() {
        const generator = this.generator;

        let allSuccess = true;
        this.load(false).forEach(templates => {
            if (typeof templates.condition === 'function' && !templates.condition(generator)) {
                debug(`Disabled by templates condition ${templates.condition}`);
                return;
            }
            if (templates.version && !semver.satisfies(jhipsterVersion, templates.version)) {
                debug(`Patch not compatible with version ${jhipsterVersion} (${templates.version})`);
                return;
            }
            const file = typeof templates.file === 'function' ? templates.file(generator) : templates.file;
            templates.tmpls.forEach((item, index) => {
                debug(`======== Applying template ${templates.origin}[${index}] on ${file}`);
                // ignore if version is not compatible
                if (item.version && !semver.satisfies(jhipsterVersion, item.version)) {
                    debug(`Patch not compatible with version ${jhipsterVersion} (${item.version})`);
                    return;
                }
                if (item.disabled) {
                    debug('Template disabled');
                    return;
                }
                if (typeof item.condition === 'function') {
                    if (!item.condition(generator)) {
                        debug(`Disabled by condition ${item.condition}`);
                        return;
                    }
                }
                // debug(`type: ${item.type}`);
                // debug(`regex: ${item.regex}`);
                const target = typeof item.target === 'function' ? item.target(generator) : item.target;
                // debug(`target: ${target}`);

                const tmpl = typeof item.tmpl === 'function' ? item.tmpl(generator) : item.tmpl;
                // debug(`tmpl: ${tmpl}`);

                if (item.debug) {
                    try {
                        const body = generator.fs.read(file);
                        trace(`Target: ${target}`);
                        trace(body);
                        trace('Match:');
                        trace(body.match(target));
                    } catch (e) {
                        trace(`File ${file} not found`);
                    }
                }

                let success;
                if (item.type === 'replaceContent') {
                    success = generator.replaceContent(file, target, tmpl, item.regex);
                } else if (item.type === 'rewriteFile') {
                    success = generator.rewriteFile(file, target, tmpl);
                }
                let successLog = `${success}`;
                if (!success) successLog = chalk.red(`${success}`);

                debug(`======== Template finished type: ${item.type}, success: ${successLog}`);
                if (success === false || item.debug) {
                    try {
                        const body = generator.fs.read(file);
                        trace(`Target: ${target}`);
                        trace(body);
                        generator.log.error('Body:');
                        generator.log.error(body);
                        generator.log.error(`Target: ${target}`);
                        generator.log.error('Match:');
                        generator.log.error(body.match(target));
                    } catch (e) {
                        generator.log.error(`File ${file} not found`);
                        debug(`File ${file} not found`);
                    }
                }

                const ignorePatchErrors =
                    item.ignorePatchErrors || this.options.ignorePatchErrors || this.ignorePatchErrors.includes(templates.filename);
                if (!ignorePatchErrors && success === false) allSuccess = false;
            });
        });
        return allSuccess;
    }

    filter(templates) {
        const self = this;
        const parsed = templates.map(file => {
            const parse = path.parse(file);
            // Rebuild file name without extension
            const template = path.format({ ...parse, ext: undefined, base: undefined });

            const relativePath = path.relative(this.rootPath, template);

            const parseRelative = path.parse(relativePath);
            const filename = parseRelative.base;
            let feature = '';
            if (parseRelative.dir) {
                feature = parseRelative.dir.split(path.sep, 1)[0];
            }
            if (this.disableFeatures.includes(feature)) {
                debug(`======== Template with feature ${feature} disabled (${file})`);
                return undefined;
            }

            let sfilename = filename;
            const splitFileName = filename.split('.v', 2);
            if (splitFileName.length > 1) {
                if (!jhipsterVersion.startsWith(splitFileName[1])) {
                    debug(`Template ${feature} ${filename} not compatible with jhipster ${jhipsterVersion}`);
                    return undefined;
                }
                sfilename = splitFileName[0];
            }

            const ret = { origin: template, feature, filename, isFile: false };
            if (sfilename === 'files') {
                self.fileTemplates.push(file);
                ret.isFile = true;
            } else {
                self.templates.push(file);
            }
            return ret;
        });
        return parsed.filter(p => p);
    }

    load(isFile) {
        function loadTemplate(parsed) {
            const loadedTemplate = require(parsed.origin);
            Object.assign(loadedTemplate, parsed);

            debug(`======== Success loading template ${parsed.feature} ${parsed.filename}`);
            return loadedTemplate;
        }
        return this.parsed.filter(p => p.isFile === isFile).map(loadTemplate);
    }
};
