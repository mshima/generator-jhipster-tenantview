const jhipsterEnv = require('generator-jhipster-customizer');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}spec/helpers/mock-account.service.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: /((\n\s*)getAuthenticationStateSpy: Spy;)/,
        tmpl: '$2hasAnyAuthoritySpy: Spy;$1'
    },
    {
        type: 'replaceContent',
        target: /((\n\s*)this.setIdentitySpy)/,
        tmpl: '$2this.setHasAnyAuthority(true);$1'
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)setIdentityResponse)/,
        tmpl: `
$2setHasAnyAuthority(hasAutority: boolean): void {
$2$2this.hasAnyAuthoritySpy = this.spy('hasAnyAuthority').andReturn(of(hasAutority));
$2}
$1`
    }
];

module.exports = {
    condition: context => context.testFrameworks.indexOf('protractor') !== -1,
    file,
    tmpls
};
