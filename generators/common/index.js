/* eslint-disable consistent-return */
const _ = require('lodash');
const fs = require('fs');
const debug = require('debug')('tenantview:common');

const mtUtils = require('../multitenancy-utils');
const Patcher = require('../patcher');
const jhipsterUtils = require('../utils-overrides');

const jhipsterEnv = require('../jhipster-environment');

const CommonGenerator = jhipsterEnv.generator('common');

module.exports = class extends CommonGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-name', {
            desc: 'Set tenant name',
            type: String,
            required: false
        });

        this.option('default-tenant-aware', {
            desc: 'Default for whether you make an entity tenant aware or not',
            type: Boolean,
            required: false
        });

        this.option('relation-tenant-aware', {
            desc: 'Use existing relationship with tenant',
            type: Boolean,
            defaults: false
        });

        this.tenantName = this.options.tenantName || this.blueprintConfig.get('tenantName');
        this.patcher = new Patcher(this);
    }

    get initializing() {
        const myCustomPhaseSteps = {
            loadConf() {
                this.configOptions.baseName = this.baseName;

                if (this.blueprintConfig.get('tenantChangelogDate') === undefined) {
                    this.tenantChangelogDate = this.dateFormatForLiquibase();
                    debug(`Using tenantChangelogDate ${this.tenantChangelogDate}`);
                    this.blueprintConfig.set('tenantChangelogDate', this.tenantChangelogDate);
                    this.configOptions.tenantChangelogDate = this.tenantChangelogDate;
                }

                // This will be used by entity-server to crate "@Before" annotation in TenantAspect
                this.configOptions.tenantAwareEntities = [];

                /* tenant variables */
                mtUtils.tenantVariables.call(this, this.blueprintConfig.get('tenantName'), this);
            }
        };
        return { ...super._initializing(), ...myCustomPhaseSteps };
    }

    get prompting() {
        const myCustomPhaseSteps = {
            askTenantAware() {
                const prompts = [
                    {
                        when: this.tenantName === undefined,
                        name: 'tenantName',
                        message: 'What is the alias given tenants in your application?',
                        default: 'Company',
                        validate: input => {
                            if (_.toLower(input) === 'account') {
                                return `${input} is a reserved word.`;
                            }
                            return true;
                        }
                    }
                ];
                const done = this.async();
                this.prompt(prompts).then(props => {
                    if (props.tenantName) {
                        mtUtils.tenantVariables.call(this, props.tenantName, this);
                    }
                    done();
                });
            }
        };
        return { ...super._prompting(), ...myCustomPhaseSteps };
    }

    get configuring() {
        const postConfiguringSteps = {
            saveConf() {
                this.tenantNameExists = this.blueprintConfig.get('tenantName') !== undefined;

                this.configOptions.tenantName = this.tenantName;

                this.blueprintConfig.set('tenantName', this.tenantName);
                // this.config.set('tenantChangelogDate', this.tenantChangelogDate);
            }
        };
        // configuringCustomPhaseSteps should be run after configuring, otherwise tenantName will be overridden
        return { ...super._configuring(), ...postConfiguringSteps };
    }

    get writing() {
        const preWritingSteps = {
            generateTenant() {
                if (this.tenantNameExists) {
                    debug('Ignoring entity-tenant since tenantName already is saved to .yo-rc.json');
                    return;
                }

                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../entity-tenant'), {
                    ...options,
                    configOptions,
                    regenerate: false,
                    'skip-install': false,
                    debug: this.isDebugEnabled,
                    arguments: [this.tenantName]
                });
            }
        };

        const postWritingSteps = {
            autoPatcher() {
                // npm-shrinkwrap.json vars
                this.dasherizedBaseName = _.kebabCase(this.baseName);
                this.blueprints = jhipsterUtils.loadBlueprintsFromConfiguration(this);
                this.shrinkwrapExists = fs.existsSync('npm-shrinkwrap.json');

                this.patcher.patch();
            }
        };

        return { ...preWritingSteps, ...super._writing(), ...postWritingSteps };
    }
};
