const file = context => `${context.srcMainWebapp}app/account/settings/settings.component.ts`;

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)email: \[.*]])(,?)/,
    tmpl: context => `$1,
$2${context.tenant.entityInstance}: [ undefined ]$3`,
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)this.account.email = this.settingsForm.get\('email'\)!.value;)/,
    tmpl: context => `$1
$2this.account.${context.tenant.entityInstance} = this.settingsForm.get('${context.tenant.entityInstance}')!.value;`,
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)email: account.email)(,?)/,
    tmpl: context => `$1,
$2${context.tenant.entityInstance}: account.${context.tenant.entityInstance}$3`,
  },
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls,
};
