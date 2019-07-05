const Env = require('yeoman-environment');
const path = require('path');
const chalk = require('chalk');

const debug = require('debug')('tenantview:env');

const autoExtender = require('./auto-extender');

const generatorPath = Env.lookupGenerator('jhipster:app');
const generatorsPath = path.dirname(path.dirname(generatorPath));
const packagePath = path.dirname(generatorsPath);
const utils = require(`${generatorsPath}/utils`);
const constants = require(`${generatorsPath}/generator-constants`);
const jhipsterVersion = require(`${packagePath}/package.json`).version;

console.log(`\nExtending peer generator-jhipster version ${chalk.yellow(`${jhipsterVersion}`)} at ${chalk.yellow(`${generatorsPath}`)}\n`);

const generator = function(generator) {
    const original = require(`${generatorsPath}/${generator}`);
    return class GeneratorExtender extends autoExtender(original) {
        constructor(args, opts) {
            super(args, opts);

            if (opts.inherit === undefined || opts.inherit) {
                this.inheritPriorities(original.prototype);
            }
            this.superPrototype = original.prototype;
        }

        inheritPriorities(prototype = this.superPrototype, opts = {}) {
            const self = this;
            let queueNames = opts.queueNames || this.env.runLoop.queueNames;
            queueNames = opts.force
                ? queueNames
                : queueNames.filter(queue => Object.getOwnPropertyDescriptor(Object.getPrototypeOf(self), queue) === undefined);

            debug(queueNames);
            queueNames = queueNames.filter(queue => {
                const property = Object.getOwnPropertyDescriptor(prototype, queue);
                if (property) {
                    debug(`Queueing phase ${queue}`);
                    if (property.get) {
                        self.queueMethod(property.get.call(self), queue);
                        return false;
                    }
                    self.queueMethod(property.value, queue, queue);
                    return false;
                }
                return true;
            });
        }
    };
};

module.exports = { packagePath, generatorsPath, utils, constants, generator, jhipsterVersion };
