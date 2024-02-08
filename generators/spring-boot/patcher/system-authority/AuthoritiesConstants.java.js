const file = data => `${data.srcMainJava}${data.packageFolder}/security/AuthoritiesConstants.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => '    public static final String USER = "ROLE_USER";',
    tmpl: data => `public static final String ROOT_ADMIN = "ROLE_ROOT_ADMIN";
        public static final String ROOT_USER = "ROLE_ROOT_USER";
`,
  },
];

export default {
  file,
  tmpls,
};
