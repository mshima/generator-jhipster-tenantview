const file = context => `${context.constants.CLIENT_TEST_SRC_DIR}spec/app/account/settings/settings.component.spec.ts`;

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)imageUrl: '')(,?)/,
    tmpl: context => `$1,
$2${context.tenant.entityInstance}: 'Mock${context.tenant.entityClass}'$3`
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)const settingsFormValues = {)/,
    tmpl: context => `$1
$2    ${context.tenant.entityInstance}: 'Mock${context.tenant.entityClass}',`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
