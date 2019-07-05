const jhipsterEnv = require('../../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/account/settings/settings.component.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: /(\n(\s*)imageUrl: \[\])(,?)/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: []$3`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)imageUrl: this.settingsForm.get\('imageUrl'\).value)(,?)/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: this.settingsForm.get('${context.tenantNameLowerFirst}').value$3`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)imageUrl: account.imageUrl)(,?)/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: account.${context.tenantNameLowerFirst}$3`
    }
];

module.exports = {
    version: '^6.4.0',
    file,
    tmpls
};
