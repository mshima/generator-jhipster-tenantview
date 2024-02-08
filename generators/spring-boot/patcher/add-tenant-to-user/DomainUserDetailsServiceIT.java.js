// Ignore tests with account
const file = data => `${data.srcTestJava}${data.packageFolder}/security/DomainUserDetailsServiceIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: data => `@WithUserDetails("${data.tenantEntity.entityInstance}_admin")`,
    target: 'class DomainUserDetailsServiceIT',
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.transaction.annotation.Transactional',
  },
];

export default {
  file,
  tmpls,
};
