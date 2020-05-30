const file = context =>
  `${context.constants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entity.entityFolderName}/${context.entity.entityFileName}.spec.ts`;

const tmpls = [
  {
    disabled: true,
    condition: context => context.isTenant && context.testFrameworks.includes('protractor'),
    type: 'replaceContent',
    target: () => 'new NavBarPage();',
    tmpl: () => 'new NavBarPage(true);'
  },
  {
    disabled: true,
    condition: context => context.isTenant && context.testFrameworks.includes('protractor'),
    type: 'replaceContent',
    target: () => 'navBarPage.entityMenu',
    tmpl: () => 'navBarPage.adminMenu'
  },
  {
    disabled: true,
    condition: context => context.isTenant && context.testFrameworks.includes('protractor'),
    type: 'replaceContent',
    target: context => `await navBarPage.goToEntity('${context.generator.entityStateName}');`,
    tmpl: context => `await navBarPage.clickOnAdminMenu();
await navBarPage.clickOnAdmin('${context.entity.entityFileName}');`
  }
];

module.exports = {
  file,
  tmpls
};
