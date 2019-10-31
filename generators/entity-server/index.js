/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:server');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterEnv = require('../../lib/jhipster-environment');

const EntityServerGenerator = jhipsterEnv.generator('entity-server');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        debug(`Initializing entity-server ${opts.context.name}`);
        super(args, opts);
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;
    }

    get writing() {
        return {
            ...super._writing(),

            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
            },
            /* tenant variables */
            setupTenantVariables,

            // Apply patcher
            applyPatcher: this.applyPatcher,

            // make the necessary server code changes
            customServerCode() {
                const tenantisedNeedle = new TenantisedNeedle(this);
                if (this.tenantAware) {
                    tenantisedNeedle.addEntityToTenantAspect(this, this.name);
                } else if (this.isTenant) {
                    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-1__user_${this.tenantNameUpperFirst}_constraints`);
                    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-2__${this.tenantNameLowerCase}_user_data`);

                    debug('Adding already tenantised entities');
                    if (this.configOptions.tenantAwareEntities) {
                        this.configOptions.tenantAwareEntities.forEach(tenantAwareEntity => {
                            debug(`Adding entity ${tenantAwareEntity}`);
                            tenantisedNeedle.addEntityToTenantAspect(this, tenantAwareEntity);
                        });
                    }
                }
            }
        };
    }
};
