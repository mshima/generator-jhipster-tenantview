/* eslint-disable consistent-return */
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const debug = require('debug')('tenantview:common');

const jhipsterEnv = require('generator-jhipster-customizer');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends jhipsterEnv.generator('common', {
  improverPaths: path.resolve(__dirname, '../../improver'),
  applyPatcher: false,
  patcherPath: path.resolve(__dirname, 'patcher')
}) {
  constructor(args, options) {
    debug('Initializing common blueprint');
    super(args, options);

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
    return {
      ...super._initializing(),

      loadConf() {
        this.tenantName = this.options.tenantName || this.blueprintConfig.get('tenantName');
        this.configOptions.baseName = this.baseName;

        // This will be used by entity-server to crate "@Before" annotation in TenantAspect
        this.configOptions.tenantAwareEntities = [];
      }
    };
  }

  get prompting() {
    return {
      ...super._prompting(),

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
  }

  get configuring() {
    return {
      ...super._configuring(),

      // ConfiguringCustomPhaseSteps should be run after configuring, otherwise tenantName will be overridden
      saveConf() {
        if (!this.tenantName) return;
        this.alreadySaved = this.blueprintConfig.get('tenantName') !== undefined;

        this.tenantName = this.configOptions.tenantName = _.upperFirst(this.tenantName);
        this.blueprintConfig.set('tenantName', this.tenantName);
      },

      generateTenant: this._generateTenant
    };
  }

  /* ======================================================================== */
  /* private methods use within generator (not exposed to modules) */
  /* ======================================================================== */

  _generateTenant() {
    const tenantPath = path.join('.jhipster', `${this.tenantName}.json`);
    if (this.fs.exists(tenantPath)) {
      debug('Tenant exists');
      const definition = this.fs.readJSON(tenantPath);

      let hasChanges = false;
      if (this.options.recreateDate) {
        definition.changelogDate = this.dateFormatForLiquibase();
        hasChanges = true;
      }

      // Force some defaults
      definition.service = 'serviceClass';
      if (!definition.tenantModule || this.options.tenantModule || !definition.clientRootFolder) {
        definition.tenantModule = definition.tenantModule || this.options.tenantModule || 'admin';
        definition.clientRootFolder = `../${definition.tenantModule}`;
        hasChanges = true;
      }

      // Add name field if doesn´t exists.
      if (!mtUtils.getArrayItemWithFieldValue(definition.fields, 'fieldName', 'name')) {
        definition.fields.push({
          fieldName: 'name',
          fieldType: 'String',
          fieldValidateRules: ['required']
        });
        hasChanges = true;
      }

      // Add users relationship if doesn´t exists.
      if (!mtUtils.getArrayItemWithFieldValue(definition.relationships, 'relationshipName', 'users')) {
        definition.relationships.push({
          relationshipName: 'users',
          otherEntityName: 'user',
          relationshipType: 'one-to-many',
          otherEntityField: 'login',
          // RelationshipValidateRules: 'required',
          ownerSide: true,
          otherEntityRelationshipName: this.tenantNameLowerFirst
        });
        hasChanges = true;
      }

      if (hasChanges) {
        // Save to disc and to buffer
        fs.writeFileSync(tenantPath, JSON.stringify(definition, null, 4).concat('\n'));
        this.fs.writeJSON(tenantPath, definition, null, 4);
      }
    } else {
      debug("Tenant doesn't exists");
      const definition = this._getDefaultDefinition();
      if (!fs.existsSync('.jhipster')) {
        fs.mkdirSync('.jhipster');
      }

      // GetExistingEntities with Entities.useConfigurationFile uses wrote files.
      fs.writeFileSync(tenantPath, JSON.stringify(definition, null, 4).concat('\n'));
      // LoadEntityJson uses this.fs (mem-fs-editor) files.
      this.fs.writeJSON(tenantPath, definition, null, 4);

      if (!this.options.withEntities) {
        const configOptions = this.configOptions;
        this.composeWith(require.resolve('../entity'), {
          ...this.options,
          configOptions,
          regenerate: true,
          'skip-install': false,
          debug: this.isDebugEnabled,
          arguments: [this.tenantName]
        });
      }
    }
  }

  _getDefaultDefinition() {
    const vars = mtUtils.setupTenantVariables.call(this);
    const tenantModule = this.options.tenantModule || 'admin';
    return {
      name: vars.tenantInstance,
      fields: [
        {
          fieldName: 'name',
          fieldType: 'String',
          fieldValidateRules: ['required', 'minlength'],
          fieldValidateRulesMinlength: 3
        },
        {
          fieldName: 'idName',
          fieldType: 'String',
          fieldValidateRules: ['minlength'],
          fieldValidateRulesMinlength: 3
        }
      ],
      relationships: [
        {
          relationshipName: 'users',
          otherEntityName: 'user',
          relationshipType: 'one-to-many',
          otherEntityField: 'login',
          ownerSide: true,
          otherEntityRelationshipName: vars.tenantNameLowerFirst
        }
      ],
      changelogDate: this.dateFormatForLiquibase(),
      entityTableName: vars.tenantNameLowerCase,
      dto: 'no',
      service: 'serviceClass',
      clientRootFolder: `../${tenantModule}`,
      tenantModule,
      tenantAware: false
    };
  }
};
