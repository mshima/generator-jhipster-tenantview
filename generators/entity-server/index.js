/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:server');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const mtUtils = require('../multitenancy-utils');
const Patcher = require('../patcher');

const jhipsterEnv = require('../jhipster-environment');

const EntityServerGenerator = jhipsterEnv.generator('entity-server');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;

        this.patcher = new Patcher(this);
        debug(`Initializing entity-server ${this.name}`);
    }

    get writing() {
        const postWritingSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
            },
            // make the necessary server code changes
            customServerCode() {
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.blueprintConfig.get('tenantName'), this, this);
                this.patcher.patch();

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
        return { ...super._writing(), ...postWritingSteps };
    }
};
