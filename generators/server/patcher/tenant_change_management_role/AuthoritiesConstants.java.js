const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/security/AuthoritiesConstants.java`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => '    public static final String USER = "ROLE_USER";',
        tmpl: context => `public static final String ${context.tenantNameUpperCase}_ADMIN = "ROLE_${context.tenantNameUpperCase}_ADMIN";
`
    }
];

module.exports = {
    file,
    tmpls
};
