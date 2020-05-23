const file = context => `${context.constants.CLIENT_MAIN_SRC_DIR}app/account/settings/settings.component.ts`;

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)email: \[.*]])(,?)/,
    tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: [ undefined ]$3`
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)this.account.email = this.settingsForm.get\('email'\)!.value;)/,
    tmpl: context => `$1
$2this.account.${context.tenantNameLowerFirst} = this.settingsForm.get('${context.tenantNameLowerFirst}')!.value;`
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)email: account.email)(,?)/,
    tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: account.${context.tenantNameLowerFirst}$3`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
