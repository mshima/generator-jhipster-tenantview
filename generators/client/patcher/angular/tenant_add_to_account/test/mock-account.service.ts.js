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
        target: /((\n\s*)this.getAuthenticationStateSpy = )/,
        tmpl: "$2this.hasAnyAuthoritySpy = this.spy('hasAnyAuthority').andReturn(of(true));$1"
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
    version: '>=6.6.0',
    file,
    tmpls
};
