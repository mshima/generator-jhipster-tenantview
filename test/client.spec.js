const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Subgenerator client of tenantview JHipster blueprint', () => {
  describe('Sample test', () => {
    let env;
    before(function () {
      this.timeout(20000);
      return helpers
        .create('jhipster:client')
        .withLookups([{npmPaths: path.join(__dirname, '..', 'node_modules')}, {packagePaths: path.join(__dirname, '..')}])
        .withEnvironment(ctxEnv => {
          env = ctxEnv;
        })
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
