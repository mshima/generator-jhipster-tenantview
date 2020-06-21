// Ignore tests with account
const file = gen => `${gen.constants.SERVER_TEST_SRC_DIR}${gen.storage.packageFolder}/web/rest/UserJWTControllerIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: 'public class UserJWTControllerIT'
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.test.web.servlet.MockMvc;'
  }
];

module.exports = {
  file,
  tmpls
};
