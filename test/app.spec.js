// const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
// const fse = require('fs-extra');

const getFilesForOptions = require('./jhipster_utils/utils').getFilesForOptions;
const expectedFiles = require('./jhipster_utils/expected-files');

const generatorsPath = require('../generators/jhipster-environment').generatorsPath;

const angularFiles = require(`${generatorsPath}/client/files-angular`).files;

describe('JHipster generator', () => {
    context('Default configuration with', () => {
        describe('AngularX', () => {
            before(done => {
                helpers
                    .run(`${generatorsPath}/app`)
                    .withOptions({ 'from-cli': true, skipInstall: true, skipChecks: true, jhiPrefix: 'test' })
                    .withPrompts({
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
                        enableTranslation: true,
                        nativeLanguage: 'en',
                        languages: ['fr'],
                        buildTool: 'maven',
                        rememberMeKey: '5c37379956bd1242f5636c8cb322c2966ad81277',
                        skipClient: false,
                        skipUserManagement: false,
                        serverSideOptions: []
                    })
                    .on('end', done);
            });

            it('creates expected default files for angularX', () => {
                assert.file(expectedFiles.common);
                assert.file(expectedFiles.server);
                assert.file(expectedFiles.userManagementServer);
                assert.file(expectedFiles.jwtServer);
                assert.file(expectedFiles.maven);
                assert.file(expectedFiles.dockerServices);
                assert.file(expectedFiles.mysql);
                assert.file(expectedFiles.hibernateTimeZoneConfig);
                assert.file(
                    getFilesForOptions(angularFiles, {
                        enableTranslation: true,
                        serviceDiscoveryType: false,
                        authenticationType: 'jwt',
                        testFrameworks: []
                    })
                );
            });
            it('contains clientFramework with angularX value', () => {
                assert.fileContent('.yo-rc.json', /"clientFramework": "angularX"/);
            });
            it('contains correct custom prefix when specified', () => {
                assert.fileContent('angular.json', /"prefix": "test"/);
            });
            it('generates a README with no undefined value', () => {
                assert.noFileContent('README.md', /undefined/);
            });
            it('uses correct prettier formatting', () => {
                // tabWidth = 2 (see generators/common/templates/.prettierrc.ejs)
                assert.fileContent('webpack/webpack.dev.js', / {2}devtool:/);
                assert.fileContent('tsconfig.json', / {2}"compilerOptions":/);
            });
        });
    });
});
