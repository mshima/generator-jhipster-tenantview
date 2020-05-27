const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Subgenerator server of tenantview JHipster blueprint', () => {
  describe('Sample test', () => {
    before(function () {
      this.timeout(15000);
      helpers
        .create('jhipster:server')
        .withLookups([{npmPaths: path.join(__dirname, '..', 'node_modules')}, {packagePaths: path.join(__dirname, '..')}])
        .withOptions({
          'from-cli': true,
          skipInstall: true,
          blueprints: 'tenantview',
          tenantName: 'Company',
          skipChecks: true
        })
        .withPrompts({
          baseName: 'sampleMysql',
          packageName: 'com.mycompany.myapp',
          applicationType: 'monolith',
          databaseType: 'sql',
          devDatabaseType: 'h2Disk',
          prodDatabaseType: 'mysql',
          cacheProvider: 'ehcache',
          authenticationType: 'session',
          enableTranslation: true,
          nativeLanguage: 'en',
          languages: ['fr', 'de'],
          buildTool: 'maven',
          rememberMeKey: '2bb60a80889aa6e6767e9ccd8714982681152aa5'
        })
        .run();
    });

    it('it works', () => {
      // Adds your tests here
      assert.textEqual('Write your own tests!', 'Write your own tests!');
    });
  });
});
