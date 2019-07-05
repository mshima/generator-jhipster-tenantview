const jhipsterEnv = require('../../../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entityFolderName}/${context.entityFileName}.spec.ts`;

const tmpls = [
    {
        condition: context => context.isTenant && context.testFrameworks.indexOf('protractor') !== -1,
        type: 'replaceContent',
        target: context => 'new NavBarPage();',
        tmpl: context => 'new NavBarPage(true);'
    },
    {
        condition: context => context.isTenant && context.testFrameworks.indexOf('protractor') !== -1,
        type: 'replaceContent',
        target: context => 'navBarPage.entityMenu',
        tmpl: context => 'navBarPage.adminMenu'
    },
    {
        condition: context => context.isTenant && context.testFrameworks.indexOf('protractor') !== -1,
        type: 'replaceContent',
        target: context => `await navBarPage.goToEntity('${context.entityStateName}');`,
        tmpl: context => `await navBarPage.clickOnAdminMenu();
await navBarPage.clickOnAdmin('${context.entityFileName}');`
    }
];

module.exports = {
    file,
    tmpls
};
