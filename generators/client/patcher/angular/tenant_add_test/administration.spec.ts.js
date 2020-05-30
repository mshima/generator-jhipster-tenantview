const file = context => `${context.constants.CLIENT_TEST_SRC_DIR}e2e/admin/administration.spec.ts`;

const tmpls = [
  {
    // Add test of admin/tenant menu
    condition: context => context.protractorTests && !context.storage.enableTranslation,
    type: 'rewriteFile',
    target: () => "it('should load metrics', async () => {",
    tmpl: context => `it('should load ${context.tenant.entityInstance} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenant.entityFileName}');
        const expect1 = '${context.tenant.entityClassPlural}';
        const value1 = await element.all(by.css('h2#page-heading span')).first().getText();
        expect(value1).to.eq(expect1);
    });\n`
  },
  {
    condition: context => context.protractorTests && context.storage.enableTranslation,
    type: 'rewriteFile',
    target: () => "it('should load metrics', async () => {",
    tmpl: context => `it('should load ${context.tenant.entityInstance} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenant.entityFileName}');
        const expect1 = '${context.angularAppName}.${context.tenant.entityTranslationKey}.home.title';
        const value1 = await element.all(by.css('h2#page-heading span')).first().getAttribute('jhiTranslate');
        expect(value1).to.eq(expect1);
    });\n`
  }
];

module.exports = {
  file,
  tmpls
};
