const file = context => context.languagesToApply.map(lang => `${context.CLIENT_MAIN_SRC_DIR}i18n/${lang}/global.json`);

const tmpls = [
  {
    type: 'rewriteFile',
    target: context => '"jhipster-needle-menu-add-element": "JHipster will add additional menu entries here (do not translate!)",',
    tmpl: context => `     "${context.tenant.entityInstance}Admin": {
        "main": "${context.tenant.entityClass}",
        "userManagement": "User management",
        "jhipster-needle-menu-add-${context.tenant.entityInstance}Admin-element": "JHipster will add additional menu entries here (do not translate!)"
      },
`
  }
];

module.exports = {
  file,
  tmpls
};
