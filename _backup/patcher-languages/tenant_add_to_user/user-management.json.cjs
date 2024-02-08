const file = data => data.languagesToApply.map(lang => `${data.srcMainWebapp}i18n/${lang}/user-management.json`);

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)"profiles": "([\w\s]*)",)/,
    tmpl: context => `$1
$2"${context.tenant.entityInstance}": "${context.tenant.entityClass}",`,
  },
];

module.exports = {
  file,
  tmpls,
};
