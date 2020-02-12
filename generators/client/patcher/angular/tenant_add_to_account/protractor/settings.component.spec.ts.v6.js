const jhipsterEnv = require('generator-jhipster-customizer');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}spec/app/account/settings/settings.component.spec.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: /(\n(\s*)imageUrl: '')(,?)/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: 'MockCompany'$3`
    }
];

module.exports = {
    version: '6.4.0 - 6.5.1',
    file,
    tmpls
};
