const file = context => context.languagesToApply.map(lang => `${context.CLIENT_MAIN_SRC_DIR}i18n/${lang}/user-management.json`);

const tmpls = [
    {
        type: 'replaceContent',
        target: /(\n(\s*)"profiles": "([\w\s]*)",)/,
        tmpl: context => `$1
$2"${context.tenantNameLowerFirst}": "${context.tenantNameUpperFirst}",`
    }
];

module.exports = {
    file,
    tmpls
};
