// Ignore tests with account
const file = gen => `${gen.SERVER_TEST_SRC_DIR}${gen.packageFolder}/security/DomainUserDetailsServiceIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: 'class DomainUserDetailsServiceIT',
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.transaction.annotation.Transactional',
  },
];

module.exports = {
  file,
  tmpls,
};
