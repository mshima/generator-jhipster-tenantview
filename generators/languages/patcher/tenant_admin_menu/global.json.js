const file = context => context.languagesToApply.map(lang => `${context.CLIENT_MAIN_SRC_DIR}i18n/${lang}/global.json`);

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => '"jhipster-needle-menu-add-element": "JHipster will add additional menu entries here (do not translate!)",',
        tmpl: context => `     "${context.tenantNameLowerFirst}Admin": {
        "main": "${context.tenantNameUpperFirst}",
        "userManagement": "User management",
        "jhipster-needle-menu-add-${
            context.tenantNameLowerFirst
        }Admin-element": "JHipster will add additional menu entries here (do not translate!)"
      },
`
    }
];

module.exports = {
    file,
    tmpls
};
