// Ignore tests with account
const file = ctx => `${ctx.constants.SERVER_TEST_SRC_DIR}${ctx.storage.packageFolder}/web/rest/AccountResourceIT.java`;

const tmpls = [
  {
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")
@SpringBootTest(classes = {${ctx.generator.getMainClassName(ctx.storage.baseName)}.class, ${ctx.tenant.entityClass}AwareSessionTestConfiguration.class})
`,
    target: ctx => `@WithMockUser(value = TEST_USER_LOGIN)
@SpringBootTest(classes = ${ctx.generator.getMainClassName(ctx.storage.baseName)}.class)
`
  },
  {
    type: 'rewriteFile',
    tmpl: ctx => `import org.springframework.security.test.context.support.WithUserDetails;
import ${ctx.storage.packageName}.config.${ctx.tenant.entityInstance}.${ctx.tenant.entityClass}AwareSessionTestConfiguration;
`,
    target: 'import java.time.Instant;'
  },
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser("unknown_user")',
    target: 'testGetUnknownAccount()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser(TEST_USER_LOGIN)',
    target: 'testGetExistingAccount()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser(TEST_USER_LOGIN)',
    target: 'testAuthenticatedUser()'
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.junit.jupiter.api.Disabled;',
    target: 'import org.junit.jupiter.api.Test;'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccount()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccountWithWrongKey()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterAdminIsIgnored()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateEmail()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateLogin()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterValid()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidLogin()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidEmail()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterNullPassword()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidPassword()'
  }
];

module.exports = {
  file,
  tmpls
};
