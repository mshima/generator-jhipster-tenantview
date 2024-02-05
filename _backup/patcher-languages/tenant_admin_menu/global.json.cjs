const file = data => data.languagesToApply.map(lang => `${data.CLIENT_MAIN_SRC_DIR}i18n/${lang}/global.json`);

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => '"jhipster-needle-menu-add-element": "JHipster will add additional menu entries here (do not translate!)",',
    tmpl: data => `     "${data.tenant.entityInstance}Admin": {
        "main": "${data.tenant.entityClass}",
        "userManagement": "User management",
        "jhipster-needle-menu-add-${data.tenant.entityInstance}Admin-element": "JHipster will add additional menu entries here (do not translate!)"
      },
`,
  },
];

module.exports = {
  file,
  tmpls,
};
