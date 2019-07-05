const jhipsterEnv = require('../../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/administration.spec.ts`;

const tmpls = [
    {
        // Add test of admin/tenant menu
        condition: context => context.protractorTests && !context.enableTranslation,
        type: 'rewriteFile',
        target: context => "it('should load metrics', async () => {",
        tmpl: context => `it('should load ${context.tenantNameLowerFirst} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenantFileName}');
        const expect1 = /${context.tenantNamePluralUpperFirst}/;
        const value1 = await element.all(by.css('h2#page-heading span')).first().getText();
        expect(value1).to.eq(expect1);
    });\n`
    },
    {
        condition: context => context.protractorTests && context.enableTranslation,
        type: 'rewriteFile',
        target: context => "it('should load metrics', async () => {",
        tmpl: context => `it('should load ${context.tenantNameLowerFirst} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenantFileName}');
        const expect1 = '${context.angularAppName}.${context.tenantTranslationKey}.home.title';
        const value1 = await element.all(by.css('h2#page-heading span')).first().getAttribute('jhiTranslate');
        expect(value1).to.eq(expect1);
    });\n`
    }
];

module.exports = {
    file,
    tmpls
};
