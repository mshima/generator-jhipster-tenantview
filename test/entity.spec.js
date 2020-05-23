const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const generatorsPath = require('generator-jhipster-customizer').generatorsPath;

describe('Subgenerator entity of tenantview JHipster blueprint', () => {
  describe('Sample test', () => {
    before(function () {
      this.timeout(15000);
      return helpers
        .create('jhipster:entity')
        .withLookups([{npmPaths: path.join(__dirname, '..', 'node_modules')}])
        .inTmpDir(dir => {
          fse.copySync(path.join(__dirname, '../test/templates/ngx-blueprint'), dir);
        })
        .withOptions({
          'from-cli': true,
          skipInstall: true,
          blueprints: 'tenantview',
          tenantName: 'Company',
          skipChecks: true
        })
        .withGenerators([
          [
            require('../generators/entity'), // eslint-disable-line global-require
            'jhipster-tenantview:entity',
            path.join(__dirname, '../generators/entity/index.js')
          ]
        ])
        .withArguments(['foo'])
        .withPrompts({
          fieldAdd: false,
          relationshipAdd: false,
          dto: 'no',
          service: 'no',
          pagination: 'infinite-scroll'
        })
        .run();
    });

    it('it works', () => {
      // Adds your tests here
      assert.textEqual('Write your own tests!', 'Write your own tests!');
    });
  });
});
