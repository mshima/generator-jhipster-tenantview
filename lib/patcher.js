import _ from 'lodash';
import chalk from 'chalk';
import path, { basename, extname } from 'path';
import { globSync } from 'glob';
import semver from 'semver';
import createDebug from 'debug';

import NeedleFile from './needle-file.js';

const debug = createDebug('customizer:patcher');
const trace = createDebug('trace:customizer:patcher');

const defaultOptions = {
  autoLoadPath: 'patcher',
  defaultLoadPath: 'partials',
};

/**
 * Verify patch if:
 * - not undefined
 * - not disabled
 * - dir is not disabled
 * - condition applies
 * - version compatibility
 */
const verify = function (generator, object, data) {
  if (object === undefined) {
    return false;
  }

  if (object.disabled) {
    debug('Template disabled');
    return false;
  }

  if (object.dir !== undefined) {
    const notVerified = object.dir.find(dir => {
      return !verify(generator, dir, data);
    });
    if (notVerified) {
      debug(`Disabled by dir condition ${notVerified.dirname}`);
      return false;
    }
  }

  if (object.condition !== undefined && ((typeof object.condition === 'function' && !object.condition(data)) || !object.condition)) {
    debug(`Disabled by condition ${object.condition}`);
    return false;
  }

  /*
  const jhipsterVersion = generator.jhipsterInfo.version;
  if (object.version && !semver.satisfies(jhipsterVersion, object.version)) {
    debug(`Patch not compatible with version ${jhipsterVersion} (${object.version})`);
    return false;
  }
  */

  return true;
};

/**
 * Load (require) template and add parsed options to it
 */
async function loadTemplate(parsed) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const loadedTemplate = await import(parsed.origin);
  const data = loadedTemplate.default ?? loadedTemplate;

  debug(`======== Success loading template ${parsed.feature} ${parsed.filename}`);
  return { ...data, ...parsed };
}

export class Patcher {
  constructor(generator, options = {}) {
    if (!generator || !generator.log) {
      debug('generator parameter is not a generator');
      throw new Error('generator parameter is not a generator');
    }

    debug(`Creating Patcher with options ${options}`);

    this.generator = generator;
    this.options = { ...defaultOptions, ...options };

    if (typeof generator.options.ignorePatchErrors === 'boolean') {
      this.options.ignorePatchErrors = generator.options.ignorePatchErrors;
    } else if (typeof generator.options['ignore-patch-errors'] === 'boolean') {
      this.options.ignorePatchErrors = generator.options['ignore-patch-errors'];
    }

    this.ignorePatchErrors = [];
    const ignorePatchErrors = this.generator.options['ignore-patch-errors'];
    if (ignorePatchErrors) {
      if (typeof ignorePatchErrors !== 'boolean') {
        this.ignorePatchErrors = ignorePatchErrors.split(',');
      }
    }

    this.disableFeatures = [];
    const disableFeatures = this.generator.options['disable-tenant-features'];
    if (disableFeatures && typeof disableFeatures !== 'boolean') {
      this.disableFeatures = disableFeatures.split(',');
    }
  }

  /**
   * Apply patches
   */
  async patch(data, options = {}) {
    debug('Patching with options %o', options);
    debug('Disabled features:');
    debug(this.disableFeatures);

    let allParsed = [];
    if (Array.isArray(options)) {
      options.forEach(options_ => {
        allParsed = allParsed.concat(this.lookForPatches(options_));
      });
    } else {
      allParsed = this.lookForPatches(options);
    }

    allParsed = _.uniqBy(allParsed, 'origin');
    debug('Found patches:');
    debug(allParsed);

    await this.applyDirs(allParsed);
    // let success = await this.writeFiles(data, allParsed);
    const success = await this.processPartialTemplates(data, allParsed);
    if (!success) {
      this.dumpFiles();
      throw new Error('Error applying templates');
    }
  }

  /**
   * Loof for patches
   */
  lookForPatches(options) {
    if (typeof options === 'string') {
      options = { rootPath: options };
    }

    // _sourceRoot is templates path from yo-generator
    // Alternative is resolved that point to generator file
    if (options.rootPath) {
      debug(`Loading patches from ${options.rootPath}`);
    } else {
      options.rootPath = path.resolve(this.generator._sourceRoot, `../${this.options.autoLoadPath}`);
    }

    options.pattern = options.pattern || `${options.rootPath}/**/*.{c,m}js`;
    debug('Looking for patches at: %s', options.pattern);
    return this.filter(globSync(options.pattern), options.rootPath);
  }

  /**
   * Print existing files on mem-fs for debugging.
   */
  dumpFiles() {
    this.generator.log('============= Files queued to be written ==========');
    this.generator.fs.store.each(file => {
      this.generator.log(file.path);
    });
    this.generator.log('=============                            ==========');
  }

  /**
   * Set dirs to the patches and files.
   */
  async applyDirs(allParsed) {
    for (const item of allParsed.filter(p => p.type === 'dir')) {
      const loaded = await loadTemplate(item);
      allParsed.forEach(parsed => {
        if (parsed.type === 'dir') {
          return;
        }

        if (parsed.origin.startsWith(loaded.dirname)) {
          parsed.dir = parsed.dir || [];
          parsed.dir.push(loaded);
        }
      });
    }
    return true;
  }

  /**
   * Write files from files.*.js
   */
  async writeFiles(data, allParsed) {
    const generator = this.generator;
    for (const item of allParsed.filter(p => p.type === 'files')) {
      const fileTemplate = await loadTemplate(item);
      if (!verify(generator, fileTemplate, data)) {
        return;
      }

      // Parse the templates and write files to the appropriate locations
      if (fileTemplate.files === undefined) {
        throw new Error(
          `Template file should have format: { files: { feature: [ ...patches ] } } (${fileTemplate.origin}), (${fileTemplate})`,
        );
      }

      let files = fileTemplate.files;
      if (typeof files === 'function') {
        files = files(data);
      }

      this.disableFeatures.forEach(disabledFeature => {
        if (files[disabledFeature] !== undefined) {
          debug(`======== Template with feature ${disabledFeature} disabled (${fileTemplate.origin})`);
          delete files[disabledFeature];
        }
      });
      generator.writeFilesToDisk(files, generator, false, fileTemplate.prefix);
    }
    return true;
  }

  /**
   * Process patches
   */
  async processPartialTemplates(data, parsed) {
    const generator = this.generator;

    let allSuccess = true;
    for (const item of parsed.filter(p => p.type === 'patch')) {
      const templates = await loadTemplate(item);
      if (!verify(generator, templates, data)) {
        continue;
      }

      let files = typeof templates.file === 'function' ? templates.file(data) : templates.file;
      if (!Array.isArray(files)) {
        files = [files];
      }

      if (templates.tmpls === undefined) {
        throw new Error(`Template file should have format: { tmpls: ... } (${templates.origin})`);
      }

      templates.tmpls.forEach((item, index) => {
        if (!verify(generator, item, data)) {
          return;
        }

        const target = typeof item.target === 'function' ? item.target(data) : item.target;
        const tmpl = typeof item.tmpl === 'function' ? item.tmpl(data) : item.tmpl;

        files.forEach(file => {
          debug(`======== Applying template ${templates.origin}[${index}] on ${file}`);

          if (item.debug) {
            try {
              const body = generator.fs.read(file);
              trace(`Target: ${target}`);
              trace(body);
              trace('Match:');
              trace(body.match(target));
            } catch (_) {
              trace(`File ${file} not found`);
            }
          }

          let success = false;
          const needleFile = new NeedleFile(file, generator.fs);
          try {
            if (item.type === 'replaceContent') {
              success = needleFile.replaceContent(target, tmpl, item.regex);
            } else if (item.type === 'rewriteFile') {
              success = needleFile.addContent(target, tmpl, item.skipTest);
            }
          } catch (error) {
            generator.log.error(error.message);
          }

          let successLog = `${success}`;
          if (!success) successLog = chalk.red(`${success}`);

          debug(`======== Template finished type: ${item.type}, success: ${successLog}`);
          if (success === false || item.debug) {
            try {
              let debugCb = message => generator.log.error(message);
              if (debug.enabled) {
                debugCb = debug;
              }

              debugCb(`File: ${templates.filename}`);
              debugCb(`Target: ${target}`);

              const body = needleFile.read();
              trace(`Target: ${target}`);
              trace(body);

              debugCb('Match:');
              debugCb(body.match(target));
              debugCb('Body:');
              debugCb(body);
            } catch (_) {
              generator.log.error(`Customizer error: file ${file} not found`);
              debug(`Customizer error: file ${file} not found`);
            }
          }

          if (success === false) {
            const ignorePatchErrors =
              item.ignorePatchErrors || this.options.ignorePatchErrors || this.ignorePatchErrors.includes(templates.filename);
            if (ignorePatchErrors) {
              generator.log.error('Error ignored');
            } else {
              allSuccess = false;
            }
          }
        });
      });
    }
    return allSuccess;
  }

  /**
   * Filter files:
   * - by type: files, patch and dir
   * - disabled features (dir names)
   * - compatible version by name
   */
  filter(templates, rootPath) {
    // const jhipsterVersion = this.generator.jhipsterInfo.version;
    const parsed = templates.map(file => {
      const parse = path.parse(file);
      const template = path.format({ ...parse, base: undefined });

      const relativePath = path.relative(rootPath, template);

      const parseRelative = path.parse(relativePath);
      const filename = parseRelative.base;
      let feature = '';
      if (parseRelative.dir) {
        feature = _.last(parseRelative.dir.split(path.sep));
      }

      if (this.disableFeatures.includes(feature)) {
        debug(`======== Template with feature ${feature} disabled (${file})`);
        return undefined;
      }

      let sfilename = filename;
      const splitFileName = filename.split('.v', 2);
      if (splitFileName.length > 1) {
        /*
        if (!jhipsterVersion.startsWith(splitFileName[1])) {
          debug(`Template ${feature} ${filename} not compatible with jhipster ${jhipsterVersion}`);
          return undefined;
        }
        */

        sfilename = splitFileName[0];
      }

      const returnValue = { origin: template, feature, filename, type: 'patch' };
      const filebase = basename(sfilename, extname(sfilename));
      if (filebase === 'files') {
        returnValue.type = 'files';
      } else if (filebase === 'index') {
        returnValue.type = 'dir';
        returnValue.dirname = `${path.dirname(file)}${path.sep}`;
      }

      return returnValue;
    });
    return parsed.filter(p => p);
  }
}

export const patcherTask = (generator, data, { options, patchOptions } = {}) => {
  const patcher = new Patcher(generator, options);
  return patcher.patch(data, patchOptions);
};
