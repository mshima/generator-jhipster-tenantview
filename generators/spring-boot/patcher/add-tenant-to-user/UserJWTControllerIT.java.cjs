// Ignore tests with account
const file = gen => `${gen.SERVER_TEST_SRC_DIR}${gen.packageFolder}/web/rest/UserJWTControllerIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: 'public class UserJWTControllerIT',
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.test.web.servlet.MockMvc;',
  },
];

module.exports = {
  file,
  disabled: true,
  tmpls,
};
