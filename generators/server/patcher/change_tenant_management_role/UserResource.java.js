const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/web/rest/UserResource.java`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => '@PreAuthorize\\("hasRole\\(\\\\""',
        tmpl: context => `@PreAuthorize("hasAnyRole(\\"" + AuthoritiesConstants.${context.tenantNameUpperCase}_ADMIN + ", "`
    }
];

module.exports = {
    file,
    tmpls
};
