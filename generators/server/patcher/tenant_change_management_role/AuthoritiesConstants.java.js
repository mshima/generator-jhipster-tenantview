const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/security/AuthoritiesConstants.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: context => '    public static final String USER = "ROLE_USER";',
    tmpl: context => `public static final String ${context.tenant.entityUpperCase}_ADMIN = "ROLE_${context.tenant.entityUpperCase}_ADMIN";
`
  }
];

module.exports = {
  file,
  tmpls
};
