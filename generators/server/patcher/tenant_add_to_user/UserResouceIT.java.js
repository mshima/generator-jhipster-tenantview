// Ignore tests with account
const file = gen => `${gen.constants.SERVER_TEST_SRC_DIR}${gen.storage.packageFolder}/web/rest/UserResourceIT.java`;

const tmpls = [
  {
    type: 'replaceContent',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.security.test.context.support.WithMockUser;'
  },
  {
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: '@WithMockUser(authorities = AuthoritiesConstants.ADMIN)'
  }
];

module.exports = {
  file,
  tmpls
};
