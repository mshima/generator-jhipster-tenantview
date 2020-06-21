// Ignore tests with account
const file = gen => `${gen.constants.SERVER_TEST_SRC_DIR}${gen.storage.packageFolder}/web/rest/AccountResourceIT.java`;

const tmpls = [
  {
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("bank_admin")
@SpringBootTest(classes = {JhipsterSampleApplicationApp.class, CurrentBankConfig.class})
`,
    target: ctx => `@WithMockUser(value = TEST_USER_LOGIN)
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
`
  },
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.test.web.servlet.MockMvc;'
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
  }
];

module.exports = {
  file,
  tmpls
};
