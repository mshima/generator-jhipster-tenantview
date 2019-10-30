/* eslint-disable consistent-return */
const _ = require('lodash');
const debug = require('debug')('tenantview:common');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;
const jhipsterEnv = require('../../lib/jhipster-environment');

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
    }

    get initializing() {
        const myCustomPhaseSteps = {
            loadConf() {
                this.tenantName = this.options.tenantName || this.blueprintConfig.get('tenantName');
                this.configOptions.baseName = this.baseName;

                if (this.blueprintConfig.get('tenantChangelogDate') === undefined) {
                    this.tenantChangelogDate = this.dateFormatForLiquibase();
                    debug(`Using tenantChangelogDate ${this.tenantChangelogDate}`);
                    this.blueprintConfig.set('tenantChangelogDate', this.tenantChangelogDate);
                    this.configOptions.tenantChangelogDate = this.tenantChangelogDate;
                }

                // This will be used by entity-server to crate "@Before" annotation in TenantAspect
                this.configOptions.tenantAwareEntities = [];
            },
            /* tenant variables */
            setupTenantVariables
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
                const self = this;
                this.prompt(prompts).then(props => {
                    if (props.tenantName) {
                        self.tenantName = props.tenantName;
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
                if (!this.tenantName) return;
                this.alreadySaved = this.blueprintConfig.get('tenantName') !== undefined;

                this.tenantName = this.configOptions.tenantName = _.camelCase(this.tenantName);
                this.blueprintConfig.set('tenantName', this.tenantName);
            }
        };
        // configuringCustomPhaseSteps should be run after configuring, otherwise tenantName will be overridden
        return { ...super._configuring(), ...postConfiguringSteps };
    }

    get writing() {
        const preWritingSteps = {
            generateTenant() {
                if (this.alreadySaved) {
                    this.log.warn('TenantName already is saved to .yo-rc.json');
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

        return { ...preWritingSteps, ...super._writing() };
    }
};
