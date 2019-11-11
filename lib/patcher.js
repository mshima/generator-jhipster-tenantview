const chalk = require('chalk');
const path = require('path');
const glob = require('glob');
const semver = require('semver');
const debug = require('debug')('patcher');
const trace = require('debug')('trace:patcher');

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
    }

    patch(rootPath) {
        // _sourceRoot is templates path from yo-generator
        // Alternative is resolved that point to generator file
        if (rootPath) {
            this.generator.info(`Loading patches from ${rootPath}`);
        } else {
            rootPath = path.resolve(this.generator._sourceRoot, `../${this.options.autoLoadPath}`);
        }

        this.ignorePatchErrors = [];
        if (this.generator.options['ignore-patch-errors']) {
            this.ignorePatchErrors = this.generator.options['ignore-patch-errors'].split(',');
        }

        this.disableFeatures = [];
        if (this.generator.options['disable-tenant-features']) {
            this.disableFeatures = this.generator.options['disable-tenant-features'].split(',');
        }
        debug('Disabled features:');
        debug(this.disableFeatures);

        const parsed = this.filter(glob.sync(`${rootPath}/**/*.js`), rootPath);
        debug('Found patches:');

        debug(parsed);

        let success = this.writeFiles(parsed);
        success = this.processPartialTemplates(parsed) && success;
        if (!success) {
            this.dumpFiles();
            this.generator.error('Error applying templates');
        }
    }

    dumpFiles() {
        this.generator.log('============= Files queued to be written ==========');
        this.generator.fs.store.each((file, index) => {
            this.generator.log(file.path);
        });
        this.generator.log('=============                            ==========');
    }

    writeFiles(parsed) {
        const generator = this.generator;
        this.load(parsed, true).forEach(fileTemplate => {
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

    processPartialTemplates(parsed) {
        const generator = this.generator;
        const jhipsterVersion = generator.jhipsterInfo.version;

        let allSuccess = true;
        this.load(parsed, false).forEach(templates => {
            if (typeof templates.condition === 'function' && !templates.condition(generator)) {
                debug(`Disabled by templates condition ${templates.condition}`);
                return;
            }
            if (templates.version && !semver.satisfies(jhipsterVersion, templates.version)) {
                debug(`Patch not compatible with version ${jhipsterVersion} (${templates.version})`);
                return;
            }
            let files = typeof templates.file === 'function' ? templates.file(generator) : templates.file;
            if (!Array.isArray(files)) {
                files = [files];
            }

            templates.tmpls.forEach((item, index) => {
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
                const target = typeof item.target === 'function' ? item.target(generator) : item.target;
                const tmpl = typeof item.tmpl === 'function' ? item.tmpl(generator) : item.tmpl;

                files.forEach(file => {
                    debug(`======== Applying template ${templates.origin}[${index}] on ${file}`);

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
                            generator.log.error(`Template: ${templates.filename}`);
                            generator.log.error(`Target: ${target}`);
                            generator.log.error('Match:');
                            generator.log.error(body.match(target));
                            generator.log.error('Body:');
                            generator.log.error(body);
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
        });
        return allSuccess;
    }

    filter(templates, rootPath) {
        const jhipsterVersion = this.generator.jhipsterInfo.version;
        const parsed = templates.map(file => {
            const parse = path.parse(file);
            // Rebuild file name without extension
            const template = path.format({ ...parse, ext: undefined, base: undefined });

            const relativePath = path.relative(rootPath, template);

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
                ret.isFile = true;
            }
            return ret;
        });
        return parsed.filter(p => p);
    }

    load(parsed, isFile) {
        function loadTemplate(parsed) {
            const loadedTemplate = require(parsed.origin);
            Object.assign(loadedTemplate, parsed);

            debug(`======== Success loading template ${parsed.feature} ${parsed.filename}`);
            return loadedTemplate;
        }
        return parsed.filter(p => p.isFile === isFile).map(loadTemplate);
    }
};
