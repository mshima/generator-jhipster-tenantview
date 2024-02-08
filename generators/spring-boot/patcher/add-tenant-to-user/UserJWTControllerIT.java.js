// Ignore tests with account
const file = data => `${data.srcTestJava}${data.packageFolder}/web/rest/UserJWTControllerIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: data => `@WithUserDetails("${data.tenantEntity.entityInstance}_admin")`,
    target: 'public class UserJWTControllerIT',
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.test.web.servlet.MockMvc;',
  },
];

export default {
  file,
  disabled: true,
  tmpls,
};
