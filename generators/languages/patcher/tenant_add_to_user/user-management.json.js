const file = context => context.languagesToApply.map(lang => `${context.generator.CLIENT_MAIN_SRC_DIR}i18n/${lang}/user-management.json`);

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)"profiles": "([\w\s]*)",)/,
    tmpl: context => `$1
$2"${context.tenant.entityInstance}": "${context.tenant.entityClass}",`
  }
];

module.exports = {
  file,
  tmpls
};
