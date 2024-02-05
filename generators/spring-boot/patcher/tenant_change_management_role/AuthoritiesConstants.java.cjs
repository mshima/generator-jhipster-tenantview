const file = gen => `${gen.SERVER_MAIN_SRC_DIR}${gen.packageFolder}/security/AuthoritiesConstants.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => '    public static final String USER = "ROLE_USER";',
    tmpl: context => `public static final String ${context.tenant.entityNameUpperCase}_ADMIN = "ROLE_${context.tenant.entityNameUpperCase}_ADMIN";
`,
  },
];

module.exports = {
  file,
  tmpls,
};
