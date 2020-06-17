/* eslint-disable max-nested-callbacks,new-cap */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const getFilesForOptions = require('./jhipster_utils/utils').getFilesForOptions;
const expectedFiles = require('./jhipster_utils/expected-files');
const mtExpectedFiles = require('./multitenancy_utils/expected-files');

describe('JHipster generator with tenantview blueprint no translation', () => {
  context('Default configuration with', () => {
    describe('AngularX', () => {
      let env;
      before(function () {
        this.timeout(20000);
        return helpers
          .create('jhipster:app')
          .withLookups([{npmPaths: path.join(__dirname, '..', 'node_modules')}, {packagePaths: path.join(__dirname, '..')}])
          .withEnvironment(ctxEnv => {
            env = ctxEnv;
          })
          .withOptions({
            'from-cli': true,
            skipInstall: true,
            blueprints: 'tenantview',
            creationTimestamp: '2019-09-07',
            defaultTenantAware: true,
            'abort-on-patch-error': true,
            skipChecks: true
          })
          .withPrompts({
            tenantName: 'Company',
            baseName: 'jhipster',
            clientFramework: 'angularX',
            packageName: 'com.mycompany.myapp',
            packageFolder: 'com/mycompany/myapp',
            serviceDiscoveryType: false,
            authenticationType: 'jwt',
            cacheProvider: 'ehcache',
            enableHibernateCache: true,
            databaseType: 'sql',
            devDatabaseType: 'h2Memory',
            prodDatabaseType: 'mysql',
            enableTranslation: false,
            buildTool: 'maven',
            rememberMeKey: '5c37379956bd1242f5636c8cb322c2966ad81277',
            skipClient: false,
            skipUserManagement: false,
            serverSideOptions: []
          })
          .run();
      });

      /*
            It('Force print file', () => {
                assert.fileContent('.yo-rc.json', /fail to debug/);
            });
            */

      it('tenantName is saved in .yo-rc.json', () => {
        assert.JSONFileContent('.yo-rc.json', {
          'generator-jhipster-tenantview': {tenantName: 'Company'}
        });
      });

      it('writes tenant configuration', () => {
        assert.file('.jhipster/Company.json');
      });

      it('creates expected default files with tenant files for angularX', () => {
        assert.file(expectedFiles.common);
        assert.file(expectedFiles.server);
        assert.file(expectedFiles.userManagementServer);
        assert.file(expectedFiles.jwtServer);
        assert.file(expectedFiles.maven);
        assert.file(expectedFiles.dockerServices);
        assert.file(expectedFiles.mysql);
        assert.file(expectedFiles.hibernateTimeZoneConfig);

        const packagePath = env.getPackagePath('jhipster:app');
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const angularFiles = require(`${packagePath}/generators/client/files-angular`).files;

        assert.file(
          getFilesForOptions(angularFiles, {
            enableTranslation: false,
            serviceDiscoveryType: false,
            authenticationType: 'jwt',
            testFrameworks: []
          })
        );
        assert.file(mtExpectedFiles.entity.clientNg2);
        assert.file(mtExpectedFiles.entity.server);
        assert.file(mtExpectedFiles.server);
        assert.file(mtExpectedFiles.tenantManagementServer);
      });
    });
  });
});
