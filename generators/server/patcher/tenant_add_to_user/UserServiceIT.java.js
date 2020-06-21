// Ignore tests with account
const file = gen => `${gen.constants.SERVER_TEST_SRC_DIR}${gen.storage.packageFolder}/service/UserServiceIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: 'public class UserServiceIT'
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.transaction.annotation.Transactional'
  }
];

module.exports = {
  file,
  tmpls
};
